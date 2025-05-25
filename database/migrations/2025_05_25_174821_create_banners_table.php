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
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('spot')->nullable();
            $table->string('images')->nullable();
            $table->integer('user_id')->nullable();
            $table->string('external_link')->nullable();
            $table->integer('banner_category_id')->nullable();
            $table->longText('message')->nullable();
            $table->integer('payment_status')->nullable()->default(0);
            $table->integer('status')->default(0);
            $table->date('expire_date')->nullable();
            $table->integer('expire_period')->nullable();
            $table->string('delete_status')->nullable();
            $table->string('cancel_status')->nullable();
            $table->boolean('override')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
