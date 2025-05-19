<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LocaleController extends Controller
{
    public function change(Request $request)
    {
        $locale = $request->get('locale', 'en');

        if (in_array($locale, available_locales(), true)) {
            Session::put('locale', $locale);
        }

        return response()->json(['locale' => $locale]);
    }
}
