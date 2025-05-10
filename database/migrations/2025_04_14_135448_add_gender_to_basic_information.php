<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Verificar si la tabla existe
        if (Schema::hasTable('basic_information')) {
            // Verificar y añadir los campos necesarios
            Schema::table('basic_information', function (Blueprint $table) {
                // Verificar/añadir campo institution
                if (!Schema::hasColumn('basic_information', 'institution')) {
                    $table->string('institution')->nullable()->after('graduation_date');
                    Log::info("Columna 'institution' agregada a basic_information");
                }
                
                // Verificar/añadir campo career
                if (!Schema::hasColumn('basic_information', 'career')) {
                    $table->string('career')->nullable()->after('institution');
                    Log::info("Columna 'career' agregada a basic_information");
                }
                
                // Verificar/añadir el nuevo campo gender (sexo)
                if (!Schema::hasColumn('basic_information', 'gender')) {
                    $table->string('gender')->nullable()->after('document_number');
                    Log::info("Columna 'gender' agregada a basic_information");
                }
            });
            
            // Asegurar que las columnas permiten valores NULL
            try {
                DB::statement('ALTER TABLE basic_information MODIFY institution VARCHAR(255) NULL');
                Log::info("Definición de columna 'institution' ajustada para permitir NULL");
                
                DB::statement('ALTER TABLE basic_information MODIFY career VARCHAR(255) NULL');
                Log::info("Definición de columna 'career' ajustada para permitir NULL");
                
                // También para gender
                DB::statement('ALTER TABLE basic_information MODIFY gender VARCHAR(255) NULL');
                Log::info("Definición de columna 'gender' ajustada para permitir NULL");
            } catch (\Exception $e) {
                Log::error("Error al modificar las columnas: " . $e->getMessage());
            }
            
            // Corregir posibles datos erróneos
            try {
                // Verificar si hay registros con valores vacíos en lugar de NULL
                DB::table('basic_information')
                    ->where('institution', '')
                    ->update(['institution' => null]);
                
                DB::table('basic_information')
                    ->where('career', '')
                    ->update(['career' => null]);
                
                // También para gender
                DB::table('basic_information')
                    ->where('gender', '')
                    ->update(['gender' => null]);
                
                Log::info("Datos corregidos para institution, career y gender");
            } catch (\Exception $e) {
                Log::error("Error al corregir datos: " . $e->getMessage());
            }
            
            // Asegurar que la carpeta de fotos de perfil existe
            if (!file_exists(storage_path('app/public/profile_photos'))) {
                mkdir(storage_path('app/public/profile_photos'), 0755, true);
                Log::info("Directorio para fotos de perfil creado");
            }
        } else {
            // Si la tabla no existe, la creamos completa con todos los campos necesarios
            Schema::create('basic_information', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('first_name');
                $table->string('last_name');
                $table->string('document_type');
                $table->string('document_number');
                $table->string('gender')->nullable(); // Campo de sexo
                $table->string('email')->nullable(); // Email del usuario
                $table->string('profile_photo')->nullable(); // Columna para la foto de perfil
                $table->date('graduation_date')->nullable();
                $table->string('institution')->nullable(); // Institución educativa
                $table->string('career')->nullable(); // Carrera cursada
                $table->string('address')->nullable();
                $table->string('phone')->nullable();
                $table->string('city')->nullable();
                $table->string('department')->nullable();
                $table->string('country')->nullable();
                $table->text('additional_info')->nullable();
                $table->timestamps();

                // Índice para búsquedas rápidas
                $table->index('user_id');
                $table->unique(['user_id', 'document_type', 'document_number']);
            });
            
            Log::info("Tabla 'basic_information' creada desde cero con todos los campos necesarios");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No eliminamos la tabla en down(), solo intentamos revertir algunas modificaciones específicas
        if (Schema::hasTable('basic_information')) {
            // No eliminamos los campos ya que podrían contener datos importantes
            // Solo registramos que se intentó revertir
            Log::info('Se intentó revertir las modificaciones a la tabla basic_information, pero no se eliminaron campos para preservar datos');
        }
    }
};