<?php

namespace App\Http\Middleware;

use Closure;

class ValidateWebsite
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(request()->isMethod('POST')) {

            $headers = getallheaders();

            if(isset($headers['Authtoken']) && $headers['Authtoken']) {

                $website = \App\Models\Website::where('token', $headers['Authtoken'])->first();

                if($website) {
                    if(get_url_hostname($website->url) != get_url_hostname($request->domain)) {
                        return response()->json(['error' => 'Invalid domain', 'data' => array(
                            'domain' => $website->url
                        )], 410);
                    } else {
                        $request->merge(['website_id' => $website->id]);
                    }
                } else {
                    return response()->json(['error' => 'Invalid API Key Request'], 402);
                }
            } else {
                return response()->json(['error' => 'Invalid API Key Request'], 402);
            }

        } else {
            $website = \App\Models\Website::where('token', request()->token)->first();

            if($website) {
                if(get_url_hostname($website->url) != get_url_hostname($request->domain) && !\Route::is('system-website-download-plugin')) {
                    return response()->json(['error' => 'Invalid domain', 'data' => array(
                        'domain' => $website->url
                    )], 410);
                } else if($website) {
                    $request->merge(['website_id' => $website->id]);
                }
            } else if(!\Route::is('system-website-download-plugin')) {
                return response()->json(['error' => 'Invalid API Key Request'], 402);
            }
        }

        return $next($request);
    }
}
