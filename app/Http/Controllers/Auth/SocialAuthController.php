<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use PgSql\Result;
use Illuminate\Support\Facades\Http;


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
        // dd($this->getAccessToken(request()->session()->token()));
        $socialUser = Socialtite();
        try {
            // dd(Auth::user());
            $socialUser = Socialite::driver('google');
            // dd($socialUser);

            // Find or create the user in your databasen 
            $user = User::where(['email' => $socialUser->email])->first();
    
            if (!$user) {
                $user = User::create([
                    'name' => $socialUser->name,
                    'email' => $socialUser->email,
                    'provider_id' => $socialUser->id,
                    'provider' => $provider,
                    'password' => bcrypt(rand() . time()),
                ]);
            } else {
                // Update existing user if necessary
                if ($user->provider !== $provider || $user->provider_id !== $socialUser->id) {
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

    // private function getAccessToken($code)
    // {
    //     $response = Http::post('https://www.googleapis.com/oauth2/v4/token', [
    //         'code' => $code,
    //         'client_id' => env('GOOGLE_CLIENT_ID'),
    //         'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    //         'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
    //         'grant_type' => 'authorization_code',
    //     ]);

    //     return $response->json()['access_token'];
    // }
}
