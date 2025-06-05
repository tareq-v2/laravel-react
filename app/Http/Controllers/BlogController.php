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
        $blogs = Blog::orderBy('created_at', 'desc')->get();
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
            'thumbnail' => 'nullable|image|max:2048',
            'video_link' => 'nullable|url',
            'video_thumbnail' => 'required_if:video_link,!=,null|image|max:2048'
        ]);

        $slug = Str::slug($request->title);
        $thumbnail = null;
        $video_thumbnail = null;

        if ($request->hasFile('thumbnail') && $request->file('thumbnail') instanceof \Illuminate\Http\UploadedFile) {
            $thumbnail = $request->file('thumbnail');
            $fileName = uniqid().'-thumbnail-'.rand().'.'.$thumbnail->extension();
            $request->file('thumbnail')->move(public_path('uploads/blogs/thumbnail'), $fileName);
            $thumbnail = $fileName; 
        }

        // Video thumbnail handling
        if ($request->hasFile('video_thumbnail') && $request->file('video_thumbnail') instanceof \Illuminate\Http\UploadedFile) {
            $videoThumb = $request->file('video_thumbnail');
            $fileName = uniqid().'-video-thumbnail-'.rand().'.'.$videoThumb->extension();
            $videoThumb->move(public_path('uploads/blogs/video_thumbnail'), $fileName);
            $video_thumbnail = $fileName;
        }
        $blog = Blog::create([
            'title' => $request->title,
            'slug' => $slug,
            'category' => $request->category,
            'description' => $request->description,
            'video_link' => $request->video_link,
            'thumbnail' => $thumbnail,
            'video_thumbnail' => $video_thumbnail,
        ]);
        return response()->json($blog, 201);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);
        $request->validate([
            'title' => 'sometimes|string|max:191',
            'description' => 'sometimes|string',
            'thumbnail' => 'nullable|image|max:2048',
            'video_link' => 'nullable|url',
            'video_thumbnail' => 'nullable|image|max:2048'
        ]);

        $data = $request->except(['video_thumbnail', 'thumbnail']);

        if ($request->has('title')) {
            $data['slug'] = Str::slug($request->title);
        }

        // Handle main image update
        if ($request->hasFile('thumbnail')) {
            // Delete old image
            if ($blog->thumbnail) {
                $oldImagePath = public_path('uploads/blogs/thumbnail/') . $blog->thumbnail;
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            $image = $request->file('thumbnail');
            $fileName = uniqid().'-img.'.$image->extension();
            $image->move(public_path('uploads/blogs/thumbnail'), $fileName);
            $data['thumbnail'] = $fileName;
        }

        // Handle video thumbnail
        if ($request->hasFile('video_thumbnail')) {
            if ($blog->video_thumbnail) {
                $oldVideoThumbPath = public_path('uploads/blogs/video_thumbnail/') . $blog->video_thumbnail;
                if (file_exists($oldVideoThumbPath)) {
                    unlink($oldVideoThumbPath);
                }
            }
            $videoThumb = $request->file('video_thumbnail');
            $fileName = uniqid().'-img.'.$videoThumb->extension();
            $videoThumb->move(public_path('uploads/blogs/video_thumbnail'), $fileName);
            $data['video_thumbnail'] = $fileName;
        }
        
        $blog->update($data);

        return response()->json($blog);
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        
        // Delete main image
        if ($blog->thumbnail) {
            $imagePath = public_path('uploads/blogs/thumbnail/') . $blog->thumbnail;
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        
        // Delete video thumbnail
        if ($blog->video_thumbnail) {
            $videoThumbPath = public_path('uploads/blogs/video_thumbnail/') . $blog->video_thumbnail;
            if (file_exists($videoThumbPath)) {
                unlink($videoThumbPath);
            }
        }
        
        $blog->delete();
        
        return response()->json(null, 204);
    }
}