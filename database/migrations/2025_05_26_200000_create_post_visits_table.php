<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Post::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class)->nullable()->constrained()->cascadeOnDelete();
            $table->string('ip_address', 45);
            $table->timestamp('visited_at')->useCurrent();
            $table->timestamps();

            $table->unique(['post_id', 'user_id', 'ip_address'], 'unique_post_visit');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_visits');
    }
};
