<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BasicInformation extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'document_type',
        'document_number',
        'gender', // Añadido campo de sexo
        'email',
        'profile_photo',
        'graduation_date',
        'institution',
        'career',
        'address',
        'phone',
        'city',
        'department',
        'country',
        'additional_info',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'graduation_date' => 'date',
    ];

    /**
     * Obtén el usuario al que pertenece esta información.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}