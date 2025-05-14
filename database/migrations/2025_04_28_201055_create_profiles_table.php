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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->boolean('is_individual')->nullable(); // true = individual, false = company

            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('company_name')->nullable();

            $table->string('phone_number')->nullable();
            $table->date('date_of_birth')->nullable();

            $table->foreignId('preferred_currency_id')->nullable()->constrained('currencies')->nullOnDelete();

            $table->boolean('is_translator')->nullable();
            $table->boolean('is_interpreter')->nullable();

            $table->string('avatar')->nullable(); // path to image

            $table->string('secondary_email')->nullable();
            $table->string('secondary_phone')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
