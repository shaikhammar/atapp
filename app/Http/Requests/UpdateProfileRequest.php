<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard $auth */
        $auth = auth();
        /** @var \App\Models\User $user */
        $user = $auth->user();
        $user->load('profile');

        $profile = $user->profile;

        // return $auth->check() && $auth->user()->id === $this->profile->user_id;

        // If profile exists, ensure the user owns it
        if ($profile) {
            return $user && $profile->user_id === $user->id;
        }

        // If profile doesn't exist (creating), just ensure user is authenticated
        return $user !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company_name' => 'nullable|required_if:is_individual,false|string|max:255',
            'phone_number' => 'required|string|max:20',
            'date_of_birth' => 'nullable|required_if:is_individual,true|date',
            'is_individual' => 'boolean',
            'is_translator' => 'boolean',
            'is_interpreter' => 'boolean',
            'avatar' => 'nullable|string',
            'preferred_currency_id' => 'nullable|required_with:is_individual|exists:currencies,id',

            // Nested language fields
            'native_languages' => 'required_with:is_individual|array|min:1|max:2',
            'native_languages.*' => 'integer|exists:languages,id',

            // Nested address fields
            'address' => 'required|array',
            'address.address_line_1' => 'required|string|max:255',
            'address.address_line_2' => 'nullable|string|max:255',
            'address.city' => 'required|string|max:100',
            'address.state' => 'required|string|max:100',
            'address.postal_code' => 'required|string|max:20',
            'address.country' => 'required|string',
            'address.type' => 'nullable|string|max:50',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'is_translator.boolean' => 'Please select if you are a translator or not.',
            'is_interpreter.boolean' => 'Please select if you are an interpreter or not.',
            'is_individual.boolean' => 'Please select if you are an individual or a company.',
            'company_name.required_if' => 'Please enter a company name.',
            'date_of_birth.required_if' => 'Please enter a date of birth.',
            'preferred_currency_id.required_with' => 'Please select a preferred currency.',
            'native_languages.required_with' => 'Please select at least 1 native language.',
            'native_languages.min' => 'Please select at least 1 native language.',
            'native_languages.max' => 'You can select a maximum of 2 native languages.',
            'native_languages.*.exists' => 'One or more selected languages are invalid.',
            'address.required' => 'Please enter an address.',
            'address.exists' => 'Please enter an address.',
            'address.address_line_1.required' => 'Please enter street address.',
            'address.city.required' => 'Please enter a city.',
            'address.state.required' => 'Please enter a state.',
            'address.postal_code.required' => 'Please enter a postal code.',
            'address.country.required' => 'Please enter a country.',

        ];
    }
}
