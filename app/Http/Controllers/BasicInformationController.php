<?php

namespace App\Http\Controllers;

use App\Models\BasicInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BasicInformationController extends Controller
{
    /**
     * Mostrar el formulario de información básica con datos precargados.
     */
    public function index()
    {
        // Verificar la estructura de la tabla para evitar errores
        $this->verifyTableStructure();
        
        $user = Auth::user();
        $basicInfo = $user->basicInformation ?? null;
        
        // Manejar la distribución de nombres y apellidos
        $firstName = '';
        $lastName = '';
        
        if ($basicInfo) {
            // Si ya existe información básica, usamos esos valores
            $firstName = $basicInfo->first_name;
            $lastName = $basicInfo->last_name;
        } else {
            // Si no hay información básica, procesamos el nombre del usuario
            $fullName = $user->name ?? '';
            
            // Mejorado: permite manejar nombres con múltiples palabras y dos apellidos
            // Suponemos que los dos últimos elementos son apellidos (apellido paterno y materno)
            $nameParts = preg_split('/\s+/', trim($fullName));
            
            if (count($nameParts) >= 3) {
                // Si hay tres o más palabras, consideramos las últimas dos como apellidos
                $lastName = implode(' ', array_slice($nameParts, -2));
                $firstName = implode(' ', array_slice($nameParts, 0, -2));
            } else if (count($nameParts) == 2) {
                // Si hay exactamente dos palabras, consideramos la última como apellido
                $lastName = end($nameParts);
                $firstName = reset($nameParts);
            } else {
                // Si solo hay una palabra o está vacío
                $firstName = $fullName;
                $lastName = $user->lastname ?? '';
            }
        }
        
        // Listas de ciudades y departamentos
        $cities = $this->getColombiaCities();
        $departments = $this->getColombianDepartments();
        $institutions = $this->getColombianInstitutions();
        
        // Asegurar que el directorio para las fotos de perfil exista
        if (!Storage::disk('public')->exists('profile_photos')) {
            Storage::disk('public')->makeDirectory('profile_photos');
        }
        
        return Inertia::render('basicInformation', [
            'userData' => [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $user->email,
            ],
            'basicInfo' => $basicInfo,
            'cities' => $cities,
            'departments' => $departments,
            'institutions' => $institutions,
        ]);
    }

    /**
     * Almacenar o actualizar información básica del usuario.
     */
    public function store(Request $request)
    {
        // Verificar la estructura de la tabla para evitar errores
        $this->verifyTableStructure();
        
        try {
            // Validar las entradas con un mensaje de error personalizado para el tamaño de la foto
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'document_type' => 'required|string|max:50',
                'document_number' => 'required|string|max:50',
                'gender' => 'required|string|max:50',
                'email' => 'nullable|email|max:255',
                'profile_photo' => [
                    'nullable',
                    'image',
                    'max:2048', // 2MB en kilobytes
                    function ($attribute, $value, $fail) {
                        if ($value && $value->getSize() > 2048 * 1024) {
                            $fail('El campo foto de perfil no debe ser mayor a 2048 kilobytes.');
                        }
                    },
                ],
                'profile_photo_path' => 'nullable|string',
                'graduation_date' => 'nullable|date',
                'institution' => 'present|nullable|string|max:255',
                'career' => 'present|nullable|string|max:255',
                'address' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'city' => 'nullable|string|max:100',
                'department' => 'nullable|string|max:100',
                'country' => 'nullable|string|max:100',
                'additional_info' => 'nullable|string',
            ], [
                'profile_photo.max' => 'La foto de perfil no debe ser mayor a 2048 kilobytes (2MB).',
                'gender.required' => 'El campo sexo es obligatorio.',
            ]);
            
            $user = Auth::user();
            
            // Registrar datos para depuración
            Log::info("Datos validados antes de procesamiento:", [
                'first_name' => $validated['first_name'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'institution' => $validated['institution'] ?? null,
                'career' => $validated['career'] ?? null
            ]);
            
            // Eliminar campos que no existen en la tabla
            $columns = Schema::getColumnListing('basic_information');
            foreach (array_keys($validated) as $field) {
                if (!in_array($field, $columns) && $field !== 'profile_photo' && $field !== 'profile_photo_path') {
                    unset($validated[$field]);
                }
            }
            
            // Asegurar que ningún campo se convierte a NULL si está vacío
            foreach ($validated as $key => $value) {
                if ($value === null && $key !== 'graduation_date' && $key !== 'profile_photo' && $key !== 'profile_photo_path') {
                    $validated[$key] = '';
                }
            }
            
            // Asegurar que los campos de institución y carrera sean procesados correctamente
            if (isset($validated['institution']) && !empty($validated['institution'])) {
                Log::info("Institución recibida: " . $validated['institution']);
            } else if ($request->has('institution')) {
                $validated['institution'] = $request->input('institution') ?: '';
                Log::info("Institución asignada manualmente: " . $validated['institution']);
            }
            
            if (isset($validated['career']) && !empty($validated['career'])) {
                Log::info("Carrera recibida: " . $validated['career']);
            } else if ($request->has('career')) {
                $validated['career'] = $request->input('career') ?: '';
                Log::info("Carrera asignada manualmente: " . $validated['career']);
            }
            
            // Procesar la foto de perfil si se ha subido
            if ($request->hasFile('profile_photo')) {
                // Si hay una foto anterior, eliminarla (solo si estamos reemplazando)
                if ($user->basicInformation && $user->basicInformation->profile_photo) {
                    try {
                        Storage::disk('public')->delete('profile_photos/' . $user->basicInformation->profile_photo);
                    } catch (\Exception $e) {
                        Log::warning("No se pudo eliminar la foto anterior: " . $e->getMessage());
                    }
                }
                
                // Crear el directorio si no existe
                Storage::disk('public')->makeDirectory('profile_photos');
                
                // Guardar la nueva foto
                $file = $request->file('profile_photo');
                
                // Verificar el tamaño del archivo
                if ($file->getSize() > 2048 * 1024) {
                    return back()->withErrors([
                        'profile_photo' => 'La foto de perfil no debe ser mayor a 2048 kilobytes (2MB).'
                    ]);
                }
                
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('profile_photos', $filename, 'public');
                
                $validated['profile_photo'] = $filename;
                Log::info("Foto guardada: " . $filename);
            } elseif ($request->has('profile_photo') && $request->input('profile_photo') === null && empty($request->input('profile_photo_path'))) {
                // Si se envía explícitamente como nulo y no hay ruta guardada, eliminamos la foto
                if ($user->basicInformation && $user->basicInformation->profile_photo) {
                    Storage::disk('public')->delete('profile_photos/' . $user->basicInformation->profile_photo);
                }
                $validated['profile_photo'] = null;
            } else {
                // Mantener la foto existente (usamos la ruta guardada o la foto actual)
                $photoPath = $request->input('profile_photo_path');
                if (!empty($photoPath)) {
                    // Si tenemos una ruta guardada, la usamos
                    $validated['profile_photo'] = $photoPath;
                    Log::info("Manteniendo foto existente desde ruta: " . $photoPath);
                } elseif ($user->basicInformation && $user->basicInformation->profile_photo) {
                    // O usamos la foto actual si ya existe
                    $validated['profile_photo'] = $user->basicInformation->profile_photo;
                    Log::info("Manteniendo foto existente: " . $user->basicInformation->profile_photo);
                }
            }
            
            // Eliminar campos que no queremos guardar en la base de datos
            unset($validated['profile_photo_path']);
            
            // Actualizar o crear la información básica
            $basicInfo = BasicInformation::updateOrCreate(
                ['user_id' => $user->id],
                $validated
            );
            
            // Log después de guardar para verificar
            Log::info("Información básica guardada. ID: " . $basicInfo->id);
            Log::info("Institución guardada: " . $basicInfo->institution);
            Log::info("Carrera guardada: " . $basicInfo->career);
            Log::info("Nombres guardados: " . $basicInfo->first_name);
            Log::info("Apellidos guardados: " . $basicInfo->last_name);
            Log::info("Sexo guardado: " . $basicInfo->gender);
            
            // También actualizar el nombre y apellido en la tabla de usuarios
            $user->update([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            ]);
            
            return back()->with('success', 'La información básica ha sido guardada correctamente');
        } catch (\Exception $e) {
            Log::error('Error al guardar información básica: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return back()->withErrors(['general' => 'Error al guardar la información: ' . $e->getMessage()]);
        }
    }
    
    /**
     * Verifica la estructura de la tabla y corrige problemas comunes
     */
    private function verifyTableStructure()
    {
        try {
            // Verifica si existe la tabla
            if (!Schema::hasTable('basic_information')) {
                Log::error('Tabla basic_information no existe');
                return;
            }
            
            // Verifica campos necesarios y los agrega si faltan
            $requiredColumns = [
                'email' => 'string',
                'profile_photo' => 'string',
                'institution' => 'string',
                'career' => 'string',
                'gender' => 'string', // Campo de sexo
            ];
            
            foreach ($requiredColumns as $column => $type) {
                if (!Schema::hasColumn('basic_information', $column)) {
                    Log::info("Agregando columna faltante: {$column}");
                    
                    Schema::table('basic_information', function ($table) use ($column, $type) {
                        if ($type == 'string') {
                            $table->string($column)->nullable();
                        } elseif ($type == 'text') {
                            $table->text($column)->nullable();
                        }
                    });
                }
            }
        } catch (\Exception $e) {
            Log::error('Error verificando estructura de tabla: ' . $e->getMessage());
        }
    }

    /**
     * Obtener lista de ciudades de Colombia
     */
    private function getColombiaCities()
    {
        return [
            'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira',
            'Santa Marta', 'Manizales', 'Cúcuta', 'Pasto', 'Ibagué', 'Neiva', 'Montería',
            'Villavicencio', 'Armenia', 'Valledupar', 'Popayán', 'Sincelejo', 'Tunja',
            'Riohacha', 'Quibdó', 'Florencia', 'Yopal', 'Mocoa', 'San José del Guaviare',
            'Puerto Carreño', 'Inírida', 'Mitú', 'Leticia'
        ];
    }

    /**
     * Obtener lista de departamentos de Colombia
     */
    private function getColombianDepartments()
    {
        return [
            'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas',
            'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
            'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
            'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
            'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
            'Bogotá D.C.'
        ];
    }
    
    /**
     * Obtener lista de instituciones educativas colombianas
     */
    private function getColombianInstitutions()
    {
        return [
            'Universidad Nacional de Colombia',
            'Universidad de los Andes',
            'Pontificia Universidad Javeriana',
            'Universidad del Rosario',
            'Universidad de Antioquia',
            'Universidad del Valle',
            'Universidad Industrial de Santander',
            'Universidad EAFIT',
            'Universidad Externado de Colombia',
            'Universidad del Norte',
            'Universidad de La Sabana',
            'Universidad Pontificia Bolivariana',
            'Universidad de Caldas',
            'Universidad del Cauca',
            'Universidad Pedagógica Nacional',
            'Universidad Tecnológica de Pereira',
            'Universidad de Nariño',
            'Universidad de Cartagena',
            'Universidad del Atlántico',
            'Universidad Mariana',
            'Universidad de Manizales',
            'Universidad de Pamplona',
            'Universidad del Magdalena',
            'Universidad de La Salle',
            'Universidad Santo Tomás',
            'Universidad Central',
            'Universidad EAN',
            'Universidad Militar Nueva Granada',
            'Universidad El Bosque',
            'Universidad Sergio Arboleda'
        ];
    }
}