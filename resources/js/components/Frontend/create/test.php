<?php

public function store(Request $request) {
    $model = $request->input('model', $request->formData['model'] ?? null);
    
    if ($model === 'Directory') {
        $data = $request->except(['_token', 'ip', 'logo', 'thumbnails']);
        
        // Process logo
        if ($request->hasFile('logo')) {
            $logoFile = $request->file('logo');
            $fileName = uniqid() . '-' . rand() . '.' . $logoFile->extension();
            $location = public_path('drafts/attachments');
            $logoFile->move($location, $fileName);
            
            AdDraftAttachment::create([
                'user_ip' => $request->ip(),
                'session_id' => $request->sessionId,
                'image' => $fileName,
                'type' => 'logo'
            ]);
        }
        
        // Process thumbnails
        if ($request->has('thumbnails')) {
            foreach ($request->file('thumbnails') as $thumbnail) {
                if ($thumbnail->isValid()) {
                    $fileName = uniqid() . '-' . rand() . '.' . $thumbnail->extension();
                    $location = public_path('drafts/attachments');
                    $thumbnail->move($location, $fileName);
                    
                    AdDraftAttachment::create([
                        'user_ip' => $request->ip(),
                        'session_id' => $request->sessionId,
                        'image' => $fileName,
                        'type' => 'thumbnail'
                    ]);
                }
            }
        }
        
        // Handle array fields
        if (isset($data['subCategories'])) {
            $data['subCategories'] = json_encode($data['subCategories']);
        }
        
        // ... rest of the code ...
    }
    // ... other models ...
}

public function getDraft(Request $request) {
    $draft = DraftPost::where('session_id', $request->sessionId)
          ->where('model', $request->model)
          ->where('expires_at', '>', now())
          ->first();
          
    if (!$draft) {
        return response()->json(['exists' => false]);
    }
    
    $data = json_decode($draft->data, true);
    
    if ($request->model === 'Directory') {
        // Get logo
        $logoAttachment = AdDraftAttachment::where('session_id', $request->sessionId)
            ->where('type', 'logo')
            ->first();
        if ($logoAttachment) {
            $data['logo'] = asset('drafts/attachments/' . $logoAttachment->image);
        }
        
        // Get thumbnails
        $thumbnailAttachments = AdDraftAttachment::where('session_id', $request->sessionId)
            ->where('type', 'thumbnail')
            ->get();
        $thumbnails = [];
        foreach ($thumbnailAttachments as $attachment) {
            $thumbnails[] = asset('drafts/attachments/' . $attachment->image);
        }
        $data['thumbnails'] = $thumbnails;
        
        if (isset($data['subCategories'])) {
            $data['subCategories'] = json_decode($data['subCategories'], true);
        }
    }
    
    return response()->json([
        'exists' => true,
        'data' => $data,
        'draft_id' => $draft->id
    ]);
}