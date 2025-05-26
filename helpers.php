<?php

function reading_time(string $content, int $wpm = 200): int
{
    $content = strip_tags($content);
    $wordCount = str_word_count($content);

    return max(1, ceil($wordCount / $wpm));
}

function available_locales(): array
{
    return explode(',', config('app.available_locales', 'en'));
}
