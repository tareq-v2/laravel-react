<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\JobOffer;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DemoteExpiredFeaturedPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:demote-expired-featured-posts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Demote job offers that have been featured for more than 24 hours';

     public function handle()
    {
        try {
            $expirationTime = Carbon::now()->subHours(24);
            
            // Get the count before update for logging
            $count = JobOffer::where('feature', 'Yes')
                ->whereDate('featured_at', '<=', $expirationTime)
                ->count();

            if ($count > 0) {
                // Use chunking for memory efficiency with large datasets
                JobOffer::where('feature', 'Yes')
                    ->whereDate('featured_at', '<=', $expirationTime)
                    ->chunkById(200, function ($offers) {
                        foreach ($offers as $offer) {
                            $offer->update([
                                'feature' => 'No',
                                'featured_at' => null
                            ]);
                        }
                    });
                
                Log::info("Demoted $count expired featured job offers");
                $this->info("Successfully demoted $count expired featured job offers");
            } else {
                $this->info('No expired featured job offers found');
            }
            
            return 0;
            
        } catch (\Exception $e) {
            Log::error('Failed to demote featured posts: ' . $e->getMessage());
            $this->error('Error: ' . $e->getMessage());
            return 1;
        }
    }
}
