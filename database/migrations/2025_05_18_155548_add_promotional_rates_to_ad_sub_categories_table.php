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
        Schema::table('ad_sub_categories', function (Blueprint $table) {
            $table->string('feature_rate')->nullable();
            $table->string('social_share_rate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_sub_categories', function (Blueprint $table) {
            $table->dropColumn('feature_rate');
            $table->dropColumn('social_share_rate');
        });
    }
};
