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
        Schema::create('qualifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Belongs to user
            $table->string('type');            // Degree, Certification, Training, Diploma
            $table->string('name');            // Name of qualification (e.g., "Bachelor of Arts in Linguistics")
            $table->string('institution')->nullable(); // University or Certifying Body
            $table->string('country')->nullable();     // Country of institution
            $table->string('city')->nullable();     // City of institution
            $table->date('issued_date')->nullable();   // Date of issue
            $table->date('expiry_date')->nullable();   // Optional expiry date (for certifications)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qualifications');
    }
};
