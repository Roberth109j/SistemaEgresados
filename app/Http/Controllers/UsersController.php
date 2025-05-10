<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class UsersController extends Controller
{
    public function index():Response
    {
        // Ejecutar reordenamiento simple de IDs
        $this->reindexUserIds();
        
        $users = User::select('id','name','email','role','created_at')->orderBy('id', 'asc')->paginate(10);
        return Inertia::render('users',[
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:Administrador,Coordinador,Egresado',
        ]);

        try {
            DB::beginTransaction();
            
            $user = User::create([
                'name' => $validated['name'] . ' ' . $validated['surname'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);
    
            // Asignar el rol usando Spatie Permission
            $user->assignRole($validated['role']);
            
            DB::commit();
            return redirect()->route('users.index');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error al crear usuario: ' . $e->getMessage());
            return redirect()->back()->withErrors(['general' => 'Error al crear el usuario: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => $request->filled('password') ? 'string|min:8|confirmed' : '',
            'role' => 'required|string|in:Administrador,Coordinador,Egresado',
        ]);

        try {
            DB::beginTransaction();
            
            // Obtener el rol anterior para poder sincronizarlo posteriormente
            $oldRole = $user->role;
    
            $user->name = $validated['name'] . ' ' . $validated['surname'];
            $user->email = $validated['email'];
            $user->role = $validated['role'];
            
            if ($request->filled('password')) {
                $user->password = Hash::make($validated['password']);
            }
            
            $user->save();
    
            // Actualizar el rol si ha cambiado
            if ($oldRole !== $validated['role']) {
                // Eliminar el rol anterior y asignar el nuevo
                if ($oldRole) {
                    $user->removeRole($oldRole);
                }
                $user->assignRole($validated['role']);
            }
            
            DB::commit();
            return redirect()->route('users.index');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar usuario: ' . $e->getMessage());
            return redirect()->back()->withErrors(['general' => 'Error al actualizar el usuario: ' . $e->getMessage()]);
        }
    }

    public function destroy(User $user)
    {
        try {
            DB::beginTransaction();
            
            // Guardar el rol para después eliminarlo de model_has_roles
            $role = $user->role;
            
            // Eliminar los roles antes de eliminar el usuario
            if ($role) {
                // Solo intentar eliminar el rol si existe
                try {
                    $user->removeRole($role);
                } catch (Exception $e) {
                    // Registrar error pero continuar con la eliminación
                    Log::warning("No se pudo eliminar el rol {$role} del usuario {$user->id}: " . $e->getMessage());
                }
            }
            
            $user->delete();
            
            DB::commit();
            
            // Devolvemos un JSON para que pueda ser procesado por axios en el frontend
            return response()->json([
                'success' => true, 
                'message' => 'Usuario eliminado con éxito'
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error al eliminar usuario: ' . $e->getMessage());
            
            // Devolvemos un error JSON con un código de estado HTTP apropiado
            return response()->json(
                ['success' => false, 'message' => 'Error al eliminar el usuario: ' . $e->getMessage()],
                500
            );
        }
    }
    
    /**
     * Método simple para reindexar los IDs de usuario en secuencia
     * Se ejecuta solo al cargar la página de índice
     */
    private function reindexUserIds()
    {
        try {
            // Comprobar si hay huecos en los IDs
            $maxId = DB::table('users')->max('id');
            $count = DB::table('users')->count();
            
            // Solo reindexar si hay huecos (cuando el máximo ID es mayor que el conteo)
            if ($maxId > $count) {
                DB::statement('SET @counter = 0;');
                DB::statement('UPDATE users SET id = (@counter:=@counter+1) ORDER BY id;');
                DB::statement('ALTER TABLE users AUTO_INCREMENT = ' . ($count + 1) . ';');
                
                // Actualizar las referencias en la tabla model_has_roles si existe
                if (Schema::hasTable('model_has_roles')) {
                    // Crear tabla temporal para el mapeo
                    DB::statement('CREATE TEMPORARY TABLE IF NOT EXISTS temp_roles_map AS 
                        SELECT model_id, ROW_NUMBER() OVER (ORDER BY model_id) as new_id 
                        FROM model_has_roles 
                        WHERE model_type = "App\\\\Models\\\\User";');
                    
                    // Actualizar IDs en model_has_roles
                    DB::statement('UPDATE model_has_roles r 
                        JOIN temp_roles_map m ON r.model_id = m.model_id 
                        SET r.model_id = m.new_id 
                        WHERE r.model_type = "App\\\\Models\\\\User";');
                    
                    // Eliminar tabla temporal
                    DB::statement('DROP TEMPORARY TABLE IF EXISTS temp_roles_map;');
                }
            }
        } catch (Exception $e) {
            // Si ocurre un error, solo lo registramos pero no interrumpimos la carga de la página
            Log::error('Error al reindexar IDs de usuarios: ' . $e->getMessage());
        }
    }
}