<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class PostVisit extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'ip_address',
        'visited_at',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function getStats()
    {
        $days = 30;
        $startDate = now()->subDays($days);

        $visitStats = DB::table('post_visits')
            ->where('visited_at', '>=', $startDate)
            ->selectRaw('DATE(visited_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();

        $visitStats = array_map(function ($item) {
            return [
                'date' => $item->date,
                'count' => (int) $item->count,
            ];
        }, $visitStats);

        $allDates = [];

        for ($i = 0; $i < $days; $i++) {
            $date = now()->subDays($i)->format('Y-m-d');
            $count = 0;

            foreach ($visitStats as $stat) {
                if ($stat['date'] === $date) {
                    $count = $stat['count'];
                    break;
                }
            }
            $allDates[] = [
                'date' => $date,
                'count' => $count,
            ];
        }

        usort($allDates, fn ($a, $b) => strcmp($a['date'], $b['date']));

        return $allDates;
    }
}
