<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title', 191);
            $table->longText('sub_title')->nullable();
            $table->string('category')->nullable();
            $table->string('slug', 191)->unique();
            $table->string('thumbnail', 191)->nullable();
            $table->longText('video_link')->nullable();
            $table->longText('video_thumbnail')->nullable();
            $table->longText('description')->nullable();
            $table->string('source', 191)->nullable();
            $table->text('short_description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
