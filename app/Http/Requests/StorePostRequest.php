<?php

namespace App\Http\Requests;

use App\Rules\UniqueTranslationKey;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
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
            'title' => ['required', 'string'],
            'slug' => ['nullable', 'string', 'unique:posts'],
            'content' => ['required', 'string'],
            'excerpt' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string'],
            'meta_description' => ['nullable', 'string'],
            'published_at' => ['nullable', 'string'],
            //            'category_id' => ['required', 'exists:categories,id'],
            'tags' => ['array', 'min:1'],
            'tags.*' => ['exists:tags,id'],
            'language' => ['required', 'string', Rule::in(available_locales())],
            'translation_key' => ['nullable', 'string', new UniqueTranslationKey],
        ];
    }

    public function messages()
    {
        return [
            //            'category_id.required' => __('The category field is required'),
            'language.required' => __('The language field is required'),
            'language.in' => __('The language must be one of: ').implode(', ', available_locales()),
        ];
    }
}
