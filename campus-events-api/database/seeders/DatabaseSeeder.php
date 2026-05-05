<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Venue;
use App\Models\Event;
use App\Models\StudentClass;
use App\Models\StudentExam;
use App\Models\StudentInterest;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create venues
        $venues = [
            ['name' => 'Main Auditorium', 'location' => 'Building A', 'capacity' => 500, 'building' => 'A'],
            ['name' => 'Conference Hall', 'location' => 'Building B', 'capacity' => 200, 'building' => 'B'],
            ['name' => 'Lecture Theater 1', 'location' => 'Building C', 'capacity' => 150, 'building' => 'C'],
            ['name' => 'Seminar Room', 'location' => 'Building D', 'capacity' => 50, 'building' => 'D'],
        ];

        foreach ($venues as $venue) {
            Venue::create($venue);
        }

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@campus.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'department' => 'Administration',
            'level' => '4th Year',
        ]);

        // Create staff users
        for ($i = 1; $i <= 3; $i++) {
            User::create([
                'name' => "Staff Member $i",
                'email' => "staff$i@campus.com",
                'password' => Hash::make('password123'),
                'role' => 'staff',
                'department' => 'Student Affairs',
                'level' => null,
            ]);
        }

        // Create student users
        $departments = ['Computer Science', 'Engineering', 'Business', 'Arts'];
        $levels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        $interestTags = ['Programming', 'Web Dev', 'Mobile Dev', 'AI/ML', 'Design', 'Startup', 'Sports', 'Music', 'Tech Talks'];

        for ($i = 1; $i <= 20; $i++) {
            $dept = $departments[array_rand($departments)];
            $level = $levels[array_rand($levels)];

            $student = User::create([
                'name' => "Student $i",
                'email' => "student$i@campus.com",
                'password' => Hash::make('password123'),
                'role' => 'student',
                'department' => $dept,
                'level' => $level,
                'interests' => array_slice($interestTags, 0, rand(2, 4)),
            ]);

            // Add classes
            $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            for ($j = 0; $j < 3; $j++) {
                StudentClass::create([
                    'user_id' => $student->id,
                    'course_name' => "Course " . chr(65 + $j),
                    'day_of_week' => $days[array_rand($days)],
                    'start_time' => sprintf('%02d:00:00', rand(8, 14)),
                    'end_time' => sprintf('%02d:00:00', rand(15, 17)),
                    'semester' => '2024-Spring',
                ]);
            }

            // Add exams
            for ($j = 0; $j < 2; $j++) {
                StudentExam::create([
                    'user_id' => $student->id,
                    'exam_name' => "Exam " . chr(65 + $j),
                    'exam_date' => Carbon::now()->addDays(rand(5, 30)),
                    'exam_time' => sprintf('%02d:00:00', rand(9, 16)),
                    'duration' => rand(60, 180),
                    'location' => 'Exam Hall ' . chr(65 + rand(0, 2)),
                ]);
            }

            // Add interests
            $studentInterests = array_slice($interestTags, 0, rand(2, 4));
            foreach ($studentInterests as $interest) {
                StudentInterest::create([
                    'user_id' => $student->id,
                    'interest_tag' => $interest,
                ]);
            }
        }

        // Create sample events
        $eventCategories = ['Workshop', 'Seminar', 'Conference', 'Networking', 'Competition'];
        $organizers = User::where('role', 'staff')->get();

        for ($i = 1; $i <= 15; $i++) {
            Event::create([
                'organizer_id' => $organizers[array_rand($organizers->toArray())]->id,
                'venue_id' => rand(1, 4),
                'title' => "Event $i - " . $eventCategories[array_rand($eventCategories)],
                'description' => "This is a sample event description for event $i. It includes details about what attendees can expect.",
                'category' => $eventCategories[array_rand($eventCategories)],
                'event_date' => Carbon::now()->addDays(rand(1, 60)),
                'event_time' => sprintf('%02d:00:00', rand(9, 17)),
                'event_end_time' => sprintf('%02d:00:00', rand(14, 19)),
                'capacity' => rand(30, 200),
                'status' => 'approved',
                'tags' => array_slice($interestTags, 0, rand(2, 4)),
            ]);
        }

        echo "Database seeded successfully!\n";
        echo "Admin: admin@campus.com / password123\n";
        echo "Staff: staff1@campus.com / password123\n";
        echo "Student: student1@campus.com / password123\n";
    }
}
