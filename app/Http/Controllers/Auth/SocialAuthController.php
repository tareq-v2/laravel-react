<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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

    // Facebook
    // public function redirectToFacebook()
    // {
    //     return Socialite::driver('facebook')->stateless()->redirect();
    // }

    public function handleFacebookCallback()
    {
        return $this->handleSocialCallback('facebook');
    }

    private function handleSocialCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
            
            $user = User::firstOrCreate(
                ['email' => $socialUser->getEmail()],
                [
                    'name' => $socialUser->getName(),
                    'provider_id' => $socialUser->getId(),
                    'provider' => $provider,
                    'password' => bcrypt(rand().time()) // Dummy password
                ]
            );

            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed'], 401);
        }
    }
}
