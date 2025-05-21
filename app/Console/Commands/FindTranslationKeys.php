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

            // Ulepszony regex do wyłapywania kluczy tłumaczeń
            $this->extractTranslationKeys($contents, $keys);
        }

        $keys = array_unique($keys);
    }

    protected function extractTranslationKeys($contents, &$keys)
    {
        // Szukamy funkcji __() z pojedynczymi cudzysłowami
        if (preg_match_all("/__\('((?:\\\\.|[^'])*?)'/", $contents, $matches)) {
            foreach ($matches[1] as $match) {
                $keys[] = $this->unescapeString($match);
            }
        }

        // Szukamy funkcji __() z podwójnymi cudzysłowami
        if (preg_match_all('/__\("((?:\\\\.|[^"])*?)"/', $contents, $matches)) {
            foreach ($matches[1] as $match) {
                $keys[] = $this->unescapeString($match);
            }
        }

        // Szukamy funkcji trans() z pojedynczymi cudzysłowami
        if (preg_match_all("/trans\('((?:\\\\.|[^'])*?)'/", $contents, $matches)) {
            foreach ($matches[1] as $match) {
                $keys[] = $this->unescapeString($match);
            }
        }

        // Szukamy funkcji trans() z podwójnymi cudzysłowami
        if (preg_match_all('/trans\("((?:\\\\.|[^"])*?)"/', $contents, $matches)) {
            foreach ($matches[1] as $match) {
                $keys[] = $this->unescapeString($match);
            }
        }

        // Szukamy wywołań __() w komponentach React z pojedynczymi cudzysłowami
        if (preg_match_all("/\{__\('((?:\\\\.|[^'])*?)'\)\}/", $contents, $matches)) {
            foreach ($matches[1] as $match) {
                $keys[] = $this->unescapeString($match);
            }
        }

        // Szukamy wywołań __() w komponentach React z podwójnymi cudzysłowami
        if (preg_match_all('/\{__\("((?:\\\\.|[^"])*?)"\)\}/', $contents, $matches)) {
            foreach ($matches[1] as $match) {
                $keys[] = $this->unescapeString($match);
            }
        }
    }

    /**
     * Poprawnie obsługuje odkodowanie znaków escapowanych
     *
     * @param  string  $string
     * @return string
     */
    protected function unescapeString($string)
    {
        // Zamienia sekwencje escapowane na ich rzeczywiste znaki
        $escapes = [
            '\\\'' => '\'', // Escapowany apostrof
            '\\"' => '"',   // Escapowany cudzysłów
            '\\\\' => '\\', // Escapowany backslash
            '\\n' => "\n",  // Nowa linia
            '\\r' => "\r",  // Powrót karetki
            '\\t' => "\t",  // Tabulator
        ];

        return str_replace(array_keys($escapes), array_values($escapes), $string);
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
            $removedCount = 0;

            foreach ($keys as $key) {
                if (! isset($existingTranslations[$key])) {
                    $newTranslations[$key] = $locale === 'en' ? $key : '';
                    $addedCount++;
                }
            }

            // Remove old keys
            foreach ($existingTranslations as $key => $value) {
                if (! in_array($key, $keys)) {
                    unset($existingTranslations[$key]);
                    $removedCount++;
                    $this->line("Removed old key: $key");
                }
            }

            $translations = array_merge($existingTranslations, $newTranslations);
            ksort($translations);

            File::put($path, json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            $this->info("Added $addedCount new keys and removed $removedCount old keys from $locale.json");
        }
    }
}
