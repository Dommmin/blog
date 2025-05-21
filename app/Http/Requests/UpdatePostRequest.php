<?php

namespace App\Http\Requests;

use App\Models\Post;
use App\Rules\UniqueTranslationKey;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
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
            'title' => 'required|string',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'published_at' => 'nullable|date',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            'language' => ['required', 'string', Rule::in(available_locales())],
            'translation_key' => ['nullable', 'string', new UniqueTranslationKey($this->route('post')->id)],
        ];
    }

    public function messages()
    {
        return [
            'category_id.required' => 'The category field is required',
            'language.required' => 'The language field is required',
            'language.in' => 'The language must be one of: ' . implode(', ', available_locales()),
        ];
    }
}
