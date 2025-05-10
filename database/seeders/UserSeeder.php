<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear permisos
        Permission::create(['name' => 'Ver usuarios']);
        Permission::create(['name' => 'Crear usuarios']);
        Permission::create(['name' => 'Editar usuarios']);
        Permission::create(['name' => 'Eliminar usuarios']);

        // Crear usuario Administrador
        $AdministradorUser = User::query()->create([
            'name' => 'Administrador',
            'email' => 'administrador@gmail.com',
            'password' => 'administrador',
            'role' => 'Administrador',
            'email_verified_at' => now()
        ]);

        // Crear y asignar rol Administrador
        $roleAdministrador = Role::create(['name' => 'Administrador']);
        $AdministradorUser->assignRole($roleAdministrador);
        $permissionsAdministrador = Permission::query()->pluck('name');
        $roleAdministrador->syncPermissions($permissionsAdministrador);

        // Crear usuario Coordinador
        $CoordinadorUser = User::query()->create([
            'name' => 'Coordinador',
            'email' => 'Coordinador@gmail.com',
            'password' => 'coordinador',
            'role' => 'Coordinador',
            'email_verified_at' => now()
        ]);

        // Crear y asignar rol Coordinador
        $roleCoordinador = Role::create(['name' => 'Coordinador']);
        $CoordinadorUser->assignRole($roleCoordinador);
        
        // Crear rol Egresado (sin usuario predefinido)
        Role::create(['name' => 'Egresado']);
        
        // Nota: La asignación automática del rol Egresado a nuevos usuarios
        // debe implementarse en el evento de registro de usuarios
    }
}