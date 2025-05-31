public function getJobOfferslist(Request $request)
{
    // ... existing code ...
    
    $query = JobOffer::with('images') // Eager load images relationship
        // ... rest of query ...
    
    $transformed = $paginator->getCollection()->map(function (JobOffer $offer) use ($now, $featureCutoff) {
        return [
            // ... existing fields ...
            'attachments' => $offer->images->map(function($image) {
                return [
                    'image_path' => $image->image_path,
                    // other image fields if needed
                ];
            })->toArray()
        ];
    });
    
    // ... rest of code ...
}