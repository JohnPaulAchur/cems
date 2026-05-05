<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->string('resource_type'); // projector, microphone, catering, etc.
            $table->decimal('cost', 10, 2);
            $table->integer('quantity_available')->default(1);
            $table->integer('quantity_booked')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
            $table->index('event_id');
            $table->index('resource_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_resources');
    }
};
