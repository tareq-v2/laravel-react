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
        return Socialite::driver('google') ->redirect();
    }

    public function handleGoogleCallback()
    {
        return $this->handleSocialCallback('google');
    }

    private function handleSocialCallback($provider)
    {
        try {
            $socialUser = Socialite::driver('google')->user();
            // dd($socialUser);
            // Find or create the user in your database
            $user = User::where(['email' => $socialUser->email])->first();
    
            if (!$user) {
                // Create a new user
                // $user->fill([
                //     'name' => $socialUser->name,
                //     'email' => $socialUser->email,
                //     'provider_id' => $socialUser->id,
                //     'provider' => $provider,
                //     'password' => bcrypt(rand() . time()), // Dummy password
                // ])->save();
                $user = User::create([
                    'name' => $socialUser->name,
                    'email' => $socialUser->email,
                    'provider_id' => $socialUser->id,
                    'provider' => $provider,
                    'password' => bcrypt(rand() . time()),
                ]);
            } else {
                // Update existing user if necessary
                if ($user->provider !== $provider || $user->provider_id !== $socialUser->getId()) {
                    $user->update([
                        'provider_id' => $socialUser->id,
                        'provider' => $provider,
                    ]);
                }
            }
    
            // Log in the user
            Auth::login($user);
    
            // Create a token for the user
            $token = $user->createToken('token')->plainTextToken;
    
            // Return the token and user data
            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
    
        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed'. $e], 401);
        }
    }
}
