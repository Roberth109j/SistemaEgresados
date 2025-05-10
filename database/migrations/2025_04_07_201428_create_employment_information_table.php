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
        Schema::create('employment_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('position_name');
            $table->string('company_name');
            $table->string('company_type')->nullable();
            $table->string('location');
            $table->date('start_date');
            $table->date('end_date')->nullable(); // Null si trabaja actualmente
            $table->boolean('is_current_job')->default(false);
            $table->string('contract_type')->nullable();
            $table->text('responsibilities')->nullable();
            $table->json('soft_skills')->nullable(); // Habilidades blandas como JSON
            $table->json('hard_skills')->nullable(); // Habilidades duras como JSON
            $table->timestamps();

            // Índices para búsquedas eficientes
            $table->index('user_id');
            $table->index('start_date');
            $table->index('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employment_information');
    }
};