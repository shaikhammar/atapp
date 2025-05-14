<?php

use App\Models\User;
use App\Models\Currency;
use App\Models\Language;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('allows authenticated user to update profile', function () {
    // Disable middleware for this test
    $this->withoutMiddleware();
    $currencies = Currency::factory()->count(10)->create();
    $languages = Language::factory()->count(10)->create();

    $user = User::factory()->create();
    actingAs($user);

    $data = [
        'first_name' => 'Braxton',
        'last_name' => 'Cartwright',
        'company_name' => 'Braxton Inc.',
        'phone_number' => '+1 (831) 774-8192',
        'date_of_birth' => '1980-09-09',
        'is_individual' => true,
        'is_translator' => true,
        'is_interpreter' => false,
        'preferred_currency_id' => $currencies->first()->id,
        'native_languages' => $languages->take(2)->pluck('id')->toArray(),
        'address' => [
            'address_line_1' => '5678 Oak St',
            'city' => 'Shelbyville',
            'state' => 'IL',
            'postal_code' => '62705',
            'country' => 'USA'
        ]
    ];

    $response = $this->put(route('profile.update'), $data);

    $response->assertStatus(302); // Adjust to 302 if redirecting

    $user->refresh()->load('profile.address', 'profile.languages');

    expect($user->profile)->not()->toBeNull()
        ->and($user->profile->first_name)->toBe('Braxton')
        ->and($user->profile->last_name)->toBe('Cartwright')
        ->and($user->profile->address->address_line_1)->toBe('5678 Oak St')
        ->and($user->profile->languages)->toHaveCount(2)
        ->and($user->profile->languages->pluck('id')->sort()->values())
        ->toEqual($languages->take(2)->pluck('id')->sort()->values());
});

it('validates required fields when updating profile', function () {
    // Disable middleware for this test
    $this->withoutMiddleware();
    $currencies = Currency::factory()->count(10)->create();
    $languages = Language::factory()->count(10)->create();

    $user = User::factory()->create();
    actingAs($user);

    $data = [
        'first_name' => '', // invalid
        'last_name' => '',  // invalid
        'company_name' => 'Braxton Inc.',
        'phone_number' => '+1 (831) 774-8192',
        'date_of_birth' => '1980-09-09',
        'is_individual' => null, // invalid
        'is_translator' => true,
        'is_interpreter' => false,
        'preferred_currency_id' => $currencies->first()->id,
        'native_languages' => $languages->take(2)->pluck('id')->toArray(),
        'address' => [
            'address_line_1' => '5678 Oak St',
            'city' => 'Shelbyville',
            'state' => 'IL',
            'postal_code' => '62705',
            'country' => 'USA'
        ]
    ];

    $response = $this->putJson(route('profile.update'), $data);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['first_name', 'last_name', 'is_individual']);
});


it('fails if native languages exceeds limit', function () {
    // Disable middleware for this test
    $this->withoutMiddleware();
    $currencies = Currency::factory()->count(10)->create();
    $languages = Language::factory()->count(10)->create();

    $user = User::factory()->create();
    actingAs($user);

    $data = [
        'first_name' => 'Braxton',
        'last_name' => 'Cartwright',
        'company_name' => 'Braxton Inc.',
        'phone_number' => '+1 (831) 774-8192',
        'date_of_birth' => '1980-09-09',
        'is_individual' => true,
        'is_translator' => true,
        'is_interpreter' => false,
        'preferred_currency_id' => $currencies->first()->id,
        'native_languages' => $languages->take(3)->pluck('id')->toArray(),
        'address' => [
            'address_line_1' => '5678 Oak St',
            'city' => 'Shelbyville',
            'state' => 'IL',
            'postal_code' => '62705',
            'country' => 'USA'
        ]
    ];

    $response = $this->putJson(route('profile.update'), $data);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['native_languages']);
});
