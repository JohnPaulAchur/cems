<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventAnalytics;
use App\Models\EventRegistration;
use App\Models\AnonymousQuestion;
use App\Models\StudyCircle;
use Illuminate\Support\Collection;

class AnalyticsService
{
    /**
     * Initialize analytics for event
     */
    public function initializeAnalytics(Event $event): EventAnalytics
    {
        return EventAnalytics::firstOrCreate(
            ['event_id' => $event->id],
            [
                'total_registered' => 0,
                'total_attended' => 0,
                'satisfaction_score' => 0,
            ]
        );
    }

    /**
     * Update event analytics
     */
    public function updateAnalytics(Event $event): void
    {
        $analytics = $this->initializeAnalytics($event);

        $registered = EventRegistration::where('event_id', $event->id)->count();
        $qaQuestions = AnonymousQuestion::where('event_id', $event->id)->count();
        $studyCircles = StudyCircle::where('event_id', $event->id)->count();

        $analytics->update([
            'total_registered' => $registered,
            'qa_questions' => $qaQuestions,
            'study_circles_created' => $studyCircles,
        ]);
    }

    /**
     * Get event metrics
     */
    public function getEventMetrics(Event $event): array
    {
        $analytics = EventAnalytics::where('event_id', $event->id)->first();

        if (!$analytics) {
            $this->updateAnalytics($event);
            $analytics = EventAnalytics::where('event_id', $event->id)->first();
        }

        return [
            'event_id' => $event->id,
            'event_title' => $event->title,
            'total_registered' => $analytics->total_registered,
            'total_attended' => $analytics->total_attended,
            'attendance_rate' => $analytics->getAttendanceRate(),
            'no_show_rate' => $analytics->no_show_rate,
            'satisfaction_score' => $analytics->satisfaction_score,
            'qa_engagement' => [
                'questions' => $analytics->qa_questions,
                'upvotes' => $analytics->qa_upvotes,
            ],
            'networking' => [
                'connections' => $analytics->networking_connections,
                'study_circles' => $analytics->study_circles_created,
            ],
            'engagement_score' => $analytics->getEngagementScore(),
        ];
    }

    /**
     * Get venue utilization report
     */
    public function getVenueUtilization(): Collection
    {
        return Event::with('venue', 'analytics')
            ->get()
            ->map(function ($event) {
                $venue = $event->venue;
                $registered = $event->analytics?->total_registered ?? 0;
                $capacity = $venue->capacity ?? 100;
                
                return [
                    'venue_id' => $venue->id,
                    'venue_name' => $venue->name,
                    'capacity' => $capacity,
                    'registered' => $registered,
                    'utilization_rate' => round(($registered / $capacity) * 100, 2),
                    'event_count' => Event::where('venue_id', $venue->id)->count(),
                ];
            });
    }

    /**
     * Get attendance trends
     */
    public function getAttendanceTrends(): array
    {
        $events = Event::with('analytics')
            ->orderBy('event_date')
            ->get();

        return $events->map(function ($event) {
            return [
                'date' => $event->event_date,
                'event_title' => $event->title,
                'registered' => $event->analytics?->total_registered ?? 0,
                'attended' => $event->analytics?->total_attended ?? 0,
                'rate' => $event->analytics?->getAttendanceRate() ?? 0,
            ];
        })->toArray();
    }

    /**
     * Get engagement metrics summary
     */
    public function getEngagementMetrics(): array
    {
        $events = Event::with('analytics')->get();

        return [
            'total_questions' => $events->sum(function ($e) {
                return $e->analytics?->qa_questions ?? 0;
            }),
            'total_connections' => $events->sum(function ($e) {
                return $e->analytics?->networking_connections ?? 0;
            }),
            'total_study_circles' => $events->sum(function ($e) {
                return $e->analytics?->study_circles_created ?? 0;
            }),
            'average_satisfaction' => round(
                $events->avg(function ($e) {
                    return $e->analytics?->satisfaction_score ?? 0;
                }),
                2
            ),
        ];
    }

    /**
     * Get comprehensive dashboard report
     */
    public function getDashboardReport(): array
    {
        $events = Event::all();
        $totalEvents = $events->count();
        $totalRegistrations = EventRegistration::count();
        $averageAttendance = EventAnalytics::avg('total_attended');

        return [
            'summary' => [
                'total_events' => $totalEvents,
                'total_registrations' => $totalRegistrations,
                'average_attendance' => round($averageAttendance, 0),
            ],
            'engagement' => $this->getEngagementMetrics(),
            'venue_utilization' => $this->getVenueUtilization()->toArray(),
            'trends' => $this->getAttendanceTrends(),
        ];
    }
}
