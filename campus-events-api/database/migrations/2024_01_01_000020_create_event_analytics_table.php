<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->integer('total_registered')->default(0);
            $table->integer('total_attended')->default(0);
            $table->decimal('satisfaction_score', 3, 2)->nullable();
            $table->integer('qa_questions')->default(0);
            $table->integer('qa_upvotes')->default(0);
            $table->integer('networking_connections')->default(0);
            $table->integer('study_circles_created')->default(0);
            $table->integer('feedback_submissions')->default(0);
            $table->json('department_breakdown')->nullable();
            $table->json('level_breakdown')->nullable();
            $table->decimal('no_show_rate', 5, 2)->default(0);
            $table->timestamps();
            $table->index('event_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_analytics');
    }
};
