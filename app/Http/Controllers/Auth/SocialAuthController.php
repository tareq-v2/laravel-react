<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use PgSql\Result;

class SocialAuthController extends Controller
{
    // Google
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        return $this->handleSocialCallback('google');
    }

    private function handleSocialCallback($provider)
    {
        // dd($provider);
        try {
            $socialUser = Socialite::driver($provider)->user();
            // dd($socialUser);
            $user = User::firstOrNew(['email' => $socialUser->getEmail()]);

            if (!$user->exists) {
                // Create a new user
                $user->fill([
                    'name' => $socialUser->getName(),
                    'provider_id' => $socialUser->getId(),
                    'provider' => $provider,
                    'password' => bcrypt(rand() . time()), // Dummy password
                ])->save();
            } else {
                // Update existing user if necessary
                if ($user->provider !== $provider || $user->provider_id !== $socialUser->getId()) {
                    $user->update([
                        'provider_id' => $socialUser->getId(),
                        'provider' => $provider,
                    ]);
                }
            }
            Auth::login($user);
            $token = $user->createToken('token')->plainTextToken;
            // return redirect()->away("http://localhost:8000/auth/success?token=" . $token);/
            return response()->json([
                'token' => $token,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed'], 401);
        }
    }
}
