<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('approval_workflows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->enum('current_step', ['submitted', 'review', 'revision_requested', 'approved', 'rejected'])->default('submitted');
            $table->json('workflow_history')->nullable(); // Track all changes
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('review_notes')->nullable();
            $table->dateTime('submitted_at')->nullable();
            $table->dateTime('reviewed_at')->nullable();
            $table->dateTime('revision_deadline')->nullable();
            $table->integer('revision_count')->default(0);
            $table->timestamps();
            $table->index('event_id');
            $table->index('current_step');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approval_workflows');
    }
};
