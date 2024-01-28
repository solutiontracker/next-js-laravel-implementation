<?php

namespace App\Http\Controllers\system\Requests;

use App\Http\Requests\Api\FormRequest;

use Illuminate\Contracts\Validation\Validator;

use Illuminate\Http\Exceptions\HttpResponseException;

use Illuminate\Validation\Rule;
class NewsletterRequest extends FormRequest
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
        $input['email'] =  [
            'bail', 'required', 'email',
            Rule::unique('newsletter_emails')
                   ->where('email', request()->email)
                   ->whereIn('status', ['subscribed', 'unsubscribed'])
                   ->whereNull('deleted_at')
        ];

        return $input;
    }

    public function messages()
    {
        return [
            'email.required' => 'Email is required!'
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
     *  update response
     *
     * @param object
     */
    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(array(
            "success" => false,
            "message" => set_error_delimeter($validator->errors()->all()),
        ), 422));
    }
}
