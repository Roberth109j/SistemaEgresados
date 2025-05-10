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
        Schema::create('academic_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['formal', 'course'])->comment('formal: educación formal, course: cursos cortos y complementarios');
            $table->enum('level', ['educación superior', 'pregrado', 'especialización', 'maestría', 'doctorado'])->nullable()->comment('Solo para educación formal');
            $table->string('program_name');
            $table->string('custom_program_name')->nullable(); // Campo nuevo para programas personalizados
            // Campo "faculty" eliminado según requerimiento
            $table->string('institution');
            $table->string('custom_institution')->nullable(); // Campo nuevo para instituciones personalizadas
            $table->date('start_date')->nullable();
            $table->date('end_date');
            $table->string('degree_obtained')->nullable()->comment('Solo para educación formal');
            $table->string('certificate_file')->nullable();
            $table->string('certificate_file_name')->nullable();
            $table->timestamps();
            // Índices para búsquedas rápidas
            $table->index('user_id');
            $table->index('type');
            $table->index('end_date');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_information');
    }
};