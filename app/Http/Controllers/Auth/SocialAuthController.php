<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use PgSql\Result;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;


class SocialAuthController extends Controller
{
    // Google
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        // return $this->handleSocialCallback('google');
        $this->handleSocialCallback('google', request());
    }

    private function handleSocialCallback($provider, Request $request)
    {
        try {
            $code = $request->input('code');

            // Exchange code for access token
            $response = Http::post('https://oauth2.googleapis.com/token', [
                'code' => $code,
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'redirect_uri' => config('services.google.redirect'),
                'grant_type' => 'authorization_code',
            ]);
            // dd($response);
            $accessToken = $response->json()['access_token'];

            // Get user data with access token
            $socialUser = Socialite::driver($provider)
                ->stateless()
                ->userFromToken($accessToken);
            // Get the social user from the provider
            // Find or create the user in your database
            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'provider_id' => $socialUser->getId(),
                    'provider' => $provider,
                    'password' => bcrypt(rand() . time()),
                ]);
            } else {
                // Update existing user if necessary
                if ($user->provider !== $provider || $user->provider_id !== $socialUser->getId()) {
                    $user->update([
                        'provider_id' => $socialUser->getId(),
                        'provider' => $provider,
                    ]);
                }
            }

            // Log in the user
            Auth::login($user);

            // Create a token for the user
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed: ' . $e->getMessage()], 401);
        }
    }

    // private function handleSocialCallback($provider)
    // {
    //     // dd($this->getAccessToken(request()->session()->token()));
    //     // $socialUser = Socialtite();
    //     try {
    //         $socialUser = Socialite::driver('google');

    //         // Find or create the user in your databasen
    //         $user = User::where(['email' => $socialUser->email])->first();

    //         if (!$user) {
    //             $user = User::create([
    //                 'name' => $socialUser->name,
    //                 'email' => $socialUser->email,
    //                 'provider_id' => $socialUser->id,
    //                 'provider' => $provider,
    //                 'password' => bcrypt(rand() . time()),
    //             ]);
    //         } else {
    //             // Update existing user if necessary
    //             if ($user->provider !== $provider || $user->provider_id !== $socialUser->id) {
    //                 $user->update([
    //                     'provider_id' => $socialUser->id,
    //                     'provider' => $provider,
    //                 ]);
    //             }
    //         }

    //         // Log in the user
    //         Auth::login($user);

    //         // Create a token for the user
    //         $token = $user->createToken('token')->plainTextToken;

    //         // Return the token and user data
    //         return response()->json([
    //             'token' => $token,
    //             'user' => $user,
    //         ]);

    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Authentication failed'. $e], 401);
    //     }
    // }

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
