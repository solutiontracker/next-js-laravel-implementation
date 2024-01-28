<?php

namespace App\Http\Controllers\system\Requests;

use App\Http\Requests\Api\FormRequest;

use Illuminate\Contracts\Validation\Validator;

use Illuminate\Http\Exceptions\HttpResponseException;

class FeedbackRequest extends FormRequest
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
            'rating' => (request()->type == 'rating' ? 'bail|required|min:1|max:5' : ''),
            'option' => (request()->type == 'feedback' ? 'bail|required' : ''),
            'email' => (request()->email ? 'bail|required|email' : ''),
        ];
    }

    public function messages()
    {
        return [
            'email.email' => 'Please enter valid email!',
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
        $errors = set_error_delimeter($validator->errors()->all());
        throw new HttpResponseException(response()->json(array(
            "success" => false,
            "message" => count($errors) > 0 ? implode(" ", $errors) : '',
        ), 422));
    }
}
