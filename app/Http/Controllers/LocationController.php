<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Mostrar todas las ubicaciones (solo para coordinadores)
     * La protección de ruta se hace en web.php
     */
    public function index(): JsonResponse
    {
        $locations = Location::with('user:id,name,email')->get();

        return response()->json([
            'locations' => $locations
        ]);
    }

    /**
     * API endpoint para obtener ubicaciones (formato diferente si es necesario)
     */
    public function getLocationsApi(): JsonResponse
    {
        $locations = Location::with('user:id,name,email')->get();

        return response()->json([
            'success' => true,
            'data' => $locations
        ]);
    }

    /**
     * Guardar la ubicación del usuario actual (solo para egresados)
     * La protección de ruta se hace en web.php
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'address' => 'nullable|string',
        ]);

        // Añadir el ID del usuario actual
        $data = array_merge($validated, ['user_id' => auth()->id()]);

        // Actualizar o crear un nuevo registro
        $location = Location::updateOrCreate(
            ['user_id' => auth()->id()],
            $data
        );

        return response()->json([
            'success' => true,
            'message' => 'Ubicación guardada exitosamente',
            'location' => $location
        ], 201);
    }

    /**
     * Obtener la ubicación del usuario actual
     */
    public function getUserLocation(): JsonResponse
    {
        $location = Location::where('user_id', auth()->id())->first();

        return response()->json([
            'success' => true,
            'location' => $location
        ]);
    }
}