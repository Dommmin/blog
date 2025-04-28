# Multi-Language Implementation Guide

This guide outlines how to implement multi-language support in your Laravel application with Inertia.js and React.

## Approach 1: Using Laravel's Built-in Localization (Recommended)

### 1. Configure Supported Locales

Add the supported locales to your Laravel configuration:

```php
// config/app.php
'supported_locales' => ['en', 'pl'],
'locale' => 'en',
'fallback_locale' => 'en',
```

### 2. Create a Language Middleware

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
        // Check URL for locale (for URL-based approach)
        if ($request->segment(1) && in_array($request->segment(1), config('app.supported_locales'))) {
            App::setLocale($request->segment(1));
            Session::put('locale', $request->segment(1));
            return $next($request);
        }

        // Check session/cookie
        if ($request->session()->has('locale')) {
            $locale = $request->session()->get('locale');
            App::setLocale($locale);
        } else {
            // Try to detect from browser
            $browserLocale = substr($request->server('HTTP_ACCEPT_LANGUAGE'), 0, 2);
            if (in_array($browserLocale, config('app.supported_locales'))) {
                App::setLocale($browserLocale);
                Session::put('locale', $browserLocale);
            }
        }

        return $next($request);
    }
}
```

### 3. Register the Middleware

```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'web' => [
        // ... other middleware
        \App\Http\Middleware\SetLocale::class,
    ],
];
```

### 4. Create Translation Files

For each language, create translation files:

```
resources/lang/en/messages.php
resources/lang/pl/messages.php
```

Example:
```php
// resources/lang/en/messages.php
return [
    'welcome' => 'Welcome to our site',
    'about' => 'About Me',
    'blog' => 'Blog',
    // ...
];

// resources/lang/pl/messages.php
return [
    'welcome' => 'Witamy na naszej stronie',
    'about' => 'O mnie',
    'blog' => 'Blog',
    // ...
];
```

### 5. Pass Translations to Inertia

Modify your `HandleInertiaRequests` middleware to pass translations to the front end:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'locale' => function () {
            return app()->getLocale();
        },
        'translations' => function () {
            return cache()->rememberForever('translations.' . app()->getLocale(), function () {
                return collect(['messages' => trans('messages')])
                    ->merge(['validation' => trans('validation')])
                    ->toArray();
            });
        },
    ]);
}
```

### 6. Create a Helper Hooks for React

```jsx
// resources/js/hooks/useTranslation.ts
import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { translations, locale } = usePage().props;

    const t = (key: string, replacements = {}) => {
        let translation = key.split('.').reduce((acc, part) => {
            return acc?.[part];
        }, translations);

        if (!translation) return key;

        // Handle replacements
        Object.keys(replacements).forEach(key => {
            translation = translation.replace(`:${key}`, replacements[key]);
        });

        return translation;
    };

    return {
        t,
        locale
    };
}
```

### 7. Create Language Switcher Component

```jsx
// resources/js/components/language-switcher.tsx
// (We've already created this file)
```

### 8. Update Routes to Support Localization (Optional, for URL-based approach)

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

```jsx
import { useTranslation } from '@/hooks/useTranslation';

export default function ExampleComponent() {
    const { t } = useTranslation();
    
    return (
        <div>
            <h1>{t('messages.welcome')}</h1>
            <p>{t('messages.some_text')}</p>
        </div>
    );
}
```

## Approach 2: Using Third-Party Packages

Alternatively, you could use one of these packages:

1. **spatie/laravel-translation-loader** - Store translations in the database
2. **Thinktomorrow/locale** - Handles URL-based locale detection and switching

## Testing & Considerations

1. Test all routes with different languages
2. Ensure the language switcher maintains the current page
3. Consider SEO implications (hreflang tags for different language versions)
4. RTL support if needed (for languages like Arabic)
5. Number and date formatting based on locale

## Performance Considerations

- Use caching for translations (as shown in the HandleInertiaRequests example)
- Consider lazy-loading translation files or chunking them by page if they become large 