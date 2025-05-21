<?php

namespace App\Rules;

use App\Models\Post;
use Illuminate\Contracts\Validation\Rule;

class UniqueTranslationKey implements Rule
{
    private ?int $excludePostId;

    public function __construct(?int $excludePostId = null)
    {
        $this->excludePostId = $excludePostId;
    }

    public function passes($attribute, $value): bool
    {
        if (! $value) {
            return true;
        }

        $query = Post::where('translation_key', $value)
            ->where('language', request()->input('language'));

        if ($this->excludePostId) {
            $query->where('id', '!=', $this->excludePostId);
        }

        return ! $query->exists();
    }

    public function message(): string
    {
        return 'A post with this translation key already exists in this language.';
    }
}
