<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\DraftPost;
use App\Models\AdDraftAttachment;
use Carbon\Carbon;

class CleanExpiredDrafts extends Command
{
    protected $signature = 'drafts:clean';
    protected $description = 'Clean up expired draft posts and attachments';

    public function handle()
    {
        $expirationHours = config('drafts.expiration_hours', 24);
        $threshold = Carbon::now()->subHours($expirationHours);

        // Get expired drafts
        $expiredDrafts = DraftPost::where('created_at', '<', $threshold)->get();

        foreach ($expiredDrafts as $draft) {
            // Delete attachments
            AdDraftAttachment::where('user_ip', $draft->ip_address)->delete();
            
            // Delete draft
            $draft->delete();
        }

        $this->info('Cleaned ' . count($expiredDrafts) . ' expired drafts');
    }
}
