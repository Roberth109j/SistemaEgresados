<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmploymentInformation extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'position_name',
        'company_name',
        'company_type',
        'location',
        'start_date',
        'end_date',
        'is_current_job',
        'contract_type',
        'responsibilities',
        'soft_skills',    // Añadido
        'hard_skills',    // Añadido
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current_job' => 'boolean',
        'soft_skills' => 'array',    // Añadido: asegura que se convierta a/desde JSON
        'hard_skills' => 'array',    // Añadido: asegura que se convierta a/desde JSON
    ];

    /**
     * Los atributos que deben ser incluidos en la serialización.
     * 
     * @var array<int, string>
     */
    protected $appends = [
        'duration',
    ];

    /**
     * Obtén el usuario al que pertenece esta información laboral.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para ordenar por experiencia más reciente primero
     */
    public function scopeOrderByRecent($query)
    {
        return $query->orderBy('is_current_job', 'desc')
                     ->orderBy('end_date', 'desc')
                     ->orderBy('start_date', 'desc');
    }

    /**
     * Obtener la duración del empleo en formato legible
     */
    public function getDurationAttribute()
    {
        $start = $this->start_date;
        $end = $this->is_current_job ? now() : $this->end_date;
        
        if (!$start || (!$end && !$this->is_current_job)) {
            return 'Duración desconocida';
        }
        
        $years = $end->diffInYears($start);
        $months = $end->copy()->subYears($years)->diffInMonths($start);
        
        $duration = [];
        
        if ($years > 0) {
            $duration[] = $years . ' ' . ($years == 1 ? 'año' : 'años');
        }
        
        if ($months > 0 || count($duration) == 0) {
            $duration[] = $months . ' ' . ($months == 1 ? 'mes' : 'meses');
        }
        
        return implode(' y ', $duration);
    }
}