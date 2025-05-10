<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function basicInformation()
    {
        return $this->hasOne(BasicInformation::class);
    }

    public function academicInformation()
    {
        return $this->hasMany(AcademicInformation::class);
    }

    public function employmentInformation()
    {
        return $this->hasMany(EmploymentInformation::class);
    }
    
    public function administratorCoordinatorProfile()
    {
        return $this->hasOne(myProfile::class);
    }
    
    /**
     * Relación con las ubicaciones del usuario
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function locations()
    {
        return $this->hasMany(Location::class);
    }
    
    /**
     * Obtener la última ubicación del usuario
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function latestLocation()
    {
        return $this->hasOne(Location::class)->latest();
    }
}


