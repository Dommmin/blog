<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NewsletterSubscribeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email:rfc', 'unique:newsletter_subscribers,email'],
        ];
    }

    public function messages()
    {
        return [
            'email.required' => __('The email field is required'),
            'email.email' => __('The email must be a valid email address'),
            'email.unique' => __('The email is already subscribed'),
        ];
    }
}
