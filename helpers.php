<?php

function reading_time($content, $wpm = 200): int
{
    $content = strip_tags($content);
    $wordCount = str_word_count($content);

    return ceil($wordCount / $wpm) ?: 1;
}

function available_locales(): array
{
    return explode(',', config('app.available_locales', 'en'));
}
