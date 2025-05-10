<?php

namespace App\Http\Controllers;

use App\Models\myProfile; // Cambiado de AdminCoordinatorProfile a myProfile
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Mostrar el formulario de perfil con datos precargados.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Asegurarse de que el usuario tiene rol de Administrador o Coordinador
        if (!in_array($user->role, ['Administrador', 'Coordinador'])) {
            return redirect()->route('dashboard')->with('error', 'No tienes acceso a esta sección.');
        }
        
        // Buscar el perfil existente o crear uno nuevo si no existe
        $profile = myProfile::where('user_id', $user->id)->first();
        
        // Verificar que el directorio para fotos de perfil existe
        if (!Storage::disk('public')->exists('profile_photos')) {
            Storage::disk('public')->makeDirectory('profile_photos');
        }
        
        // Lista de facultades o departamentos
        $facultiesDepartments = $this->getFacultiesDepartments();
        
        // Usar el nombre correcto del componente
        return Inertia::render('myProfiles', [
            'userData' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? '',
            ],
            'profile' => $profile,
            'facultiesDepartments' => $facultiesDepartments,
        ]);
    }

    /**
     * Almacenar o actualizar información del perfil.
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Validar que el usuario tenga rol adecuado
            if (!in_array($user->role, ['Administrador', 'Coordinador'])) {
                return back()->withErrors(['general' => 'No tienes permisos para realizar esta acción.']);
            }
            
            // Validar las entradas
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'identification_number' => 'nullable|string|max:50',
                'institutional_email' => 'required|email|max:255',
                'contact_phone' => 'nullable|string|max:20',
                'role' => 'required|string|in:Administrador,Coordinador',
                'faculty_or_department' => 'nullable|string|max:255',
                'position_or_title' => 'nullable|string|max:255',
                'area_of_responsibility' => 'nullable|string|max:255',
                'profile_photo' => 'nullable|image|max:2048', // 2MB max
                'profile_photo_path' => 'nullable|string',
            ], [
                'profile_photo.max' => 'La foto de perfil no debe ser mayor a 2048 kilobytes (2MB).',
            ]);
            
            // Procesar la foto de perfil
            if ($request->hasFile('profile_photo')) {
                // Si hay una foto anterior, eliminarla
                $profile = myProfile::where('user_id', $user->id)->first();
                if ($profile && $profile->profile_photo) {
                    Storage::disk('public')->delete('profile_photos/' . $profile->profile_photo);
                }
                
                // Guardar la nueva foto
                $file = $request->file('profile_photo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('profile_photos', $filename, 'public');
                
                $validated['profile_photo'] = $filename;
            } elseif ($request->input('profile_photo') === null && empty($request->input('profile_photo_path'))) {
                // Si se envía explícitamente como nulo y no hay ruta, eliminar la foto
                $profile = myProfile::where('user_id', $user->id)->first();
                if ($profile && $profile->profile_photo) {
                    Storage::disk('public')->delete('profile_photos/' . $profile->profile_photo);
                }
                $validated['profile_photo'] = null;
            } else {
                // Mantener la foto existente
                $photoPath = $request->input('profile_photo_path');
                $profile = myProfile::where('user_id', $user->id)->first();
                
                if (!empty($photoPath)) {
                    $validated['profile_photo'] = $photoPath;
                } elseif ($profile && $profile->profile_photo) {
                    $validated['profile_photo'] = $profile->profile_photo;
                }
            }
            
            // Eliminar campos que no queremos guardar
            unset($validated['profile_photo_path']);
            
            // Actualizar o crear el perfil
            myProfile::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($validated, ['user_id' => $user->id])
            );
            
            // También actualizar algunos datos en la tabla de usuarios si es necesario
            $user->update([
                'name' => $validated['full_name'],
                'email' => $validated['institutional_email'],
            ]);
            
            return back()->with('success', 'La información del perfil ha sido guardada correctamente');
        } catch (\Exception $e) {
            Log::error('Error al guardar información del perfil: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Error al guardar la información: ' . $e->getMessage()]);
        }
    }
    
    /**
     * Obtener lista de facultades o departamentos
     */
    private function getFacultiesDepartments()
    {
        return [
            'Facultad de Ingeniería',
            'Facultad de Ciencias',
            'Facultad de Medicina',
            'Facultad de Derecho',
            'Facultad de Ciencias Económicas',
            'Facultad de Artes',
            'Facultad de Ciencias Humanas',
            'Facultad de Enfermería',
            'Dirección Académica',
            'Dirección Administrativa',
            'Rectoría',
            'Vicerrectoría',
            'Registro y Control',
            'Bienestar Universitario',
            'Recursos Humanos',
            'Tecnología y Sistemas',
            'Planeación',
            'Extensión Universitaria',
            'Investigación',
            'Internacionalización',
            'Biblioteca',
            'Admisiones',
        ];
    }
}