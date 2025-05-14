<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function shouldCompleteProfile(): bool
    {

        return $this->hasRole('linguist') && (!$this->profile || !$this->profile->isComplete());
    }

    public function additionalInfo(): HasOne
    {
        return $this->hasOne(AdditionalInfo::class);
    }


    public function expertises(): HasMany
    {
        return $this->hasMany(Expertise::class);
    }

    public function translationTools(): HasMany
    {
        return $this->hasMany(TranslationTool::class);
    }

    public function languagePairsRates(): HasMany
    {
        return $this->hasMany(LanguagePairsRate::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function references(): HasMany
    {
        return $this->hasMany(Reference::class);
    }

    public function qualifications(): HasMany
    {
        return $this->hasMany(Qualification::class);
    }


    public function isComplete(): bool
    {
        return $this->profile()->exists() &&
            $this->additionalInfos()->exists() &&
            $this->addresses()->exists() &&
            $this->expertises()->exists() &&
            $this->translationTools()->exists() &&
            $this->languagePairsRates()->exists() &&
            $this->qualifications()->exists() &&
            $this->references()->exists() &&
            $this->documents()->exists();
    }
}
