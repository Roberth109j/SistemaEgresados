<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicInformation extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type', // 'formal' para educación formal, 'course' para cursos cortos y complementarios
        'level', // Pregrado, Especialización, Maestría, Doctorado (solo para type='formal')
        'program_name', // Nombre del programa o curso
        'custom_program_name', // Para programas personalizados (cuando se selecciona 'Otro')
        'institution', // Institución donde se realizó
        'custom_institution', // Campo para instituciones personalizadas
        'start_date', // Fecha de inicio
        'end_date', // Fecha de finalización
        'degree_obtained', // Título obtenido (solo para type='formal')
        'certificate_file', // Archivo del diploma/certificado
        'certificate_file_name', // Nombre original del archivo
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Obtén el usuario al que pertenece esta información académica.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Scope para filtrar educación formal
     */
    public function scopeFormal($query)
    {
        return $query->where('type', 'formal');
    }
    
    /**
     * Scope para filtrar cursos cortos
     */
    public function scopeCourses($query)
    {
        return $query->where('type', 'course');
    }
    
    /**
     * Accessor para obtener la institución
     * Devuelve custom_institution si existe, sino institution
     */
    public function getInstitutionNameAttribute()
    {
        return !empty($this->custom_institution) ? $this->custom_institution : $this->institution;
    }
    
    /**
     * Accessor para obtener el nombre del programa
     * Devuelve custom_program_name si existe, sino program_name
     * Cambiado a "getProgramNameCompleteAttribute" para evitar recursión
     */
    public function getProgramNameCompleteAttribute()
    {
        return !empty($this->custom_program_name) ? $this->custom_program_name : $this->program_name;
    }
}