<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\BasicInformationController;
use App\Http\Controllers\AcademicInformationController;
use App\Http\Controllers\EmploymentInformationController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\RoleAccessMiddleware;
use Illuminate\Support\Facades\Redirect;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\GraduateReportsController;

// Redirigir rutas de Administrador y Coordinador directamente al login
Route::get('Administrador', function () {
    return Redirect::route('login');
});

Route::get('Coordinador', function () {
    return Redirect::route('login');
});

// Ruta principal con middleware de acceso por rol
Route::middleware(RoleAccessMiddleware::class)->group(function () {
    Route::get('/', function () {
        return Inertia::render('welcome');
    })->name('home');
});

// Grupo de rutas autenticadas
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', function () {
        // Pasar la bandera isCoordinator directamente al componente
        $user = auth()->user();
        return Inertia::render('dashboard', [
            'userName' => $user->name,
            'isCoordinator' => $user->role === 'Coordinador' // Ajusta según tu nomenclatura de roles
        ]);
    })->name('dashboard');

    // Ruta para información básica
    Route::get('basicInformation', [BasicInformationController::class, 'index'])->name('basicInformation');
    Route::post('basicInformation', [BasicInformationController::class, 'store'])->name('basicInformation.store');
    
    // Rutas para el perfil de administrador/coordinador (NUEVAS RUTAS)
    Route::get('myProfile', [ProfileController::class, 'index'])->name('myProfile');
    Route::post('myProfile', [ProfileController::class, 'store'])->name('myProfile.store');
    
    // Rutas para información académica
    Route::get('academicInformation', [AcademicInformationController::class, 'index'])->name('academicInformation');
    Route::post('academicInformation', [AcademicInformationController::class, 'store'])->name('academicInformation.store');
    Route::put('academicInformation/{id}', [AcademicInformationController::class, 'update'])->name('academicInformation.update');
    Route::delete('academicInformation/{id}', [AcademicInformationController::class, 'destroy'])->name('academicInformation.destroy');
    Route::post('academicInformation/destroyMultiple', [AcademicInformationController::class, 'destroyMultiple'])->name('academicInformation.destroyMultiple');
    Route::get('academicInformation/certificate/{id}', [AcademicInformationController::class, 'downloadCertificate'])->name('academicInformation.certificate');
    
    // Rutas para informacion laboral
    Route::get('employmentInformation', [EmploymentInformationController::class, 'index'])->name('employmentInformation');
    Route::post('employmentInformation', [EmploymentInformationController::class, 'store'])->name('employmentInformation.store');
    Route::put('employmentInformation/{id}', [EmploymentInformationController::class, 'update'])->name('employmentInformation.update');
    Route::delete('employmentInformation/{id}', [EmploymentInformationController::class, 'destroy'])->name('employmentInformation.destroy');
    Route::post('employmentInformation/destroyMultiple', [EmploymentInformationController::class, 'destroyMultiple'])->name('employmentInformation.destroyMultiple');

    // Rutas de usuarios
    Route::group(['prefix' => 'users', 'as' => 'users.'], function () {
        Route::get('/', [UsersController::class, 'index'])->name('index');
        Route::post('/', [UsersController::class, 'store'])->name('store');
        Route::put('/{user}', [UsersController::class, 'update'])->name('update');
        Route::delete('/{user}', [UsersController::class, 'destroy'])->name('destroy');
    });
    
    // Rutas de noticias
    Route::group(['prefix' => 'news', 'as' => 'news.'], function () {
        Route::get('/', [NewsController::class, 'index'])->name('index');
        Route::post('/', [NewsController::class, 'store'])->name('store');
        Route::put('/{id}', [NewsController::class, 'update'])->name('update');
        Route::delete('/{id}', [NewsController::class, 'destroy'])->name('destroy');
    });

    // Rutas para reportes de egresados (sin middleware específico aquí)
    // El control de acceso se maneja en el RoleAccessMiddleware
    Route::get('/graduateReports', [GraduateReportsController::class, 'index'])->name('graduateReports');
    Route::get('/graduateReports/export', [GraduateReportsController::class, 'export'])->name('graduateReports.export');

    // INICIO - RUTAS PARA EL SISTEMA DE UBICACIONES
    
    // Ruta para guardar la ubicación (solo para egresados)
    // El control de acceso se maneja en el RoleAccessMiddleware
    Route::post('/location', [LocationController::class, 'store'])->name('location.store');
    
    // Ruta para obtener la ubicación del usuario actual
    Route::get('/user/location', [LocationController::class, 'getUserLocation'])->name('user.location');
    
    // Ruta para obtener todas las ubicaciones (solo para coordinadores)
    // El control de acceso se maneja en el RoleAccessMiddleware
    Route::get('/locations', [LocationController::class, 'index'])->name('locations.index');

    // Ruta para la vista del mapa (solo para coordinadores)
    // El control de acceso se maneja en el RoleAccessMiddleware
    Route::get('/map', function () {
        return Inertia::render('MapView');
    })->name('map');
    
    // FIN - RUTAS PARA EL SISTEMA DE UBICACIONES
    
    // Rutas API
    Route::prefix('api')->group(function () {
        Route::get('news', [NewsController::class, 'getAll']);
        Route::get('news/{id}', [NewsController::class, 'show']);
        Route::get('academicInformation', [AcademicInformationController::class, 'getAll']);
        
        // API para ubicaciones
        Route::get('locations', [LocationController::class, 'getLocationsApi']);
    });
    
    // Ruta de prueba simple para depuración
    Route::get('/test-report', function() {
        return 'Prueba de ruta correcta - Si puedes ver esto, las rutas funcionan';
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';