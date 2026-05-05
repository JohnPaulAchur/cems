<?php

namespace App\Services;

use App\Models\StudentClass;
use App\Models\StudentExam;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;

class ScheduleService
{
    public function checkScheduleClashes(User $student, Event $event)
    {
        $clashes = [];

        // Get event date and time
        $eventDate = $event->event_date;
        $eventStartTime = Carbon::createFromFormat('H:i:s', $event->event_time)->format('H:i');
        $eventEndTime = $event->event_end_time ? Carbon::createFromFormat('H:i:s', $event->event_end_time)->format('H:i') : $eventStartTime;

        // Check class clashes
        $dayOfWeek = $eventDate->format('l');
        $classClashes = StudentClass::where('user_id', $student->id)
            ->where('day_of_week', $dayOfWeek)
            ->get()
            ->filter(function ($class) use ($eventStartTime, $eventEndTime) {
                return $this->timesOverlap($class->start_time, $class->end_time, $eventStartTime, $eventEndTime);
            });

        if ($classClashes->count() > 0) {
            $clashes[] = [
                'type' => 'class',
                'message' => 'Clash with classes: ' . $classClashes->pluck('course_name')->join(', '),
                'items' => $classClashes->toArray(),
            ];
        }

        // Check exam clashes
        $examClashes = StudentExam::where('user_id', $student->id)
            ->where('exam_date', $eventDate)
            ->get()
            ->filter(function ($exam) use ($eventStartTime, $eventEndTime) {
                $examTime = Carbon::createFromFormat('H:i:s', $exam->exam_time)->format('H:i');
                $examEndTime = Carbon::createFromFormat('H:i:s', $exam->exam_time)
                    ->addMinutes($exam->duration)
                    ->format('H:i');
                return $this->timesOverlap($examTime, $examEndTime, $eventStartTime, $eventEndTime);
            });

        if ($examClashes->count() > 0) {
            $clashes[] = [
                'type' => 'exam',
                'message' => 'Clash with exams: ' . $examClashes->pluck('exam_name')->join(', '),
                'items' => $examClashes->toArray(),
            ];
        }

        return $clashes;
    }

    private function timesOverlap($start1, $end1, $start2, $end2)
    {
        return strtotime($start1) < strtotime($end2) && strtotime($start2) < strtotime($end1);
    }

    public function getStudentSchedule(User $student, $semester = null)
    {
        $classes = StudentClass::where('user_id', $student->id)
            ->when($semester, function ($q) use ($semester) {
                return $q->where('semester', $semester);
            })
            ->get();

        $exams = StudentExam::where('user_id', $student->id)
            ->where('exam_date', '>=', now())
            ->orderBy('exam_date')
            ->get();

        $registeredEvents = $student->registrations()
            ->where('status', 'registered')
            ->with('event')
            ->get()
            ->pluck('event');

        return [
            'classes' => $classes,
            'exams' => $exams,
            'events' => $registeredEvents,
        ];
    }
}
