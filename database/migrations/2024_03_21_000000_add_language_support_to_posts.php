<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('language')->default('en')->after('slug');
            $table->string('translation_key')->nullable()->after('language');
            $table->index(['translation_key', 'language']);
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['translation_key', 'language']);
            $table->dropColumn(['language', 'translation_key']);
        });
    }
};
