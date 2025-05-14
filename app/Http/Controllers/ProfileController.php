<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\LanguageResource;
use App\Models\Currency;
use App\Models\Domain;
use App\Models\Language;
use App\Models\Service;
use App\Models\TranslationToolsList;
use App\Services\ProfileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        //temprorary fix for the above error in vs code
        /** @var \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard $auth */
        $auth = auth();
        /** @var \App\Models\User $user */
        $user = $auth->user();
        $user->load('profile.address');

        $profile = $user->profile;

        return Inertia::render('profile/show', [
            'profile' => $profile,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        //temprorary fix for the above error in vs code
        /** @var \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard $auth */
        $auth = auth();
        /** @var \App\Models\User $user */
        $user = $auth->user();
        $user->load('profile.address', 'profile.languages');

        $profile = new ProfileResource($user->profile ?? new Profile());

        // dd($profile);

        return Inertia::render('profile/edit', [
            'profile' => $profile,
            'currencies' => Currency::all(),
            'languages' => LanguageResource::collection(Language::all()),
            'domains' => Domain::all(),
            'translation_tools_list' => TranslationToolsList::all(),
            'services' => Service::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProfileRequest $request)
    {
        $validated = $request->validated();

        /** @var \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard $auth */
        $auth = auth();
        $user = $auth->user();

        // Create or update profile
        $profile = $user->profile ?? new Profile(['user_id' => $user->id]);
        $profile->fill($validated);
        $profile->save();

        // If you're also handling address inside the same form:
        if (isset($validated['address'])) {
            $addressData = $validated['address'];

            // Either update or create the morphOne address
            if ($profile->address) {
                $profile->address->update($addressData);
            } else {
                $profile->address()->create($addressData);
            }
        }

        // If you're also handling languages inside the same form:
        if (isset($validated['native_languages'])) {
            $profile->languages()->sync($validated['native_languages']);
        }

        return redirect()->route('profile.show', $profile)->with('success', 'Profile updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Profile $profile)
    {
        //
    }

    public function updateAvatar(Request $request)
    {

        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $user = $request->user();
        $file = $request->file('avatar');


        // Make sure the profile exists
        $profile = $user->profile()->firstOrCreate([]);

        // Delete old avatar if it exists
        if ($profile->avatar) {
            Storage::disk('public')->delete($profile->avatar);
        }

        // Store new avatar
        $path = $file->store('avatars', 'public');

        // Update profile
        $profile->update([
            'avatar' => $path,
        ]);

        return redirect()->back(); // Inertia will re-fetch props
    }

    public function destroyAvatar(Request $request)
    {
        $user = $request->user();
        $profile = $user->profile()->firstOrCreate([]);

        if ($profile->avatar) {
            Storage::disk('public')->delete($profile->avatar);
            $profile->update([
                'avatar' => null,
            ]);
        }

        return redirect()->back(); // Inertia will re-fetch props
    }
}
