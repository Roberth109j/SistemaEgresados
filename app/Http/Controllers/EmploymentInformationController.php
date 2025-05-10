<?php

namespace App\Http\Controllers;

use App\Models\EmploymentInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EmploymentInformationController extends Controller
{
    /**
     * Muestra la página de información laboral.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        
        // Obtener el historial laboral ordenado por más reciente
        $employmentHistory = EmploymentInformation::where('user_id', $user->id)
            ->orderByRecent()
            ->get();
        
        // Calcular el porcentaje de completado (basado en al menos un registro)
        $completionPercentage = $employmentHistory->count() > 0 ? 100 : 0;
        
        // Obtener posiciones comunes para el autocompletado (como ejemplo)
        $commonPositions = [
            'Desarrollador Web',
            'Ingeniero de Software',
            'Analista de Sistemas',
            'Diseñador UX/UI',
            'Gerente de Proyecto',
            'Consultor IT',
            'Administrador de Base de Datos',
            'Especialista en Seguridad',
            'DevOps Engineer',
            'Full Stack Developer'
        ];
        
        // Definir tipos de empresa para el selector
        $companyTypes = [
            'Tecnología',
            'Consultoría',
            'Educación',
            'Finanzas',
            'Salud',
            'Manufactura',
            'Comercio',
            'Servicios',
            'Gobierno',
            'ONG',
            'Startup'
        ];
        
        // Definir tipos de contrato para el selector
        $contractTypes = [
            'Tiempo Completo',
            'Tiempo Parcial',
            'Freelance',
            'Contrato por Proyecto',
            'Prácticas',
            'Temporal',
            'Indefinido'
        ];
        
        return Inertia::render('EmploymentInformation', [
            'employmentHistory' => $employmentHistory,
            'completionPercentage' => $completionPercentage,
            'commonPositions' => $commonPositions,
            'companyTypes' => $companyTypes,
            'contractTypes' => $contractTypes,
        ]);
    }

    /**
     * Almacena un nuevo registro de experiencia laboral.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Registrar los datos recibidos para depuración
        Log::info('EmploymentInformation store method called with data:', $request->all());
        
        try {
            $validated = $request->validate([
                'position_name' => 'required|string|max:255',
                'company_name' => 'required|string|max:255',
                'company_type' => 'nullable|string|max:100',
                'location' => 'required|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'is_current_job' => 'boolean',
                'contract_type' => 'nullable|string|max:100',
                'responsibilities' => 'nullable|string',
                'soft_skills' => 'nullable|array',
                'hard_skills' => 'nullable|array',
            ]);
            
            // Asegurarse de que end_date sea null si es el trabajo actual
            if ($request->boolean('is_current_job')) {
                $validated['end_date'] = null;
            }
            
            // Asignar el usuario actual al registro
            $validated['user_id'] = Auth::id();
            
            // Registrar los datos validados para depuración
            Log::info('EmploymentInformation validated data:', $validated);
            
            // Crear el registro
            $record = EmploymentInformation::create($validated);
            
            // Registrar el resultado para depuración
            Log::info('EmploymentInformation record created:', ['id' => $record->id]);
            
            return redirect()->route('employmentInformation')->with('success', 'La información laboral ha sido guardada correctamente');
            
        } catch (\Exception $e) {
            // Registrar cualquier excepción para depuración
            Log::error('Error creating employment information:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->withErrors(['error' => 'Ha ocurrido un error al guardar la información: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Actualiza un registro de experiencia laboral.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        // Registrar los datos recibidos para depuración
        Log::info('EmploymentInformation update method called for ID ' . $id . ' with data:', $request->all());
        
        try {
            $employmentInfo = EmploymentInformation::findOrFail($id);
            
            // Verificar si el registro pertenece al usuario actual
            if ($employmentInfo->user_id !== Auth::id()) {
                return redirect()->back()->withErrors(['error' => 'No está autorizado para editar este registro.']);
            }
            
            $validated = $request->validate([
                'position_name' => 'required|string|max:255',
                'company_name' => 'required|string|max:255',
                'company_type' => 'nullable|string|max:100',
                'location' => 'required|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'is_current_job' => 'boolean',
                'contract_type' => 'nullable|string|max:100',
                'responsibilities' => 'nullable|string',
                'soft_skills' => 'nullable|array',
                'hard_skills' => 'nullable|array',
            ]);
            
            // Asegurarse de que end_date sea null si es el trabajo actual
            if ($request->boolean('is_current_job')) {
                $validated['end_date'] = null;
            }
            
            // Registrar los datos validados para depuración
            Log::info('EmploymentInformation validated update data:', $validated);
            
            $employmentInfo->update($validated);
            
            return redirect()->route('employmentInformation')->with('success', 'La información laboral ha sido actualizada correctamente');
            
        } catch (\Exception $e) {
            // Registrar cualquier excepción para depuración
            Log::error('Error updating employment information:', [
                'id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->withErrors(['error' => 'Ha ocurrido un error al actualizar la información: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Elimina un registro de experiencia laboral.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        try {
            $employmentInfo = EmploymentInformation::findOrFail($id);
            
            // Verificar si el registro pertenece al usuario actual
            if ($employmentInfo->user_id !== Auth::id()) {
                return redirect()->back()->withErrors(['error' => 'No está autorizado para eliminar este registro.']);
            }
            
            $employmentInfo->delete();
            
            return redirect()->route('employmentInformation')->with('success', 'El registro ha sido eliminado correctamente');
            
        } catch (\Exception $e) {
            Log::error('Error deleting employment information:', [
                'id' => $id,
                'message' => $e->getMessage()
            ]);
            
            return redirect()->back()->withErrors(['error' => 'Ha ocurrido un error al eliminar el registro.']);
        }
    }

    /**
     * Elimina múltiples registros de experiencia laboral.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroyMultiple(Request $request)
    {
        Log::info('EmploymentInformation destroyMultiple called with data:', $request->all());
        
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'integer|exists:employment_information,id'
            ]);
            
            // Verificar que todos los registros pertenezcan al usuario actual
            $records = EmploymentInformation::whereIn('id', $validated['ids'])
                ->where('user_id', Auth::id())
                ->get();
            
            if ($records->count() !== count($validated['ids'])) {
                return redirect()->back()->withErrors(['error' => 'No está autorizado para eliminar algunos de estos registros.']);
            }
            
            EmploymentInformation::whereIn('id', $validated['ids'])->delete();
            
            return redirect()->route('employmentInformation')->with('success', 'Los registros seleccionados han sido eliminados correctamente');
            
        } catch (\Exception $e) {
            Log::error('Error deleting multiple employment information records:', [
                'message' => $e->getMessage()
            ]);
            
            return redirect()->back()->withErrors(['error' => 'Ha ocurrido un error al eliminar los registros.']);
        }
    }

    /**
     * Obtiene todos los registros de experiencia laboral para API.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll()
    {
        $user = Auth::user();
        
        $employmentHistory = EmploymentInformation::where('user_id', $user->id)
            ->orderByRecent()
            ->get();
        
        return response()->json($employmentHistory);
    }
}