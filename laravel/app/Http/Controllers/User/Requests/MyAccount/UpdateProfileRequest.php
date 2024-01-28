<?php

namespace App\Http\Controllers\User\Requests\MyAccount;

use App\Http\Requests\Api\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
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
            'email' => 'bail|required|email|unique:users,email, '.request()->user()->id.',id,deleted_at, null',
            'first_name' => 'bail|required',
            'password' => (request()->password || !request()->user()->hasPassword ? 'bail|required|min:6' : ''),
            'password_confirmation' => (request()->password ? 'bail|required_with:password|same:password|min:6' : ''),
            'old_password' => ((request()->email != request()->user()->email || request()->password) && request()->user()->hasPassword ? 'bail|required' : ''),
            'image' => (request()->hasFile('image') ? 'bail|required|image|mimes:jpeg,png,jpg,gif,svg|max:2048' : '')
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $input = request()->all();

        $user = auth()->user();

        if (request()->isMethod('POST') && isset($input['old_password']) && $input['old_password']) {
            if ($user->password &&!\Hash::check($input['old_password'], $user->password) && $input['old_password']) {
                $validator->after(function ($validator) {
                    $validator->errors()->add('old_password', "Please enter correct old password.");
                });
            }
        }

        //If requesting to change email
        if ($user->email != request()->email) {
            $count = \App\Models\User::where('email', request()->email)->whereNull('deleted_at')->count();
            if ($count > 0) {
                $validator->after(function ($validator) {
                    $validator->errors()->add('email', "This email has already been taken.");
                });
            }
        }
    }

    public function messages()
    {
        return [
            'email.required' => 'Email is required!',
            'first_name.required' => 'First name is required!',
            'password.required' => 'Password is required!',
            'password_confirmation.required' => 'Confirm password is required!',
            'old_password.required' => 'Old password is required!',
            'image.max' => 'The image must not be greater than 2MB.',
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
