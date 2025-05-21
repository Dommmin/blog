<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = [
        'email',
        'token',
        'confirmed_at',
        'locale',
    ];

    protected $casts = [
        'confirmed_at' => 'datetime',
    ];

    public static function generateToken()
    {
        return bin2hex(random_bytes(32));
    }

    public function isConfirmed()
    {
        return ! is_null($this->confirmed_at);
    }
}
