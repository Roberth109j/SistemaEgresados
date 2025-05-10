<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;
use App\Http\Middleware\RoleAccessMiddleware;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(Registered::class, function ($event) {
            $user = $event->user;
            if ($user->role !== 'Administrador' && $user->role !== 'Coordinador') {
                $user->assignRole('Egresado');
                $user->update(['role' => 'Egresado']);
            }
        });

        $this->app['router']->aliasMiddleware('role', RoleAccessMiddleware::class);
    }
}
