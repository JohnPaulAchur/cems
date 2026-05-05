<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\EventApproval;
use App\Models\User;
use App\Services\ScheduleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    protected $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function index(Request $request)
    {
        $query = Event::where('status', 'approved')
            ->where('event_date', '>=', now())
            ->with('organizer', 'venue');

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        $events = $query->orderBy('event_date')->paginate(20);

        return response()->json($events);
    }

    public function show(Event $event)
    {
        return response()->json($event->load('organizer', 'venue', 'registrations'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'venue_id' => 'nullable|exists:venues,id',
            'event_date' => 'required|date',
            'event_time' => 'required|date_format:H:i',
            'event_end_time' => 'nullable|date_format:H:i',
            'capacity' => 'required|integer|min:1',
            'tags' => 'nullable|array',
        ]);

        $validated['organizer_id'] = Auth::id();
        $validated['status'] = 'pending';

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event,
        ], 201);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'category' => 'string',
            'event_date' => 'date',
            'event_time' => 'date_format:H:i',
            'capacity' => 'integer|min:1',
            'tags' => 'nullable|array',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    public function register(Request $request, Event $event)
    {
        $user = Auth::user();

        // Check schedule clashes
        $clashes = $this->scheduleService->checkScheduleClashes($user, $event);

        if (!empty($clashes) && !$request->ignoreClashes) {
            return response()->json([
                'message' => 'Schedule clash detected',
                'clashes' => $clashes,
            ], 409);
        }

        // Check if already registered
        if (EventRegistration::where('user_id', $user->id)->where('event_id', $event->id)->exists()) {
            return response()->json(['message' => 'Already registered for this event'], 409);
        }

        // Check capacity
        if ($event->getRegisteredUsersCount() >= $event->capacity) {
            return response()->json(['message' => 'Event is full'], 409);
        }

        EventRegistration::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);

        return response()->json(['message' => 'Registered successfully'], 201);
    }

    public function unregister(Event $event)
    {
        $user = Auth::user();

        EventRegistration::where('user_id', $user->id)
            ->where('event_id', $event->id)
            ->delete();

        return response()->json(['message' => 'Unregistered successfully']);
    }

    public function getAttendees(Event $event)
    {
        $attendees = $event->registrations()
            ->with('user')
            ->get()
            ->pluck('user');

        return response()->json($attendees);
    }

    public function approveEvent(Request $request, Event $event)
    {
        $this->authorize('approve', $event);

        $validated = $request->validate([
            'feedback' => 'nullable|string',
        ]);

        EventApproval::create([
            'event_id' => $event->id,
            'approver_id' => Auth::id(),
            'status' => 'approved',
            'feedback' => $validated['feedback'] ?? null,
        ]);

        $event->update(['status' => 'approved']);

        return response()->json(['message' => 'Event approved']);
    }

    public function rejectEvent(Request $request, Event $event)
    {
        $this->authorize('approve', $event);

        $validated = $request->validate([
            'feedback' => 'required|string',
        ]);

        EventApproval::create([
            'event_id' => $event->id,
            'approver_id' => Auth::id(),
            'status' => 'rejected',
            'feedback' => $validated['feedback'],
        ]);

        $event->update(['status' => 'rejected']);

        return response()->json(['message' => 'Event rejected']);
    }
}
