<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class RoleAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Rutas específicas que requieren redireccionamiento a login
        $restrictedPaths = ['Administrador', 'Coordinador'];
        
        // Obtener la ruta actual
        $path = $request->path();

        // Verificar si la ruta coincide exactamente con Administrador o Coordinador
        if (in_array($path, $restrictedPaths)) {
            return Redirect::route('login');
        }

        // Si está autenticado, manejar restricciones de roles
        if (Auth::check()) {
            $userRole = Auth::user()->role;

            // Restricción para /users
            if ($path === 'users' && $userRole !== 'Administrador') {
                return Inertia::render('AccessDenied', [
                    'message' => 'Solo Administradores pueden acceder a esta sección.'
                ]);
            }

            // Restricción para /news
            if ($path === 'news' && $userRole !== 'Coordinador') {
                return Inertia::render('AccessDenied', [
                    'message' => 'Solo Coordinadores pueden acceder a esta sección.'
                ]);
            }
        }

        return $next($request);
    }
}