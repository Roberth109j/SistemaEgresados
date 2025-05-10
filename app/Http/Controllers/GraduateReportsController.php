<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\BasicInformation;
use App\Models\AcademicInformation;
use App\Models\EmploymentInformation;
use Barryvdh\DomPDF\Facade\Pdf;

class GraduateReportsController extends Controller
{
    public function index(Request $request)
    {
        // Registrar la llamada al método para depuración
        Log::info('GraduateReportsController@index llamado', [
            'user_id' => Auth::id(),
            'user_role' => Auth::user()->role ?? 'No role',
            'timestamp' => now()->toDateTimeString(),
            'request_params' => $request->all()
        ]);
        
        try {
            // Obtener filtros de la solicitud
            $filters = $this->getFilterParams($request);
            
            // Obtener datos básicos de egresados con filtros aplicados
            $graduates = $this->getFilteredGraduates($filters);
            
            // Generar estadísticas y distribuciones
            $stats = $this->generateStats($graduates);
            $genderDistribution = $this->generateGenderDistribution($graduates);
            $locationDistribution = $this->generateLocationDistribution($graduates);
            $academicDistribution = $this->generateAcademicDistribution($graduates);
            $graduationYearDistribution = $this->generateGraduationYearDistribution($graduates);
            $academicLevelDistribution = $this->generateAcademicLevelDistribution($graduates);
            $contactStatusDistribution = $this->generateContactStatusDistribution($graduates);
            $profileCompletionDistribution = $this->generateProfileCompletionDistribution($graduates);
            $employmentSectorDistribution = $this->generateEmploymentSectorDistribution();
            $skillsDistribution = $this->generateSkillsDistribution();
            $topEmployers = $this->generateTopEmployers();
            
            // Obtener opciones para los filtros
            $filterOptions = $this->getFilterOptions();
            
            // Renderizar el componente con todos los datos
            return Inertia::render('GraduateReports', [
                'stats' => $stats,
                'basicInfo' => $graduates,
                'genderDistribution' => $genderDistribution,
                'locationDistribution' => $locationDistribution,
                'academicDistribution' => $academicDistribution,
                'graduationYearDistribution' => $graduationYearDistribution,
                'academicLevelDistribution' => $academicLevelDistribution,
                'contactStatusDistribution' => $contactStatusDistribution,
                'profileCompletionDistribution' => $profileCompletionDistribution,
                'employmentSectorDistribution' => $employmentSectorDistribution,
                'skillsDistribution' => $skillsDistribution,
                'topEmployers' => $topEmployers,
                'filters' => $filterOptions,
            ]);
        } catch (\Exception $e) {
            // Registrar cualquier error que ocurra
            Log::error('Error en GraduateReportsController@index', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Devolver una respuesta con datos mínimos y mostrar el error
            return Inertia::render('GraduateReports', [
                'stats' => [
                    'totalGraduates' => 0,
                    'recentlyRegistered' => 0,
                    'withEmployment' => 0,
                    'withHigherEducation' => 0,
                    'withCompleteProfiles' => 0,
                    'mostPopularCity' => 'No disponible',
                    'mostPopularCareer' => 'No disponible',
                ],
                'basicInfo' => [],
                'genderDistribution' => [],
                'locationDistribution' => [],
                'academicDistribution' => [],
                'graduationYearDistribution' => [],
                'academicLevelDistribution' => [],
                'contactStatusDistribution' => [],
                'profileCompletionDistribution' => [],
                'employmentSectorDistribution' => [],
                'skillsDistribution' => [
                    'softSkills' => [],
                    'hardSkills' => []
                ],
                'topEmployers' => [],
                'filters' => [
                    'institutions' => [],
                    'careers' => [],
                    'cities' => [],
                    'departments' => [],
                    'years' => [],
                ],
                'error' => 'Error al cargar los datos: ' . $e->getMessage(),
            ]);
        }
    }

    public function export(Request $request)
    {
        Log::info('GraduateReportsController@export llamado', [
            'user_id' => Auth::id(),
            'report_type' => $request->input('report', 'unknown'),
            'timestamp' => now()->toDateTimeString(),
            'filters' => $request->all()
        ]);
        
        try {
            $reportType = $request->input('report', 'complete');
            $filters = $this->getFilterParams($request);
            
            // Obtener datos para el reporte
            $graduates = $this->getFilteredGraduates($filters);
            
            // Configuración base para todos los reportes
            $data = [
                'title' => $this->getReportTitle($reportType),
            ];

            // Añadir datos específicos según el tipo de reporte
            switch ($reportType) {
                case 'general':
                    $data['stats'] = $this->generateStats($graduates);
                    $data['graduates'] = $graduates->take(10);
                    break;
                case 'gender':
                    $data['genderDistribution'] = $this->generateGenderDistribution($graduates);
                    break;
                case 'location':
                    $data['locationDistribution'] = $this->generateLocationDistribution($graduates);
                    break;
                case 'academic':
                    $data['academicDistribution'] = $this->generateAcademicDistribution($graduates);
                    break;
                case 'graduationYear':
                    $data['graduationYearDistribution'] = $this->generateGraduationYearDistribution($graduates);
                    break;
                case 'academicLevel':
                    $data['academicLevelDistribution'] = $this->generateAcademicLevelDistribution($graduates);
                    break;
                case 'profileCompletion':
                    $data['profileCompletionDistribution'] = $this->generateProfileCompletionDistribution($graduates);
                    break;
                case 'employmentSector':
                    $data['employmentSectorDistribution'] = $this->generateEmploymentSectorDistribution();
                    break;
                case 'skills':
                    $data['skillsDistribution'] = $this->generateSkillsDistribution();
                    break;
                case 'topEmployers':
                    $data['topEmployers'] = $this->generateTopEmployers();
                    break;
                case 'additionalInfo':
                    $data['graduates'] = $graduates->filter(function($graduate) {
                        return !empty($graduate['additional_info']);
                    });
                    break;
                case 'graduatesList':
                    $data['graduates'] = $graduates;
                    break;
                case 'profileDetail':
                    $data['graduates'] = $graduates;
                    break;
                case 'locationMap':
                    $data['graduates'] = $graduates;
                    break;
                case 'contactStatus':
                    $data['contactStatusDistribution'] = $this->generateContactStatusDistribution($graduates);
                    $data['graduates'] = $graduates;
                    break;
                case 'complete':
                default:
                    $data = [
                        'title' => $this->getReportTitle('complete'),
                        'stats' => $this->generateStats($graduates),
                        'genderDistribution' => $this->generateGenderDistribution($graduates),
                        'locationDistribution' => $this->generateLocationDistribution($graduates),
                        'academicDistribution' => $this->generateAcademicDistribution($graduates),
                        'graduationYearDistribution' => $this->generateGraduationYearDistribution($graduates),
                        'academicLevelDistribution' => $this->generateAcademicLevelDistribution($graduates),
                        'contactStatusDistribution' => $this->generateContactStatusDistribution($graduates),
                        'profileCompletionDistribution' => $this->generateProfileCompletionDistribution($graduates),
                        'employmentSectorDistribution' => $this->generateEmploymentSectorDistribution(),
                        'skillsDistribution' => $this->generateSkillsDistribution(),
                        'topEmployers' => $this->generateTopEmployers(),
                        'graduates' => $graduates,
                    ];
                    break;
            }

            // Configurar opciones del PDF para mejor renderizado
            $options = [
                'margin-top' => '10mm',
                'margin-right' => '10mm',
                'margin-bottom' => '10mm',
                'margin-left' => '10mm',
                'encoding' => 'UTF-8',
                'dpi' => 150,
                'default-font-size' => 11,
                'enable-javascript' => false,
                'enable-smart-shrinking' => true,
                'no-stop-slow-scripts' => true,
            ];

            // Generar PDF con opciones mejoradas
            $pdf = PDF::loadView('reports.' . $reportType, $data)->setOptions($options);
            
            // Ajustar orientación para reportes con muchas columnas
            if (in_array($reportType, ['graduatesList', 'profileDetail'])) {
                $pdf->setPaper('a4', 'landscape');
            }
            
            return $pdf->download('reporte-egresados-' . $reportType . '.pdf');
            
        } catch (\Exception $e) {
            Log::error('Error en GraduateReportsController@export', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            
            // Devolver una respuesta más informativa
            return response("Error al generar el reporte: " . $e->getMessage(), 500)
                ->header('Content-Type', 'text/plain');
        }
    }

    // Método auxiliar para obtener títulos consistentes
    private function getReportTitle($reportType)
    {
        $titles = [
            'general' => 'Resumen General de Egresados',
            'gender' => 'Distribución por Género',
            'location' => 'Distribución por Ubicación',
            'academic' => 'Distribución Académica',
            'graduationYear' => 'Distribución por Año de Graduación',
            'academicLevel' => 'Distribución por Nivel Académico',
            'profileCompletion' => 'Progreso de Completitud de Perfiles',
            'employmentSector' => 'Distribución por Sector de Empleo',
            'skills' => 'Habilidades más Frecuentes',
            'topEmployers' => 'Principales Empleadores',
            'additionalInfo' => 'Información Adicional',
            'graduatesList' => 'Listado Completo de Egresados',
            'profileDetail' => 'Detalle de Completitud de Perfiles',
            'locationMap' => 'Distribución Geográfica',
            'contactStatus' => 'Estado de Contactabilidad',
            'complete' => 'Reporte Completo de Egresados',
        ];
        
        return $titles[$reportType] ?? 'Reporte de Egresados';
    }

    // Métodos auxiliares para generar los datos de cada reporte
    private function getFilterParams(Request $request)
    {
        return [
            'institution' => $request->input('institution'),
            'career' => $request->input('career'),
            'city' => $request->input('city'),
            'department' => $request->input('department'),
            'year' => $request->input('year'),
        ];
    }

    private function getFilteredGraduates($filters)
    {
        // Query base: obtener usuarios con rol 'Egresado'
        $query = User::where('role', 'Egresado')
                      ->with('basicInformation', 'academicInformation', 'employmentInformation');

        // Aplicar filtros si existen
        if (!empty($filters['institution'])) {
            $query->whereHas('academicInformation', function($q) use ($filters) {
                $q->where('institution', $filters['institution'])
                  ->orWhere('custom_institution', $filters['institution']);
            });
        }

        if (!empty($filters['career'])) {
            $query->whereHas('basicInformation', function($q) use ($filters) {
                $q->where('career', $filters['career']);
            });
        }

        if (!empty($filters['city'])) {
            $query->whereHas('basicInformation', function($q) use ($filters) {
                $q->where('city', $filters['city']);
            });
        }

        if (!empty($filters['department'])) {
            $query->whereHas('basicInformation', function($q) use ($filters) {
                $q->where('department', $filters['department']);
            });
        }

        if (!empty($filters['year'])) {
            $query->whereHas('basicInformation', function($q) use ($filters) {
                $q->whereYear('graduation_date', $filters['year']);
            });
        }

        // Ejecutar la consulta
        $users = $query->get();

        // Formatear los datos para el frontend
        return $users->map(function($user) {
            $basicInfo = $user->basicInformation;
            $academicInfo = $user->academicInformation;
            $employmentInfo = $user->employmentInformation;

            // Calcular el progreso del perfil
            $profileCompletion = $this->calculateProfileCompletion($basicInfo, $academicInfo, $employmentInfo);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'career' => $basicInfo ? $basicInfo->career : 'No especificado',
                'gender' => $basicInfo ? $basicInfo->gender : 'No especificado',
                'city' => $basicInfo ? $basicInfo->city : 'No especificado',
                'department' => $basicInfo ? $basicInfo->department : 'No especificado',
                'graduation_date' => $basicInfo ? $basicInfo->graduation_date : null,
                'profile_completion' => $profileCompletion,
                'additional_info' => $basicInfo ? $basicInfo->additional_info : null,
                'has_basic_info' => $basicInfo ? true : false,
                'has_academic_info' => $academicInfo && $academicInfo->count() > 0,
                'has_employment_info' => $employmentInfo && $employmentInfo->count() > 0,
            ];
        });
    }

    private function calculateProfileCompletion($basicInfo, $academicInfo, $employmentInfo)
    {
        $total = 0;
        $completed = 0;

        // Información básica (33%)
        $total += 33;
        if ($basicInfo) {
            $completed += 33;
        }

        // Información académica (33%)
        $total += 33;
        if ($academicInfo && $academicInfo->count() > 0) {
            $completed += 33;
        }

        // Información laboral (34%)
        $total += 34;
        if ($employmentInfo && $employmentInfo->count() > 0) {
            $completed += 34;
        }

        return $total > 0 ? round(($completed / $total) * 100) : 0;
    }

    private function generateStats($graduates)
    {
        // Total de egresados
        $totalGraduates = $graduates->count();

        // Egresados registrados recientemente (últimos 30 días)
        $recentlyRegistered = User::where('role', 'Egresado')
                                ->where('created_at', '>=', now()->subDays(30))
                                ->count();

        // Egresados con empleo
        $withEmployment = $graduates->filter(function($graduate) {
            return $graduate['has_employment_info'];
        })->count();

        // Egresados con educación superior - SOLUCIÓN DIRECTA CORREGIDA
        $withHigherEducation = 0;
        $graduateIds = $graduates->pluck('id')->toArray();
        
        // Primero registrar qué niveles existen realmente en la base de datos para depuración
        $allLevels = AcademicInformation::whereIn('user_id', $graduateIds)
            ->whereNotNull('level')
            ->select('level')
            ->distinct()
            ->pluck('level')
            ->toArray();
            
        Log::info('Niveles académicos existentes en la base de datos:', ['levels' => $allLevels]);
        
        // Luego contar los usuarios con educación superior (uno por uno para más claridad)
        foreach ($graduateIds as $userId) {
            $hasHigherEd = AcademicInformation::where('user_id', $userId)
                ->where(function($query) {
                    $query->where('level', 'especialización')
                        ->orWhere('level', 'maestría')
                        ->orWhere('level', 'doctorado')
                        ->orWhere('level', 'especializacion')
                        ->orWhere('level', 'maestria')
                        ->orWhere('level', 'educación superior');
                })
                ->exists();
                
            if ($hasHigherEd) {
                $withHigherEducation++;
                
                // Registrar para depuración
                $userAcademicInfo = AcademicInformation::where('user_id', $userId)
                    ->select('level', 'program_name')
                    ->get();
                    
                Log::info("Usuario $userId tiene educación superior", [
                    'academic_info' => $userAcademicInfo->toArray()
                ]);
            }
        }

        // Egresados con perfiles completos
        $withCompleteProfiles = $graduates->filter(function($graduate) {
            return $graduate['profile_completion'] >= 90;
        })->count();

        // Ciudad más popular
        $cities = $graduates->pluck('city')->filter()->countBy();
        $mostPopularCity = $cities->count() > 0 ? $cities->sortDesc()->keys()->first() : 'No disponible';

        // Carrera más común
        $careers = $graduates->pluck('career')->filter()->countBy();
        $mostPopularCareer = $careers->count() > 0 ? $careers->sortDesc()->keys()->first() : 'No disponible';

        return [
            'totalGraduates' => $totalGraduates,
            'recentlyRegistered' => $recentlyRegistered,
            'withEmployment' => $withEmployment,
            'withHigherEducation' => $withHigherEducation,
            'withCompleteProfiles' => $withCompleteProfiles,
            'mostPopularCity' => $mostPopularCity,
            'mostPopularCareer' => $mostPopularCareer,
        ];
    }

    private function generateGenderDistribution($graduates)
    {
        $genders = $graduates->pluck('gender')->countBy();

        $distribution = [];
        
        // Asignar colores específicos para cada género
        if ($genders->has('Masculino')) {
            $distribution[] = [
                'name' => 'Masculino',
                'value' => $genders['Masculino'],
                'color' => '#3f80ea'
            ];
        }
        
        if ($genders->has('Femenino')) {
            $distribution[] = [
                'name' => 'Femenino',
                'value' => $genders['Femenino'],
                'color' => '#e83e8c'
            ];
        }
        
        // Agrupar todos los demás valores como "No especificado"
        $otherCount = $genders->filter(function($value, $key) {
            return !in_array($key, ['Masculino', 'Femenino']) || $key === 'No especificar' || !$key;
        })->sum();
        
        if ($otherCount > 0) {
            $distribution[] = [
                'name' => 'No especificado',
                'value' => $otherCount,
                'color' => '#6c757d'
            ];
        }

        return $distribution;
    }

    private function generateLocationDistribution($graduates)
    {
        // Agrupar por ciudades
        $cities = $graduates->pluck('city')->filter()->countBy();
        
        // Formatear para el frontend y ordenar por cantidad descendente
        $distribution = $cities->map(function($count, $city) {
            return [
                'name' => $city ?: 'No especificado',
                'value' => $count
            ];
        })->sortByDesc('value')->values()->all();

        return $distribution;
    }

    private function generateAcademicDistribution($graduates)
    {
        try {
            // Obtener distribución académica
            $distribution = DB::table('academic_information')
                ->join('users', 'academic_information.user_id', '=', 'users.id')
                ->where('users.role', 'Egresado')
                ->where('academic_information.type', 'formal')
                ->select(
                    DB::raw('COALESCE(custom_institution, institution) as institution'),
                    DB::raw('COALESCE(custom_program_name, program_name) as career'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy(
                    DB::raw('COALESCE(custom_institution, institution)'),
                    DB::raw('COALESCE(custom_program_name, program_name)')
                )
                ->orderByDesc('count')
                ->get();
            
            // Convertir a array para evitar problemas en la vista
            return $distribution->toArray();
        } catch (\Exception $e) {
            Log::error('Error en generateAcademicDistribution: ' . $e->getMessage());
            return [];
        }
    }

    private function generateGraduationYearDistribution($graduates)
    {
        // Agrupar por año de graduación
        $years = $graduates->filter(function($graduate) {
            return !empty($graduate['graduation_date']);
        })->map(function($graduate) {
            return [
                'year' => substr($graduate['graduation_date'], 0, 4)
            ];
        })->pluck('year')->countBy();
        
        // Formatear para el frontend
        $distribution = $years->map(function($count, $year) {
            return [
                'year' => $year,
                'count' => $count
            ];
        })->sortBy('year')->values()->all();

        return $distribution;
    }

    private function generateAcademicLevelDistribution($graduates)
    {
        // Obtener distribución de niveles académicos
        $levels = AcademicInformation::where('type', 'formal')
            ->whereNotNull('level')
            ->whereIn('user_id', $graduates->pluck('id'))
            ->select('level', DB::raw('count(*) as count'))
            ->groupBy('level')
            ->get();
        
        // Asignar colores para cada nivel
        $colors = [
            'pregrado' => '#3f80ea',
            'especialización' => '#4caf50',
            'maestría' => '#ff9800',
            'doctorado' => '#e83e8c',
        ];
        
        // Formatear para el frontend y convertir a array
        $distribution = $levels->map(function($level) use ($colors) {
            return [
                'level' => $level->level,
                'count' => $level->count,
                'color' => $colors[$level->level] ?? '#6c757d'
            ];
        })->sortByDesc('count')->values()->all();

        return $distribution;
    }

    private function generateContactStatusDistribution($graduates)
    {
        // Determinar el estado de contacto de cada egresado
        $contactStatuses = [
            'Actualizado' => $graduates->filter(function($graduate) {
                return $graduate['profile_completion'] >= 70;
            })->count(),
            'Parcial' => $graduates->filter(function($graduate) {
                return $graduate['profile_completion'] >= 30 && $graduate['profile_completion'] < 70;
            })->count(),
            'Desactualizado' => $graduates->filter(function($graduate) {
                return $graduate['profile_completion'] < 30;
            })->count(),
        ];
        
        // Asignar colores
        $colors = [
            'Actualizado' => '#4caf50',
            'Parcial' => '#ff9800',
            'Desactualizado' => '#f44336',
        ];
        
        // Formatear para el frontend
        $distribution = collect($contactStatuses)->map(function($count, $status) use ($colors) {
            return [
                'status' => $status,
                'count' => $count,
                'color' => $colors[$status]
            ];
        })->values()->all();

        return $distribution;
    }

    private function generateProfileCompletionDistribution($graduates)
    {
        // Agrupar por rangos de progreso
        $ranges = [
            '0-25%' => $graduates->filter(function($graduate) {
                return $graduate['profile_completion'] < 25;
            })->count(),
            '26-50%' => $graduates->filter(function($graduate) {
                return $graduate['profile_completion'] >= 25 && $graduate['profile_completion'] < 50;
            })->count(),
            '51-75%' => $graduates->filter(function($graduate) {
                return $graduate['profile_completion'] >= 50 && $graduate['profile_completion'] < 75;
            })->count(),
            '76-100%' => $graduates->filter(function($graduate) {
                return $graduate['profile_completion'] >= 75;
            })->count(),
        ];
        
        // Asignar colores
        $colors = [
            '0-25%' => '#f44336',
            '26-50%' => '#ff9800',
            '51-75%' => '#2196f3',
            '76-100%' => '#4caf50',
        ];
        
        // Formatear para el frontend
        $distribution = collect($ranges)->map(function($count, $range) use ($colors) {
            return [
                'range' => $range,
                'count' => $count,
                'color' => $colors[$range]
            ];
        })->values()->all();

        return $distribution;
    }

    private function generateEmploymentSectorDistribution()
    {
        try {
            // Obtener sectores de empleo
            $sectors = EmploymentInformation::whereNotNull('company_type')
                ->select('company_type as sector', DB::raw('count(*) as count'))
                ->groupBy('company_type')
                ->orderByDesc('count')
                ->get();
            
            // Convertir a array para evitar problemas en la vista
            return $sectors->toArray();
        } catch (\Exception $e) {
            Log::error('Error en generateEmploymentSectorDistribution: ' . $e->getMessage());
            return [];
        }
    }

    private function generateSkillsDistribution()
    {
        try {
            // Habilidades blandas
            $softSkills = EmploymentInformation::whereNotNull('soft_skills')
                ->get()
                ->flatMap(function($employment) {
                    return $employment->soft_skills;
                })
                ->countBy()
                ->map(function($count, $skill) {
                    return [
                        'name' => $skill,
                        'count' => $count
                    ];
                })
                ->sortByDesc('count')
                ->values()
                ->all();
            
            // Habilidades técnicas
            $hardSkills = EmploymentInformation::whereNotNull('hard_skills')
                ->get()
                ->flatMap(function($employment) {
                    return $employment->hard_skills;
                })
                ->countBy()
                ->map(function($count, $skill) {
                    return [
                        'name' => $skill,
                        'count' => $count
                    ];
                })
                ->sortByDesc('count')
                ->values()
                ->all();
            
            return [
                'softSkills' => $softSkills,
                'hardSkills' => $hardSkills
            ];
        } catch (\Exception $e) {
            Log::error('Error en generateSkillsDistribution: ' . $e->getMessage());
            return [
                'softSkills' => [],
                'hardSkills' => []
            ];
        }
    }

    private function generateTopEmployers()
    {
        try {
            // Obtener las empresas que más contratan
            $employers = EmploymentInformation::select('company_name as company', DB::raw('count(*) as count'))
                ->whereNotNull('company_name')
                ->groupBy('company_name')
                ->orderByDesc('count')
                ->limit(10)
                ->get();
            
            // Convertir a array para evitar problemas en la vista
            return $employers->toArray();
        } catch (\Exception $e) {
            Log::error('Error en generateTopEmployers: ' . $e->getMessage());
            return [];
        }
    }

    private function getFilterOptions()
    {
        try {
            // Obtener opciones para filtros
            return [
                'institutions' => AcademicInformation::select('institution')
                    ->whereNotNull('institution')
                    ->distinct()
                    ->pluck('institution')
                    ->merge(AcademicInformation::select('custom_institution')
                        ->whereNotNull('custom_institution')
                        ->distinct()
                        ->pluck('custom_institution'))
                    ->unique()
                    ->sort()
                    ->values()
                    ->all(),
                
                'careers' => BasicInformation::select('career')
                    ->whereNotNull('career')
                    ->distinct()
                    ->pluck('career')
                    ->sort()
                    ->values()
                    ->all(),
                
                'cities' => BasicInformation::select('city')
                    ->whereNotNull('city')
                    ->distinct()
                    ->pluck('city')
                    ->sort()
                    ->values()
                    ->all(),
                
                'departments' => BasicInformation::select('department')
                    ->whereNotNull('department')
                    ->distinct()
                    ->pluck('department')
                    ->sort()
                    ->values()
                    ->all(),
                
                'years' => BasicInformation::whereNotNull('graduation_date')
                    ->select(DB::raw('YEAR(graduation_date) as year'))
                    ->distinct()
                    ->pluck('year')
                    ->sort()
                    ->values()
                    ->all(),
            ];
        } catch (\Exception $e) {
            Log::error('Error en getFilterOptions: ' . $e->getMessage());
            return [
                'institutions' => [],
                'careers' => [],
                'cities' => [],
                'departments' => [],
                'years' => [],
            ];
        }
    }
}