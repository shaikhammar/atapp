<?php

namespace Database\Factories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{


    protected $model = Profile::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'is_individual' => true,
            'phone_number' => $this->faker->phoneNumber,
            'company_name' => null,
            'date_of_birth' => $this->faker->date(),
            'is_translator' => true,
            'is_interpreter' => false,
            'preferred_currency_id' => 1,
        ];
    }
}
