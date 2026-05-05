<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use App\Models\RecommendationLog;
use App\Models\StudentInterest;
use Illuminate\Database\Eloquent\Collection;

class RecommendationService
{
    // Weights for different factors
    private const DEPARTMENT_WEIGHT = 0.30;
    private const INTERESTS_WEIGHT = 0.30;
    private const LEVEL_WEIGHT = 0.20;
    private const TRENDING_WEIGHT = 0.10;
    private const NETWORK_WEIGHT = 0.10;

    public function getRecommendedEvents(User $student, $limit = 10): Collection
    {
        $approvedEvents = Event::where('status', 'approved')
            ->where('event_date', '>=', now())
            ->where('organizer_id', '!=', $student->id)
            ->get();

        $scores = [];

        foreach ($approvedEvents as $event) {
            $score = $this->calculateEventScore($student, $event);
            if ($score > 0) {
                $scores[$event->id] = $score;
            }
        }

        // Sort by score descending
        arsort($scores);

        // Get top events
        $topEventIds = array_slice(array_keys($scores), 0, $limit);
        $recommendedEvents = Event::whereIn('id', $topEventIds)->get();

        // Log recommendations
        foreach ($topEventIds as $eventId) {
            RecommendationLog::create([
                'user_id' => $student->id,
                'event_id' => $eventId,
                'score' => $scores[$eventId],
            ]);
        }

        return $recommendedEvents->sortByDesc(function ($event) use ($scores) {
            return $scores[$event->id];
        })->values();
    }

    private function calculateEventScore(User $student, Event $event): float
    {
        $score = 0;

        // Department match (30%)
        $departmentMatch = $this->calculateDepartmentMatch($student, $event);
        $score += $departmentMatch * self::DEPARTMENT_WEIGHT;

        // Interests match (30%)
        $interestsMatch = $this->calculateInterestsMatch($student, $event);
        $score += $interestsMatch * self::INTERESTS_WEIGHT;

        // Level match (20%)
        $levelMatch = $this->calculateLevelMatch($student, $event);
        $score += $levelMatch * self::LEVEL_WEIGHT;

        // Trending factor (10%)
        $trendingScore = $this->calculateTrendingScore($event);
        $score += $trendingScore * self::TRENDING_WEIGHT;

        // Network factor (10%)
        $networkMatch = $this->calculateNetworkMatch($student, $event);
        $score += $networkMatch * self::NETWORK_WEIGHT;

        return min($score, 100); // Cap at 100
    }

    private function calculateDepartmentMatch(User $student, Event $event): float
    {
        if (!$student->department || !$event->organizer->department) {
            return 0;
        }

        return $student->department === $event->organizer->department ? 100 : 0;
    }

    private function calculateInterestsMatch(User $student, Event $event): float
    {
        if (!$student->interests || !$event->tags) {
            return 50; // Default neutral score
        }

        $studentInterests = is_array($student->interests) ? $student->interests : [];
        $eventTags = is_array($event->tags) ? $event->tags : [];

        if (empty($studentInterests) || empty($eventTags)) {
            return 50;
        }

        $matches = count(array_intersect($studentInterests, $eventTags));
        $totalTags = count(array_unique(array_merge($studentInterests, $eventTags)));

        return ($matches / $totalTags) * 100;
    }

    private function calculateLevelMatch(User $student, Event $event): float
    {
        if (!$student->level || !$event->organizer->level) {
            return 50;
        }

        $levels = ['1st Year' => 1, '2nd Year' => 2, '3rd Year' => 3, '4th Year' => 4];
        $studentLevel = $levels[$student->level] ?? 2;
        $eventLevel = $levels[$event->organizer->level] ?? 2;

        $diff = abs($studentLevel - $eventLevel);
        return max(0, 100 - ($diff * 20));
    }

    private function calculateTrendingScore(Event $event): float
    {
        $registrationCount = $event->getRegisteredUsersCount();
        $capacity = $event->capacity;

        if ($capacity === 0) {
            return 50;
        }

        $fillRate = ($registrationCount / $capacity) * 100;
        return min($fillRate, 100);
    }

    private function calculateNetworkMatch(User $student, Event $event): float
    {
        $eventRegistrations = $event->registrations()->count();
        $studentConnections = $student->connections()->count();

        if ($studentConnections === 0) {
            return 0;
        }

        // Check if any of student's connections are attending
        $connectedAttendees = $event->registrations()
            ->whereIn('user_id', $student->connections()->pluck('id'))
            ->count();

        return ($connectedAttendees / max($eventRegistrations, 1)) * 100;
    }
}
