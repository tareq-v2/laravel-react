<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('job_offers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('user_id')->nullable();
            $table->string('title', 191);
            $table->string('city', 191)->nullable();
            $table->string('category', 191)->nullable();
            $table->text('description')->nullable();
            $table->string('businessName', 191)->nullable();
            $table->text('address')->nullable();
            $table->string('salary', 191)->nullable();
            $table->string('name', 191)->nullable();
            $table->string('telNo', 191)->nullable();
            $table->string('altTelNo', 191)->nullable();
            $table->string('email', 191)->nullable();
            $table->string('website', 191)->nullable();
            $table->string('attachment', 191)->nullable();
            $table->text('keywords')->collation('utf8mb4_bin')->nullable();
            $table->integer('status')->nullable();
            $table->string('unique_id', 191)->nullable()->index();
            $table->string('feature', 191)->nullable();
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
            $table->string('tel_ext', 191)->nullable();
            $table->string('alt_tel_ext', 191)->nullable();
            $table->string('from_feature', 191)->nullable();
            $table->text('attachment_original_name')->nullable();
            $table->text('temp_data')->nullable();
            $table->text('history')->nullable();
            $table->string('cancel_status', 191)->nullable();
            $table->string('delete_status', 191)->nullable();
            $table->boolean('is_verified')->default(false);
        });
    }

    public function down()
    {
        Schema::dropIfExists('job_offers');
    }
};