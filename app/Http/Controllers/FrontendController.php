<?php

namespace App\Http\Controllers;

use App\Models\AdCategory;
use App\Models\AdSubCategory;
use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;

class FrontendController extends Controller
{
    public function jobOfferPost(Request $request){
        dd($request->all());
    }
    
    public function categoryIcons(){
        $categories = AdCategory::all();
    
        return response()->json([
            'data' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'icon' => $category->icon_path,
                ];
            })
        ]);
    }

    public function subCategoryIcons($id)
    {
        try {
            $subCategories = AdSubCategory::where('category_id', $id)
                ->whereNotNull('rate')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $subCategories->map(function ($subCategory) {
                    return [
                        'id' => $subCategory->id,
                        'name' => $subCategory->name,
                        'icon' => $subCategory->icon,
                        'route' => $subCategory->route,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch subcategories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAdSubCategories()
    {
        try {
            $perPage = request('per_page', 10);
            $subcategories = AdSubCategory::whereNotNull('rate')
                ->with('category')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $subcategories->items(),
                'pagination' => [
                    'current_page' => $subcategories->currentPage(),
                    'last_page' => $subcategories->lastPage(),
                    'per_page' => $subcategories->perPage(),
                    'total' => $subcategories->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch subcategories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateRate(Request $request, $type, $id)
    {
        // dd($request->all(), $type, $id);
        $validTypes = ['rate', 'feature-rate', 'social-rate'];
        
        if (!in_array($type, $validTypes)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid rate type'
            ], 400);
        }

        $request->validate([
            'value' => 'required|string|max:255'
        ]);
        
        $fieldMap = [
            'rate' => 'rate',
            'feature-rate' => 'feature_rate',
            'social-rate' => 'social_share_rate'
        ];
        
        $field = $fieldMap[$type];
        $input = strtolower(trim($request->value));
        
        $data = AdSubCategory::findOrFail($id);
        
        if ($input === 'free') {
            $data->$field = 'free';
        } else {
            // Validate numeric value
            if (!is_numeric($input)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid value. Must be numeric or "free"'
                ], 422);
            }
            
            // Store as string but format consistently
            $data->$field = number_format((float)$input, 2, '.', '');
        }
        
        $data->save();

        return response()->json([
            'success' => true,
            'message' => ucfirst($type).' updated successfully',
            'data' => $data
        ]);
    }

    public function jobOfferConfirm($id){
        $post = JobOffer::find($id);
        return response()->json([
            'success' => true,
            'message' => 'Job Offer Confirmed',
            'data' => $post
        ]);
    }

    public function adsHistory(){
        return response()->json([
            'success' => true,
            'message' => 'Ads History',
            'data' => JobOffer::all()
        ]);
    }
    
    public function getQuote()
    {
        Artisan::call('app:demote-expired-featured-posts');
        Artisan::call('drafts:clean');
        $random = now()->timestamp;
        return response()->json([
            'quote' => Cache::remember('inspire-quote-'.$random, 1, function () {
                Artisan::call('inspire');
                return trim(Artisan::output());
            })
        ]);
    }

    public function horoscopeProxy(Request $request)
    {
        $sign = $request->query('sign');
        $url = "https://mydailyhoroscope.org/widget.php?sign={$sign}&bc=000000&fc=ffffff&fs=12&h=";

        try {
            $client = new \GuzzleHttp\Client();
            $response = $client->get($url);
            $content = $response->getBody()->getContents();

            // Remove problematic scripts
            $content = preg_replace(
                '/<script\b[^>]*>window\.open\([^)]*\)[^<]*<\/script>/i', 
                '', 
                $content
            );

            // Add communication script
            $customScript = <<<EOT
                <script>
                document.addEventListener('DOMContentLoaded', function() {
                    // Add event listeners to dropdown items
                    document.querySelectorAll('.dropdown-item').forEach(item => {
                        item.addEventListener('click', function(e) {
                            e.preventDefault();
                            const sign = this.href.split('sign=')[1].split('&')[0];
                            
                            // Send message to parent window
                            window.parent.postMessage({
                                type: 'HOROSCOPE_SIGN_SELECTED',
                                sign: sign
                            }, '*');
                        });
                    });
                });
                </script>
                EOT;

            // Inject CSS (same as before)
            $customCSS = <<<EOT
                <style>
                body { 
                    background-color: tomato !important; 
                    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif !important;
                    color: #fff !important;
                }
                body small {
                    display: none !important;
                }
                .tab-content { 
                    background-color: white !important; 
                    border-radius: 4px !important;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;
                    padding: 15px 10px !important;
                    margin-top: 5px !important;
                    background: tomato !important;
                }

                /* Hide the dropdown toggle caret */
                .dropdown-toggle::after {
                    display: none !important;
                }
                .nav-tabs {
                    display: none !important;
                }
                </style>
                EOT;

            // Inject CSS and script
            $modifiedContent = str_replace('</head>', $customCSS . $customScript . '</head>', $content);

            return response($modifiedContent)->header('Content-Type', 'text/html');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function horoscopeContent(Request $request)
    {
        $sign = $request->query('sign', 'Leo');
        $url = "https://mydailyhoroscope.org/widget.php?sign={$sign}&bc=000000&fc=ffffff&fs=12&h=";

        try {
            $client = new \GuzzleHttp\Client();
            $response = $client->get($url);
            $content = $response->getBody()->getContents();

            // Parse and return only the tab content
            $dom = new \DOMDocument();
            @$dom->loadHTML($content);
            $xpath = new \DOMXPath($dom);
            $tabContent = $xpath->query('//div[@id="myTabContent"]')->item(0);
            
            if ($tabContent) {
                return $dom->saveHTML($tabContent);
            }
            
            return response()->json(['error' => 'Content not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
