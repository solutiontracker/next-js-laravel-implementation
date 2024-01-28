<?php

namespace App\Http\Controllers\Auth\User\Requests;

use App\Http\Requests\Api\FormRequest;

use Illuminate\Http\Exceptions\HttpResponseException;

use Illuminate\Contracts\Validation\Validator;

use App\Rules\ValidRecaptcha;

class ResetPasswordRequest extends FormRequest
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
            'email' => 'bail|required|email',
            'password' => 'bail|required|confirmed|min:6',
            'token' => 'bail|required',
            'recaptcha' => ['required', new ValidRecaptcha]
        ];
    }

    public function messages()
    {
        return [
            'token.required' => 'Token is required!',
            'email.required' => 'Email is required!',
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
