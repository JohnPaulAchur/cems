<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('venue_id')->nullable()->constrained('venues')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->dateTime('event_date');
            $table->time('event_time');
            $table->time('event_end_time')->nullable();
            $table->integer('capacity');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'cancelled'])->default('draft');
            $table->json('tags')->nullable();
            $table->timestamps();
            $table->index('organizer_id');
            $table->index('status');
            $table->index('category');
            $table->index('event_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
