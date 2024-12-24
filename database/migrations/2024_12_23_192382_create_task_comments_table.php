<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('task_comments', function (Blueprint $table) {
      $table->id();
      $table->foreignId('task_id')->constrained()->onDelete('cascade');
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->text('content');
      $table->foreignId('parent_id')->nullable()->constrained('task_comments')->onDelete('cascade');
      $table->boolean('is_edited')->default(false);
      $table->timestamps();
      $table->softDeletes();
    });
  }

  public function down(): void {
    Schema::dropIfExists('task_comments');
  }
};