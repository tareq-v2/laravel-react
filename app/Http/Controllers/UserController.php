<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function users()
    {   
        $users = User::select(['id', 'name', 'email', 'created_at'])->get();
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function create(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'customer'
        ]);
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function edit(Request $request, $id){
        $user = User::find($id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password ? bcrypt($request->password) : $user->password;
        $user->save();
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function delete($id){
        $user = User::find($id);
        $user->delete();
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }  

}
