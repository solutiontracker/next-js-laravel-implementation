<?php

namespace App\Http\Controllers\User\Requests\Website;

use App\Http\Requests\Api\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;
use App\Repositories\UserRepository;
use App\Repositories\PlanRepository;
use Illuminate\Support\Str;

class WebsiteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if (\Route::is('user-website-store') || \Route::is('user-website-update')) {
            $input = [
                'type' => [
                    'bail', 'required',
                    Rule::in(['pro', 'free']),
                ],
                'cdn' => 'bail|required',
                'url' => 'bail|required|url',
            ];

            if (\Route::is('user-website-store')) {
                $input['domain'] =  [
                    'bail', 'required',
                    Rule::unique('websites')
                        ->where(fn ($query) => $query->where('user_id', request()->user()->id)->whereNull('deleted_at'))
                ];
            } elseif (\Route::is('user-website-update')) {
                $input['domain'] =  [
                    'bail', 'required',
                    Rule::unique('websites')
                            ->where(fn ($query) => $query->where('id', '<>', $this->id)->where('user_id', request()->user()->id)->whereNull('deleted_at'))
                ];
            }

            return $input;
        } else {
            return [];
        }
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        if (\Route::is('user-website-store') || \Route::is('user-website-update')) {
            $user = request()->user();

            if ($user && $user->is_free == 0) {

                $subscription = UserRepository::getActiveSubscription($user);

                if ($subscription && $subscription->name) {
                    $plan = PlanRepository::getPlanByPrice($subscription->stripe_price);
                    if ($plan) {
                        if ($plan->websites != 0) {
                            $total = UserRepository::userTotalWebsites($user, true);
                            if ($total >= $plan->websites && \Route::is('user-website-store')) {
                                $validator->after(function ($validator) use ($total) {
                                    $validator->errors()->add('url', "Limit exceed! You have maximum `$total` websites limit to your current plan. ");
                                });
                            }
                        }
                    } else {
                        $validator->after(function ($validator) {
                            $validator->errors()->add('url', "Plan does not exist");
                        });
                    }
                } else {
                    $validator->after(function ($validator) {
                        $validator->errors()->add('url', "You are not subscribed to any plan");
                    });
                }

            }

            //Cdn
            if (($user->cdn_active == 0 || $user->balance < 0) && request()->cdn == 1) {
                $validator->after(function ($validator) use ($user) {
                    $validator->errors()->add('url', "You cannot activate cdn due to negative balance");
                });
            }

            //If user is not verified
            if (!$user->email_verified_at) {
                $validator->after(function ($validator) use ($user) {
                    $validator->errors()->add('url', "Please active your account.");
                });
            }
        }

        if (\Route::is('user-website-destroy') || \Route::is('user-website-update')) {
            $website = \App\Models\Website::where('id', request()->id)->where('user_id', request()->user()->id)->first();

            if ($website && $website->cdn_status == "pending") {
                $validator->after(function ($validator) {
                    $validator->errors()->add('url', "Your website is still creating in background, During process website can’t be modified nor deleted.");
                });
            }
        }
    }

    public function messages()
    {
        return [
            'url.required' => 'Url is required!',
            'cdn.required' => 'Cdn is required!'
        ];
    }

    /**
     *  Filters to be applied to the input.
     *
     * @return array
     */
    public function filters()
    {
        return [
            'email' => 'trim|lowercase',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'domain' => get_url_hostname(request()->url),
        ]);
    }

    /**
     *  update response
     *
     * @param object
     */
    public function failedValidation(Validator $validator)
    {
        $website = \App\Models\Website::where('domain', get_url_hostname(request()->url))->where('user_id', request()->user()->id)->first();

        if ($website && !$website->token) {
            do {
                $token = Str::random(32);
            } while (\App\Models\Website::where("token", $token)->first() instanceof \App\Models\Website);
            $website->token = $token;
            $website->save();
        }

        throw new HttpResponseException(response()->json(array(
            "success" => false,
            "errors" => $validator->errors(),
            "data" => array(
                "website" => $website
            ),
        ), 422));
    }
}
