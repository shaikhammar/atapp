<?php

namespace App\Services;

use App\Models\Profile;

class ProfileService
{
    protected Profile $profile;

    public static function create(array $data): Profile
    {
        $profile = Profile::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'company_name' => $data['company_name'] ?? null,
            'phone_number' => $data['phone_number'],
            'date_of_birth' => $data['date_of_birth'],
            'is_individual' => $data['is_individual'] ?? null,
            'is_translator' => $data['is_translator'] ?? null,
            'is_interpreter' => $data['is_interpreter'] ?? null,
            'preferred_currency_id' => $data['preferred_currency_id'] ?? null,
            'native_language_id' => $data['native_language_id'] ?? null,
            'profile_picture' => $data['profile_picture'] ?? null,
        ]);

        (new self($profile))->handleNestedRelations($data);

        return $profile;
    }

    public static function update(Profile $profile, array $data): void
    {
        (new self($profile))->updateInternal($data);
    }

    public function __construct(Profile $profile)
    {
        $this->profile = $profile;
    }

    protected function updateInternal(array $data): void
    {
        $this->profile->update([
            'first_name' => $data['first_name'] ?? $this->profile->first_name,
            'last_name' => $data['last_name'] ?? $this->profile->last_name,
            'company_name' => $data['company_name'] ?? $this->profile->company_name,
            'phone_number' => $data['phone_number'] ?? $this->profile->phone_number,
            'date_of_birth' => $data['date_of_birth'] ?? $this->profile->date_of_birth,
            'is_individual' => $data['is_individual'] ?? $this->profile->is_individual,
            'is_translator' => $data['is_translator'] ?? $this->profile->is_translator,
            'is_interpreter' => $data['is_interpreter'] ?? $this->profile->is_interpreter,
            'preferred_currency_id' => $data['preferred_currency_id'] ?? $this->profile->preferred_currency_id,
            'native_language_id' => $data['native_language_id'] ?? $this->profile->native_language_id,
            'profile_picture' => $data['profile_picture'] ?? $this->profile->profile_picture,
        ]);

        $this->handleNestedRelations($data);
    }

    protected function handleNestedRelations(array $data): void
    {
        // Additional Info
        if (isset($data['additional_info'])) {
            $this->profile->update([
                'secondary_email' => $data['additional_info']['secondary_email'] ?? null,
                'secondary_phone' => $data['additional_info']['secondary_phone'] ?? null,
                'additional_fields' => $data['additional_info']['additional_fields'] ?? null,
            ]);
        }

        // Addresses
        if (isset($data['addresses'])) {
            foreach ($data['addresses'] as $addressData) {
                $this->profile->addresses()->updateOrCreate(
                    ['id' => $addressData['id'] ?? null], // condition
                    $addressData // new/updated data
                );
            }
        }

        // Expertises
        if (isset($data['expertises'])) {
            foreach ($data['expertises'] as $expertiseData) {
                $this->profile->expertises()->updateOrCreate(
                    ['id' => $expertiseData['id'] ?? null],
                    $expertiseData
                );
            }
        }

        // Translation Tools (pivot sync still makes sense here)
        if (isset($data['translation_tools'])) {
            $this->profile->translationTools()->sync(
                collect($data['translation_tools'])->pluck('translation_tool_id')->toArray()
            );
        }

        // Language Pairs Rates
        if (isset($data['language_pairs_rates'])) {
            foreach ($data['language_pairs_rates'] as $lprData) {
                $this->profile->languagePairsRates()->updateOrCreate(
                    ['id' => $lprData['id'] ?? null],
                    $lprData
                );
            }
        }

        // Qualifications
        if (isset($data['qualifications'])) {
            foreach ($data['qualifications'] as $qualificationData) {
                $this->profile->qualifications()->updateOrCreate(
                    ['id' => $qualificationData['id'] ?? null],
                    $qualificationData
                );
            }
        }

        // References
        if (isset($data['references'])) {
            foreach ($data['references'] as $referenceData) {
                $this->profile->references()->updateOrCreate(
                    ['id' => $referenceData['id'] ?? null],
                    $referenceData
                );
            }
        }

        // Documents
        if (isset($data['documents'])) {
            foreach ($data['documents'] as $documentData) {
                $this->profile->documents()->updateOrCreate(
                    ['id' => $documentData['id'] ?? null],
                    $documentData
                );
            }
        }
    }
}
