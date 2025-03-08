<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Allow CORS for these paths
    'allowed_methods' => ['*'], // Allow all HTTP methods (GET, POST, etc.)
    'allowed_origins' => ['*'], // Replace with your React app URL
    'allowed_origins_patterns' => [], // Regex patterns for allowed origins
    'allowed_headers' => ['*'], // Allow all headers
    'exposed_headers' => [], // Expose no additional headers
    'max_age' => 0, // Preflight request cache duration (0 = no cache)
    'supports_credentials' => false, // Allow credentials (cookies, authorization headers)
];