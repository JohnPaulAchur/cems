<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use App\Models\StudyCircle;
use App\Models\EventRegistration;
use Illuminate\Database\Eloquent\Collection;

class NetworkingService
{
    public function getEventNetworkConnections(Event $event, User $student): Collection
    {
        // Get all students in the same courses registered for this event
        $studentCourses = $student->classes()->pluck('course_name');

        $peersInEvent = EventRegistration::where('event_id', $event->id)
            ->with('user')
            ->get()
            ->filter(function ($registration) use ($student, $studentCourses) {
                $registeredUser = $registration->user;

                // Don't include the student themselves
                if ($registeredUser->id === $student->id) {
                    return false;
                }

                // Check if user is in same courses
                $registeredUserCourses = $registeredUser->classes()->pluck('course_name');
                return count(array_intersect($studentCourses->toArray(), $registeredUserCourses->toArray())) > 0;
            })
            ->pluck('user');

        return $peersInEvent;
    }

    public function autoCreateStudyCircleForEvent(Event $event): ?StudyCircle
    {
        // Check if study circle already exists
        if ($event->studyCircles()->exists()) {
            return $event->studyCircles()->first();
        }

        // Create new study circle
        $circle = StudyCircle::create([
            'event_id' => $event->id,
            'created_by' => $event->organizer_id,
            'name' => $event->title . ' - Study Circle',
            'description' => 'Peer collaboration group for ' . $event->title,
        ]);

        // Auto-add all registered attendees to the circle
        $attendees = $event->registrations()
            ->where('status', 'registered')
            ->pluck('user_id');

        $circle->members()->attach($attendees);

        return $circle;
    }

    public function addPeersToStudyCircle(Event $event, User $student): int
    {
        // Get or create study circle
        $circle = $event->studyCircles()->first() 
            ?? $this->autoCreateStudyCircleForEvent($event);

        if (!$circle) {
            return 0;
        }

        // Get peer connections
        $peers = $this->getEventNetworkConnections($event, $student);

        $addedCount = 0;
        foreach ($peers as $peer) {
            // Add peer to circle if not already a member
            if (!$circle->members()->where('user_id', $peer->id)->exists()) {
                $circle->members()->attach($peer->id);
                $addedCount++;
            }
        }

        return $addedCount;
    }

    public function makeConnection(User $user, User $targetUser): bool
    {
        // Check if connection already exists
        if ($user->connections()->where('connected_user_id', $targetUser->id)->exists()) {
            return false;
        }

        // Create bidirectional connection
        $user->connections()->attach($targetUser->id);
        $targetUser->connections()->attach($user->id);

        return true;
    }

    public function removeConnection(User $user, User $targetUser): bool
    {
        $user->connections()->detach($targetUser->id);
        $targetUser->connections()->detach($user->id);

        return true;
    }

    public function getCommonInterests(User $user1, User $user2): array
    {
        $user1Interests = $user1->interests ?? [];
        $user2Interests = $user2->interests ?? [];

        if (is_array($user1Interests) && is_array($user2Interests)) {
            return array_intersect($user1Interests, $user2Interests);
        }

        return [];
    }

    public function recommendConnectionsForUser(User $user, $limit = 10): Collection
    {
        // Get users with common interests or same department
        $potentialConnections = User::where('id', '!=', $user->id)
            ->where('role', 'student')
            ->where(function ($q) use ($user) {
                $q->where('department', $user->department)
                    ->orWhere('level', $user->level);
            })
            ->get()
            ->filter(function ($candidate) use ($user) {
                // Don't recommend if already connected
                return !$user->connections()->where('connected_user_id', $candidate->id)->exists();
            })
            ->take($limit);

        return $potentialConnections;
    }
}
