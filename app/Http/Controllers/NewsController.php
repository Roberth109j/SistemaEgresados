<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index(): Response
    {
        $news = News::select('id', 'title', 'content', 'image', 'user_id', 'created_at')
            ->with('user:id,name,email') // Añadido para cargar la información del usuario
            ->orderBy('id', 'desc') // Cambié a desc para mostrar las más recientes primero
            ->paginate(10);
       
        return Inertia::render('news', [
            'news' => $news,
        ]);
    }

    /**
     * Almacena una nueva noticia en la base de datos.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = $request->file('image')
            ? $request->file('image')->store('news', 'public')
            : null;

        $news = News::create([
            'title' => $request->title,
            'content' => $request->content,
            'image' => $imagePath ? "/storage/$imagePath" : null,
            'user_id' => Auth::id(),
        ]);

        return response()->json($news, 201);
    }

    /**
     * Muestra una noticia específica.
     */
    public function show($id)
    {
        $news = News::with('user')->findOrFail($id);
        return response()->json($news);
    }
    
    /**
     * Retorna todas las noticias para el dashboard.
     */
    public function getAll()
    {
        $news = News::with('user:id,name')
            ->select('id', 'title', 'content', 'image', 'user_id', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($news);
    }

    /**
     * Actualiza una noticia específica en la base de datos.
     */
    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);
        
        // Verificar si el usuario autenticado es el propietario de la noticia
        if ($news->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Procesar la imagen si se proporciona una nueva
        if ($request->hasFile('image')) {
            // Eliminar la imagen anterior si existe
            if ($news->image && Storage::disk('public')->exists(str_replace('/storage/', '', $news->image))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $news->image));
            }

            $imagePath = $request->file('image')->store('news', 'public');
            $news->image = "/storage/$imagePath";
        }

        $news->title = $request->title;
        $news->content = $request->content;
        $news->save();

        return response()->json($news);
    }

    /**
     * Elimina una noticia específica de la base de datos.
     */
    public function destroy($id)
    {
        $news = News::findOrFail($id);
        
        // Verificar si el usuario autenticado es el propietario de la noticia
        if ($news->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Eliminar la imagen si existe
        if ($news->image && Storage::disk('public')->exists(str_replace('/storage/', '', $news->image))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $news->image));
        }

        $news->delete();

        return response()->json(['message' => 'Noticia eliminada correctamente']);
    }
}