<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FindTranslationKeys extends Command
{
    protected $signature = 'translations:find';

    protected $description = 'Find translation keys in codebase';

    public function handle()
    {
        $keys = [];
        $paths = [
            app_path(),
            resource_path('js'),
        ];

        foreach ($paths as $path) {
            $this->scanDirectory($path, $keys);
        }

        $this->info('Found '.count($keys).' unique translation keys:');
        sort($keys);

        foreach ($keys as $key) {
            $this->line($key);
        }

        if ($this->confirm('Would you like to add missing keys to language files?')) {
            $this->addMissingKeys($keys);
        }
    }

    protected function scanDirectory($directory, &$keys)
    {
        if (! File::isDirectory($directory)) {
            return;
        }

        $files = File::allFiles($directory);

        foreach ($files as $file) {
            $contents = $file->getContents();

            preg_match_all('/__\([\'"]([^\'"]+)[\'"]/', $contents, $matches1);
            preg_match_all('/trans\([\'"]([^\'"]+)[\'"]/', $contents, $matches2);

            // Wyszukaj klucze w React
            preg_match_all('/\{__\([\'"]([^\'"]+)[\'"]\)/', $contents, $matches3);

            if (! empty($matches1[1])) {
                foreach ($matches1[1] as $match) {
                    $keys[] = $match;
                }
            }

            if (! empty($matches2[1])) {
                foreach ($matches2[1] as $match) {
                    $keys[] = $match;
                }
            }

            if (! empty($matches3[1])) {
                foreach ($matches3[1] as $match) {
                    $keys[] = $match;
                }
            }
        }

        $keys = array_unique($keys);
    }

    protected function addMissingKeys($keys)
    {
        $locales = available_locales();

        foreach ($locales as $locale) {
            $path = lang_path("$locale.json");
            $existingTranslations = [];

            if (File::exists($path)) {
                $existingTranslations = json_decode(File::get($path), true) ?? [];
            }

            $newTranslations = [];
            $addedCount = 0;

            foreach ($keys as $key) {
                if (! isset($existingTranslations[$key])) {
                    $newTranslations[$key] = $locale === 'en' ? $key : '';
                    $addedCount++;
                }
            }

            $translations = array_merge($existingTranslations, $newTranslations);
            ksort($translations);

            File::put($path, json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            $this->info("Added $addedCount new keys to $locale.json");
        }
    }
}
