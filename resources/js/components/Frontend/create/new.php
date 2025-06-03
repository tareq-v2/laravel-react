<?php

public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'title' => 'required|string|max:191',
            'description' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'video_link' => 'nullable|url',
            'video_thumbnail' => 'required_if:video_link,!=,null|image|max:2048'
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->title);
        
        if ($data['thumbnail'] && $data['thumbnail'] instanceof UploadedFile) {
            $data['thumbnail']->move(public_path('blogs/thumbnail'), uniqid() . '-' . $data['thumbnail']->extension());
        } else {
            $data['thumbnail'] = null;
        }
        if ($data['video_link'] && $data['video_link'] instanceof UploadedFile) {
            $data['video_link']->move(public_path('blogs/video_thumbnail'), uniqid() . '-' . $data['video_link']->extension());
        } else {
            $data['video_thumbnail'] = null;
        }

        $blog = Blog::create($data);
        return response()->json($blog, 201);
    }