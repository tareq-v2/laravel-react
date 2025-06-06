<?php


namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\BlogComment;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    // Get single blog with like status
    public function show($id)
    {
        $blog = Blog::withCount('likes')->findOrFail($id);
        
        $blog->user_liked = false;
        if (Auth::check()) {
            $blog->user_liked = $blog->likes()->where('user_id', Auth::id())->exists();
        }

        return response()->json($blog);
    }

    // Get adjacent blogs
    public function adjacent($id)
    {
        $blog = Blog::findOrFail($id);
        
        $prev = Blog::where('id', '<', $blog->id)
            ->latest('id')
            ->select('id', 'title')
            ->first();
            
        $next = Blog::where('id', '>', $blog->id)
            ->oldest('id')
            ->select('id', 'title')
            ->first();

        return response()->json([
            'prev' => $prev,
            'next' => $next
        ]);
    }

    // Get blog comments with user data
    public function comments($id)
    {
        $comments = BlogComment::with('user:id,name')
            ->where('blog_id', $id)
            ->latest()
            ->get();
        
        return response()->json($comments);
    }

    // Handle like/unlike action
    public function like($id)
    {
        $blog = Blog::findOrFail($id);
        $user = Auth::user();

        $like = $blog->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            $blog->likes()->create(['user_id' => $user->id]);
            $liked = true;
        }

        return response()->json([
            'likes' => $blog->likes()->count(),
            'liked' => $liked
        ]);
    }

    // Post new comment
    public function postComment(Request $request, $id)
    {
        $request->validate(['text' => 'required|string|max:500']);

        $comment = Comment::create([
            'text' => $request->text,
            'blog_id' => $id,
            'user_id' => Auth::id()
        ]);

        return response()->json($comment->load('user:id,name'));
    }
}