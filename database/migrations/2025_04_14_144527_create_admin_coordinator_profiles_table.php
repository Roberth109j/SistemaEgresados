<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admin_coordinator_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('profile_photo')->nullable();
            $table->string('full_name');
            $table->string('identification_number')->nullable();
            $table->string('institutional_email');
            $table->string('contact_phone')->nullable();
            $table->string('role'); // Administrador o Coordinador
            $table->string('faculty_or_department')->nullable();
            $table->string('position_or_title')->nullable();
            $table->string('area_of_responsibility')->nullable();
            $table->timestamps();

            // Índice para búsquedas eficientes
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_coordinator_profiles');
    }
};