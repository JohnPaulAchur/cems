<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recommendation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->decimal('score', 5, 2);
            $table->timestamps();
            $table->index('user_id');
            $table->index('event_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommendation_logs');
    }
};
