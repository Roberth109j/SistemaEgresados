<?php

namespace App\Http\Controllers;

use App\Models\AcademicInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AcademicInformationController extends Controller
{
    /**
     * Mostrar la página de información académica con los datos del usuario.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Obtener educación formal y cursos por separado, ordenados por fecha de finalización (más reciente primero)
        $formalEducation = $user->academicInformation()
            ->formal()
            ->orderBy('end_date', 'desc')
            ->get();
            
        $courses = $user->academicInformation()
            ->courses()
            ->orderBy('end_date', 'desc')
            ->get();
        
        // Obtener listas de instituciones y programas comunes
        $institutions = $this->getColombianUniversities();
        $programs = $this->getCommonPrograms();
        
        return Inertia::render('academicInformation', [
            'formalEducation' => $formalEducation,
            'courses' => $courses,
            'institutions' => $institutions,
            'programs' => $programs,
        ]);
    }

    /**
     * Almacenar una nueva información académica.
     */
    public function store(Request $request)
    {
        try {
            // Validar datos según el tipo de registro (formal o curso)
            if ($request->input('type') === 'formal') {
                $validated = $request->validate([
                    'type' => 'required|in:formal',
                    'level' => 'required|in:educación superior,pregrado,especialización,maestría,doctorado',
                    'program_name' => 'required|string|max:255',
                    'custom_program_name' => 'nullable|string|max:255',
                    'institution' => 'required|string|max:255',
                    'custom_institution' => 'nullable|string|max:255',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date', // Eliminamos la restricción after_or_equal
                    'degree_obtained' => 'required|string|max:255',
                    'certificate_file' => 'nullable|file|mimes:pdf|max:5120', // 5MB máximo
                ]);
            } else {
                $validated = $request->validate([
                    'type' => 'required|in:course',
                    'program_name' => 'required|string|max:255',
                    'custom_program_name' => 'nullable|string|max:255',
                    'institution' => 'required|string|max:255',
                    'custom_institution' => 'nullable|string|max:255',
                    'end_date' => 'required|date',
                    'certificate_file' => 'nullable|file|mimes:pdf|max:5120', // 5MB máximo
                ]);
            }
            
            $user = Auth::user();
            
            // Procesar el archivo de certificado si se ha subido
            if ($request->hasFile('certificate_file')) {
                $file = $request->file('certificate_file');
                $fileName = Str::random(40) . '.' . $file->getClientOriginalExtension();
                $originalName = $file->getClientOriginalName();
                
                // Guardar el archivo
                $path = $file->storeAs('certificates', $fileName, 'public');
                
                $validated['certificate_file'] = $fileName;
                $validated['certificate_file_name'] = $originalName;
            }
            
            // Crear nuevo registro
            $academicInfo = new AcademicInformation($validated);
            $user->academicInformation()->save($academicInfo);
            
            return back()->with('success', 'La información académica ha sido guardada correctamente');
        } catch (\Exception $e) {
            Log::error('Error al guardar información académica: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Error al guardar la información: ' . $e->getMessage()]);
        }
    }

    /**
     * Actualizar una información académica existente.
     */
    public function update(Request $request, $id)
    {
        try {
            $academicInfo = AcademicInformation::findOrFail($id);
            
            // Verificar que el registro pertenece al usuario actual
            if ($academicInfo->user_id !== Auth::id()) {
                return back()->withErrors(['general' => 'No tienes permiso para editar este registro.']);
            }
            
            // Validar datos según el tipo de registro (formal o curso)
            if ($request->input('type') === 'formal') {
                $validated = $request->validate([
                    'level' => 'required|in:educación superior,pregrado,especialización,maestría,doctorado',
                    'program_name' => 'required|string|max:255',
                    'custom_program_name' => 'nullable|string|max:255',
                    'institution' => 'required|string|max:255',
                    'custom_institution' => 'nullable|string|max:255',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after_or_equal:start_date',
                    'degree_obtained' => 'required|string|max:255',
                    'certificate_file' => 'nullable|file|mimes:pdf|max:5120', // 5MB máximo
                ]);
            } else {
                $validated = $request->validate([
                    'program_name' => 'required|string|max:255',
                    'custom_program_name' => 'nullable|string|max:255',
                    'institution' => 'required|string|max:255',
                    'custom_institution' => 'nullable|string|max:255',
                    'end_date' => 'required|date',
                    'certificate_file' => 'nullable|file|mimes:pdf|max:5120', // 5MB máximo
                ]);
            }
            
            // Procesar el archivo de certificado si se ha subido uno nuevo
            if ($request->hasFile('certificate_file')) {
                // Eliminar archivo anterior si existe
                if ($academicInfo->certificate_file) {
                    Storage::disk('public')->delete('certificates/' . $academicInfo->certificate_file);
                }
                
                $file = $request->file('certificate_file');
                $fileName = Str::random(40) . '.' . $file->getClientOriginalExtension();
                $originalName = $file->getClientOriginalName();
                
                // Guardar el nuevo archivo
                $path = $file->storeAs('certificates', $fileName, 'public');
                
                $validated['certificate_file'] = $fileName;
                $validated['certificate_file_name'] = $originalName;
            }
            
            // Actualizar el registro
            $academicInfo->update($validated);
            
            return back()->with('success', 'La información académica ha sido actualizada correctamente');
        } catch (\Exception $e) {
            Log::error('Error al actualizar información académica: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Error al actualizar la información: ' . $e->getMessage()]);
        }
    }

    /**
     * Eliminar una información académica.
     */
    public function destroy($id)
    {
        try {
            $academicInfo = AcademicInformation::findOrFail($id);
            
            // Verificar que el registro pertenece al usuario actual
            if ($academicInfo->user_id !== Auth::id()) {
                return back()->withErrors(['general' => 'No tienes permiso para eliminar este registro.']);
            }
            
            // Eliminar archivo relacionado si existe
            if ($academicInfo->certificate_file) {
                Storage::disk('public')->delete('certificates/' . $academicInfo->certificate_file);
            }
            
            $academicInfo->delete();
            
            return back()->with('success', 'El registro ha sido eliminado correctamente');
        } catch (\Exception $e) {
            Log::error('Error al eliminar información académica: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Error al eliminar el registro: ' . $e->getMessage()]);
        }
    }

    /**
     * Eliminar múltiples registros de información académica.
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids', []);
            
            if (empty($ids)) {
                return back()->withErrors(['general' => 'No se seleccionaron registros para eliminar.']);
            }
            
            // Obtener registros para verificar permisos y eliminar archivos
            $records = AcademicInformation::whereIn('id', $ids)
                ->where('user_id', Auth::id())
                ->get();
                
            if ($records->count() === 0) {
                return back()->withErrors(['general' => 'No se encontraron registros válidos para eliminar.']);
            }
            
            foreach ($records as $record) {
                // Eliminar archivo relacionado si existe
                if ($record->certificate_file) {
                    Storage::disk('public')->delete('certificates/' . $record->certificate_file);
                }
                $record->delete();
            }
            
            return back()->with('success', 'Los registros seleccionados han sido eliminados correctamente');
        } catch (\Exception $e) {
            Log::error('Error al eliminar múltiples registros académicos: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Error al eliminar los registros: ' . $e->getMessage()]);
        }
    }

    /**
     * Descargar un certificado.
     */
    public function downloadCertificate($id)
    {
        try {
            $academicInfo = AcademicInformation::findOrFail($id);
            
            // Verificar que el registro pertenece al usuario actual
            if ($academicInfo->user_id !== Auth::id()) {
                return back()->withErrors(['general' => 'No tienes permiso para descargar este certificado.']);
            }
            
            if (!$academicInfo->certificate_file) {
                return back()->withErrors(['general' => 'Este registro no tiene un certificado adjunto.']);
            }
            
            $filePath = 'certificates/' . $academicInfo->certificate_file;
            $fileName = $academicInfo->certificate_file_name ?: 'certificado.pdf';
            
            if (!Storage::disk('public')->exists($filePath)) {
                return back()->withErrors(['general' => 'El archivo no existe en el servidor.']);
            }
            
            return Storage::disk('public')->download($filePath, $fileName);
        } catch (\Exception $e) {
            Log::error('Error al descargar certificado: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Error al descargar el certificado: ' . $e->getMessage()]);
        }
    }

    /**
     * Obtener la lista completa de universidades colombianas
     */
    private function getColombianUniversities()
    {
        return [
            'Universidad Mariana',
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
            'Universidad Distrital Francisco José de Caldas',
            'Universidad Santo Tomás',
            'Universidad de La Salle',
            'Universidad El Bosque',
            'Universidad Sergio Arboleda',
            'Universidad CES',
            'Universidad Militar Nueva Granada',
            'Universidad EAN',
            'Universidad del Magdalena',
            'Universidad Central',
            'Universidad Autónoma de Bucaramanga',
            'Universidad de Córdoba',
            'Universidad de Pamplona',
            'Universidad de Manizales',
            'Universidad Autónoma de Occidente',
            'Universidad de Medellín',
            'Universidad de la Costa CUC',
            'Universidad del Tolima',
            'Universidad Santiago de Cali',
            'Universidad Jorge Tadeo Lozano',
            'Universidad Libre',
            'Universidad Cooperativa de Colombia',
            'Universidad de Boyacá',
            'Universidad Tecnológica de Bolívar',
            'SENA',
            'Coursera',
            'edX',
            'Udemy',
            'Platzi',
            'LinkedIn Learning',
            'Otro', // Nueva opción para permitir inputs personalizados
        ];
    }

    /**
     * Obtener programas comunes para autocompletar.
     */
    private function getCommonPrograms()
    {
        return [
            'Administración de Empresas',
            'Ingeniería de Sistemas',
            'Ingeniería Civil',
            'Medicina',
            'Derecho',
            'Psicología',
            'Contaduría Pública',
            'Economía',
            'Arquitectura',
            'Comunicación Social',
            'Diseño Gráfico',
            'Ingeniería Industrial',
            'Enfermería',
            'Marketing Digital',
            'Desarrollo Web',
            'Ciencia de Datos',
            'Inteligencia Artificial',
            'Gestión de Proyectos',
            'Recursos Humanos',
            'Finanzas Corporativas',
            'Ingeniería Electrónica',
            'Ingeniería Mecánica',
            'Ingeniería Ambiental',
            'Odontología',
            'Biología',
            'Química',
            'Física',
            'Matemáticas',
            'Sociología',
            'Antropología',
            'Historia',
            'Filosofía',
            'Literatura',
            'Artes Plásticas',
            'Música',
            'Teatro',
            'Cine y Televisión',
            'Nutrición y Dietética',
            'Fisioterapia',
            'Terapia Ocupacional',
            'Fonoaudiología',
            'Trabajo Social',
            'Pedagogía Infantil',
            'Licenciatura en Matemáticas',
            'Licenciatura en Lenguas',
            'Licenciatura en Ciencias Sociales',
            'Zootecnia',
            'Agronomía',
            'Medicina Veterinaria',
            'Comercio Internacional',
            'Otro',
        ];
    }
}