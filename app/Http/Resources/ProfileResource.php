<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'company_name' => $this->company_name,
            'phone_number' => $this->phone_number,
            'date_of_birth' => $this->date_of_birth,
            'is_individual' => $this->is_individual,
            'is_translator' => $this->is_translator,
            'is_interpreter' => $this->is_interpreter,
            'avatar' => $this->avatar,
            'preferred_currency_id' => $this->preferred_currency_id,
            'native_languages' => LanguageResource::collection($this->languages),
            'address' => $this->address,
        ];
    }
}
