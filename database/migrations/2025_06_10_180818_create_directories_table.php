<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    
    public function up()
    {
        Schema::create('directories', function (Blueprint $table) {
            $table->id(); // bigint(20) UNSIGNED equivalent
            $table->integer('user_id')->nullable();
            $table->string('businessName', 191)->nullable();
            $table->string('address', 191)->nullable();
            $table->string('suite', 191)->nullable();
            $table->string('latitude', 191)->nullable();
            $table->string('longitude', 191)->nullable();
            $table->string('city', 191)->nullable();
            $table->string('category', 191)->nullable();
            $table->text('subCategory')->nullable();
            $table->longText('description')->nullable();
            $table->string('workingHour', 191)->nullable();
            $table->text('days')->nullable();
            $table->string('startTime', 191)->nullable();
            $table->string('endTime', 191)->nullable();
            $table->string('telNo', 191)->nullable();
            $table->string('altTelNo', 191)->nullable();
            $table->string('email', 191)->nullable();
            $table->string('website', 191)->nullable();
            $table->string('facebook', 191)->nullable();
            $table->string('instagram', 191)->nullable();
            $table->string('yelp', 191)->nullable();
            $table->string('youtube', 191)->nullable();
            $table->string('logo', 191)->nullable();
            $table->integer('status')->nullable();
            $table->string('unique_id', 191)->nullable();
            $table->string('payment_option', 191)->nullable();
            $table->integer('package')->nullable();
            $table->date('expire_date')->nullable();
            $table->string('expire_status', 191)->nullable();
            $table->string('card_holder_name', 191)->nullable();
            $table->string('companyName', 191)->nullable();
            $table->string('country', 191)->nullable();
            $table->string('street', 191)->nullable();
            $table->string('apartment', 191)->nullable();
            $table->string('billCity', 191)->nullable();
            $table->string('state', 191)->nullable();
            $table->string('zip', 191)->nullable();
            $table->string('contactName', 191)->nullable();
            $table->string('contactTelNo', 191)->nullable();
            $table->string('contactEmail', 191)->nullable();
            $table->longText('google_map')->nullable();
            $table->string('tel_ext', 191)->nullable();
            $table->string('alt_tel_ext', 191)->nullable();
            $table->text('sub_feature')->nullable();
            $table->string('payment_zip', 191)->nullable();
            $table->string('region', 191)->nullable();
            $table->string('billState', 191)->nullable();
            $table->longText('temp_data')->nullable();
            $table->integer('hide_hour')->default(0);
            $table->longText('history')->nullable();
            $table->string('delete_status', 191)->nullable();
            $table->string('cancel_status', 191)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('directories');
    }
};
