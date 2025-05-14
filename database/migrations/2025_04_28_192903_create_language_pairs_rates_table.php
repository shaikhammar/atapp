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
        Schema::create('language_pairs_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('source_language_id')->constrained('languages')->cascadeOnDelete();
            $table->foreignId('target_language_id')->constrained('languages')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete(); // <-- New
            $table->decimal('proposed_rate', 8, 2)->nullable();
            $table->decimal('final_rate', 8, 2)->nullable();
            $table->boolean('machine_translation_experience')->default(false);
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('approval_reference_email')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'source_language_id', 'target_language_id', 'service_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('language_pairs_rates');
    }
};
