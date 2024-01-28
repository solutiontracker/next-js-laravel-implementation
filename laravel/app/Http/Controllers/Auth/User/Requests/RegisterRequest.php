<?php

namespace App\Http\Controllers\Auth\User\Requests;

use App\Http\Requests\Api\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;
use App\Rules\ValidRecaptcha;

class RegisterRequest extends FormRequest
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
        $input = [
            'first_name' => 'bail|required',
            'profession' => 'bail|required',
            'password' => 'bail|required|min:6',
            'password_confirmation' => 'bail|required_with:password|same:password|min:6',
            'recaptcha' => ['required', new ValidRecaptcha]
        ];

        $input['email'] =  [
            'bail', 'required', 'email',
            Rule::unique('users')
                   ->where('email', request()->email)
                   ->whereNull('deleted_at')
        ];

        return $input;

    }

    public function messages()
    {
        return [
            'first_name.required' => 'First name is required!',
            'last_name.required' => 'Last name is required!',
            'profession.required' => 'Profession is required!',
            'email.required' => 'Email is required!',
            'password.required' => 'Password is required!',
            'password_confirmation.required' => 'The Password confirmation field is required when password is present.',
            'password_confirmation.same' => 'The Password confirmation and Password must match.',
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
}
