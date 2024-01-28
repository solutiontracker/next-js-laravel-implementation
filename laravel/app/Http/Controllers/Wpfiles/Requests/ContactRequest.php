<?php

namespace App\Http\Controllers\system\Requests;

use App\Http\Requests\Api\FormRequest;

use Illuminate\Contracts\Validation\Validator;

use Illuminate\Http\Exceptions\HttpResponseException;

use App\Rules\ValidRecaptcha;

class ContactRequest extends FormRequest
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
        return [
            'name' => 'bail|required',
            'email' => 'bail|required|email',
            'subject' => 'bail|required',
            'message' => 'bail|required',
            'recaptcha' => ['required', new ValidRecaptcha]
        ];
    }

    public function messages()
    {
        return [
            'email.email' => 'Please enter valid email!',
        ];
    }
}
