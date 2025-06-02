<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::get();
        return response()->json($blogs);
    }

    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        return response()->json($blog);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:191',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'video_link' => 'nullable|url',
            'video_thumbnail' => 'required_if:video_link,!=,null|image|max:2048'
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->title);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('blog_images', 'public');
        }

        if ($request->has('video_link') && $request->video_link) {
            if ($request->hasFile('video_thumbnail')) {
                $data['video_thumbnail'] = $request->file('video_thumbnail')->store('video_thumbnails', 'public');
            }
        } else {
            $data['video_thumbnail'] = null;
        }

        $blog = Blog::create($data);

        return response()->json($blog, 201);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|string|max:191',
            'description' => 'sometimes|string',
            'video_link' => 'nullable|url',
            'video_thumbnail' => 'nullable|image|max:2048'
        ]);

        $data = $request->except('video_thumbnail');

        if ($request->has('title')) {
            $data['slug'] = Str::slug($request->title);
        }

        // Handle video thumbnail
        if ($request->hasFile('video_thumbnail')) {
            // Delete old thumbnail
            if ($blog->video_thumbnail) {
            Storage::disk('public')->delete($blog->video_thumbnail);
            }
            $data['video_thumbnail'] = $request->file('video_thumbnail')->store('video_thumbnails', 'public');
        }

        $blog->update($data);

        return response()->json($blog);
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        
        // Delete image if exists
        // if ($blog->image) {
        //     Storage::disk('public')->delete($blog->image);
        // }
        
        $blog->delete();
        
        return response()->json(null, 204);
    }
}