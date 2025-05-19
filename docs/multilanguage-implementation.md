# The Simplest Way to Add Multi-Language Support in Laravel + Inertia.js + React

This guide outlines the simplest and most practical way to implement multi-language support in your Laravel application with Inertia.js and React.

## 1. Configure Supported Locales

Add the supported locales to your Laravel configuration:

```php
// config/app.php
'available_locales' => env('APP_AVAILABLE_LOCALES', 'en,de,pl'),

// helpers.php
function available_locales(): array
{
    return explode(',', config('app.available_locales', 'en'));
}
```

## 2. Create a Language Middleware

```php
// app/Http/Middleware/SetLocale.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = Session::get('locale', config('app.locale'));

        if (in_array($locale, available_locales(), true)) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
```

### 3. Register the Middleware

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        ...,
        SetLocale::class,
    ]);
})
```

### 4. Create Translation Files

For each language, create translation files:

```
lang/en.json
lang/pl.json
lang/de.json
...
```

Example:
```json
{
    "A reset link will be sent if the account exists.": "Link do resetowania hasła zostanie wysłany, jeśli konto istnieje.",
    "About me": "O mnie"
}
```

### 5. Pass Translations to Inertia

Modify your `HandleInertiaRequests` middleware to pass translations to the front end:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

    return [
        ...parent::share($request),
        'name' => config('app.name'),
        'quote' => ['message' => trim($message), 'author' => trim($author)],
        'auth' => [
            'user' => $request->user(),
        ],
        'ziggy' => fn (): array => [
            ...(new Ziggy)->toArray(),
            'location' => $request->url(),
        ],
        'sidebarOpen' => $request->cookie('sidebar_state') === 'true',
        'errors' => fn () => $request->session()->get('errors')
            ? $request->session()->get('errors')->getBag('default')->getMessages()
            : (object) [],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ],
        'locale' => fn () => App::getLocale(),
        'translations' => $this->getTranslations(),
    ];
    
    protected function getTranslations(): array
    {
        $locale = Session::get('locale', config('app.locale'));
        return cache()->tags('translations')->rememberForever("translations_{$locale}", function () use ($locale) {
            $path = lang_path("$locale.json");
            if (file_exists($path)) {
                return json_decode(file_get_contents($path), true) ?? [];
            }
            return [];
        });
    }
}
```

### 6. Create a Helper Hooks for React
```ts
// resources/js/hooks/useTranslation.ts
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useTranslations() {
    const { translations, locale } = usePage<SharedData>().props;

    const __ = (key: string, replacements: Record<string, string> = {}) => {
        let translation = translations[key] || key;

        Object.keys(replacements).forEach((r) => {
            translation = translation.replace(`:${r}`, replacements[r]);
        });

        return translation;
    };

    return {
        __,
        trans: __,
        locale,
    };
}
```

### 7. Create Language Switcher Component

```typescript jsx
// resources/js/components/language-switcher.tsx
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { router, usePage } from '@inertiajs/react';
import { CheckIcon } from 'lucide-react';

type Language = {
    code: string;
    name: string;
    flag: string;
};

const languages: Language[] = [
    {
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
    },
    {
        code: 'pl',
        name: 'Polski',
        flag: '🇵🇱',
    },
    {
        code: 'de',
        name: 'Deutsch',
        flag: '🇩🇪',
    },
];

export function LanguageSwitcher() {
    const props = usePage().props;
    const currentLang = props.locale;

    const switchLanguage = (langCode: string) => {
        router.post(
            route('locale.change'),
            {
                locale: langCode,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                    <span>{languages.find((lang) => lang.code === currentLang)?.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => switchLanguage(language.code)}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                        {currentLang === language.code && <CheckIcon className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
```
### 8. Create a Route to Change Language

```php
// routes/web.php
Route::post('/locale', [LocaleController::class, 'change'])->name('locale.change');

// app/Http/Controllers/LocaleController.php
public function change(Request $request): RedirectResponse
{
    $locale = $request->get('locale', 'en');

    if (in_array($locale, available_locales(), true)) {
        Session::put('locale', $locale);
    }

    return redirect()->back();
}
```


### 8.1. Update Routes to Support Localization (Optional, for URL-based approach)

For URL-based localization (e.g., `/en/about`, `/pl/about`):

```php
// routes/web.php
Route::group(['prefix' => '{locale}', 'where' => ['locale' => '[a-zA-Z]{2}'], 'middleware' => 'web'], function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/about', [AboutController::class, 'index'])->name('about');
    Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
    // ...other routes
});

// Redirect root to default locale
Route::get('/', function () {
    return redirect(app()->getLocale());
});
```

### 9. Use Translations in React Components

```typescript jsx
import { useTranslations } from '@/hooks/useTranslation';

export default function ExampleComponent() {
    const { __ } = useTranslations();

    const mainNavItems: NavItem[] = [
        {
            title: 'Blog',
            href: '/blog',
            icon: NotebookPen,
        },
        {
            title: __('About me'),
            href: '/about',
            icon: BookUser,
        },
    ];
    
    return (
        <div>
            ...
        </div>
    );
}
```

### 10. Create Command to Find Translation Keys
```php
// app/Console/Commands/FindTranslationKeys.php
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
```

## Caching Translations for Performance

When your app grows, reading translation files on every request can become a performance bottleneck. Caching translations in the `HandleInertiaRequests` middleware is a good practice:

- **Why cache?**
  - Reduces file I/O and JSON parsing on every request.
  - Improves response time, especially for large translation files or high-traffic apps.

- **How to cache?**
  - Use Laravel's `cache()->rememberForever()` to cache translations per locale.
  - Example:

```php
protected function getTranslations(): array
{
    $locale = Session::get('locale', config('app.locale'));
    return cache()->rememberForever("translations_{$locale}", function () use ($locale) {
        $path = lang_path("$locale.json");
        if (file_exists($path)) {
            return json_decode(file_get_contents($path), true) ?? [];
        }
        return [];
    });
}
```

- **How to clear the cache?**
  - When you add or update translations, clear the cache for the affected locale(s):
  - You can do this manually:

```bash
php artisan cache:forget translations_en
php artisan cache:forget translations_pl
php artisan cache:forget translations_de
```

## Curiosity: Laravel's Native PHP Array-Based Translations

Laravel also supports PHP array-based translations. These are stored in files like `lang/en/auth.php` and accessed with keys like `__('auth.password')`. This approach is more structured, supports nested keys, and is used by Laravel's built-in features (e.g., validation, auth). Example usage:

```php
__('auth.password')
```

- **JSON approach:** Flat, easy to edit, good for frontend sharing, keys are usually phrases or simple strings.
- **PHP array approach:** Structured, supports nesting, used by Laravel's core, keys are dot-notated (e.g., `auth.password`).

Choose the approach that best fits your needs. For most Inertia.js + React apps, the JSON approach described above is the simplest and most flexible.
