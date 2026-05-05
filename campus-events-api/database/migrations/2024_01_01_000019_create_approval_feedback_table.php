<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('approval_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('approval_workflow_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('feedback_text');
            $table->enum('feedback_type', ['comment', 'revision_request', 'approval', 'rejection'])->default('comment');
            $table->json('revision_items')->nullable(); // What needs to be changed
            $table->timestamps();
            $table->index('approval_workflow_id');
            $table->index('feedback_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approval_feedback');
    }
};
