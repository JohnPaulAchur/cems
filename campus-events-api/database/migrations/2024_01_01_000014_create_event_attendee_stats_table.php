<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_attendee_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->integer('total_registered')->default(0);
            $table->decimal('trending_score', 5, 2)->default(0);
            $table->timestamps();
            $table->unique('event_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_attendee_stats');
    }
};
