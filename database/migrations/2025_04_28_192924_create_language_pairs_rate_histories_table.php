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
        Schema::create('language_pairs_rate_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('language_pair_id')->constrained('language_pairs_rates')->cascadeOnDelete(); // Link to language_pairs
            $table->decimal('old_rate', 8, 2)->nullable(); // Previous rate
            $table->decimal('new_rate', 8, 2);             // New proposed or approved rate
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete(); // Who updated
            $table->string('change_type');                 // "proposed" or "approved"
            $table->text('notes')->nullable();             // Any discussion notes or email reference
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('language_pairs_rate_histories');
    }
};
