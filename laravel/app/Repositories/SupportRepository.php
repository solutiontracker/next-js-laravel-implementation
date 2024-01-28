<?php

namespace App\Repositories;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Http;

class SupportRepository extends AbstractRepository
{
    private $grooveHqEndpoint;

    /**
     * __construct
     *
     * @return void
     */
    public function __construct()
    {
        $this->grooveHqEndpoint = 'https://api.groovehq.com/v1/';
    }

    /**
     * submitContactRequest
     *
     * @param  mixed $formInput
     * @return void
     */
    public function submitContactRequest($formInput) {

        $mailbox = ["sales@system.io", "support@system.io", "sales@system.io", "support@system.io"];

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer '.config('services.groovehq.api_key'),
            'Content-Type' => 'application/json',
        ])->post($this->grooveHqEndpoint.'tickets', [
            'name' => $formInput['name'],
            'email' => $formInput['email'],
            'subject' => $formInput['subject'],
            'body' => $formInput['message'],
            'from' => $formInput['email'],
            'to' => isset($mailbox[$formInput['option']]) ? $mailbox[$formInput['option']] : "support@system.io",
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200])) {
            return [
                "success" => true,
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }

    /**
     * createTicket
     *
     * @param  mixed $formInput
     * @return void
     */
    public function createTicket($formInput) {

        $website = \App\Models\Website::where('id', $formInput['website_id'])->first();

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer '.config('services.groovehq.api_key'),
            'Content-Type' => 'application/json',
        ])->post($this->grooveHqEndpoint.'tickets', [
            'name' => $formInput['name'],
            'email' => $formInput['email'],
            'subject' => $formInput['reason'],
            'body' => $formInput['message'].($website ? '<br>website: '.$website->url.' ('.$website->id.')' : ''),
            'from' => $formInput['email'],
            'to' => "support@system.io",
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200])) {
            return [
                "success" => true,
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }

    /**
     * searchArticles
     *
     * @param  mixed $formInput
     * @return void
     */
    public function searchArticles($formInput) {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer '.config('services.groovehq.api_key'),
            'Content-Type' => 'application/json',
        ])->get($this->grooveHqEndpoint.'kb/public/4369800321/articles/search', [
            'keyword' => $formInput['keyword'],
            'per_page' => 10
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200])) {
            return [
                "data" => $json['articles'],
                "success" => true
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }
}
