<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangeLanguagueRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LocaleController extends Controller
{
    public function change(ChangeLanguagueRequest $request)
    {
        $validated = $request->validated();
        $locale = $validated['locale'];

        if (in_array($locale, available_locales(), true)) {
            Session::put('locale', $locale);
        }

        $previousUrl = url()->previous();
        $previousRequest = Request::create($previousUrl);

        $route = app('router')->getRoutes()->match($previousRequest);
        $parameters = array_merge($route->parameters(), ['locale' => $locale]);

        return to_route($route->getName(), $parameters);
    }
}
