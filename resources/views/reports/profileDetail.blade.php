<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte: {{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 16px; }
        .header { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .footer { margin-top: 20px; text-align: center; font-size: 14px; }
        .progress-cell { width: 120px; }
        .progress-bar { 
            height: 18px; 
            background-color: #f1f1f1; 
            border-radius: 9px; 
            overflow: hidden;
            margin-bottom: 5px;
        }
        .progress-fill { 
            height: 100%; 
            float: left; 
            text-align: center;
            color: white;
            font-size: 12px;
            line-height: 18px;
            font-weight: bold;
        }
        .low { background-color: #f44336; }
        .medium { background-color: #ff9800; }
        .high { background-color: #4caf50; }
        .status-complete { color: #4caf50; font-weight: bold; font-size: 14px; }
        .status-incomplete { color: #f44336; font-weight: bold; font-size: 14px; }
        h1 { font-size: 24px; color: #333; }
        h2 { font-size: 20px; color: #333; }
        h3 { font-size: 18px; color: #333; }
        @page { margin: 1.5cm; size: landscape; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <h2>Detalle de Completitud de Perfiles</h2>
    <p>Este reporte muestra el nivel de completitud de perfiles para cada egresado.</p>

    @if(isset($graduates) && $graduates->count() > 0)
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Correo Electrónico</th>
                    <th>Información Básica</th>
                    <th>Información Académica</th>
                    <th>Información Laboral</th>
                    <th>Progreso Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($graduates->sortBy('profile_completion') as $graduate)
                <tr>
                    <td>{{ $graduate['name'] }}</td>
                    <td>{{ $graduate['email'] }}</td>
                    <td class="text-center">
                        <span class="{{ $graduate['has_basic_info'] ? 'status-complete' : 'status-incomplete' }}">
                            {{ $graduate['has_basic_info'] ? 'Completo' : 'Incompleto' }}
                        </span>
                    </td>
                    <td class="text-center">
                        <span class="{{ $graduate['has_academic_info'] ? 'status-complete' : 'status-incomplete' }}">
                            {{ $graduate['has_academic_info'] ? 'Completo' : 'Incompleto' }}
                        </span>
                    </td>
                    <td class="text-center">
                        <span class="{{ $graduate['has_employment_info'] ? 'status-complete' : 'status-incomplete' }}">
                            {{ $graduate['has_employment_info'] ? 'Completo' : 'Incompleto' }}
                        </span>
                    </td>
                    <td class="progress-cell">
                        <div class="progress-bar">
                            <div class="progress-fill {{ $graduate['profile_completion'] < 33 ? 'low' : ($graduate['profile_completion'] < 66 ? 'medium' : 'high') }}" 
                                style="width: {{ $graduate['profile_completion'] }}%;">
                                {{ $graduate['profile_completion'] }}%
                            </div>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        @php
            $completionSummary = [
                'completo' => $graduates->filter(function($g) { return $g['profile_completion'] >= 90; })->count(),
                'alto' => $graduates->filter(function($g) { return $g['profile_completion'] >= 70 && $g['profile_completion'] < 90; })->count(),
                'medio' => $graduates->filter(function($g) { return $g['profile_completion'] >= 40 && $g['profile_completion'] < 70; })->count(),
                'bajo' => $graduates->filter(function($g) { return $g['profile_completion'] < 40; })->count(),
            ];
        @endphp

        <h3>Resumen de Completitud</h3>
        <table>
            <thead>
                <tr>
                    <th>Nivel de Completitud</th>
                    <th>Cantidad de Egresados</th>
                    <th>Porcentaje</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Completo (90-100%)</td>
                    <td>{{ $completionSummary['completo'] }}</td>
                    <td>{{ round(($completionSummary['completo'] / $graduates->count()) * 100, 1) }}%</td>
                </tr>
                <tr>
                    <td>Alto (70-89%)</td>
                    <td>{{ $completionSummary['alto'] }}</td>
                    <td>{{ round(($completionSummary['alto'] / $graduates->count()) * 100, 1) }}%</td>
                </tr>
                <tr>
                    <td>Medio (40-69%)</td>
                    <td>{{ $completionSummary['medio'] }}</td>
                    <td>{{ round(($completionSummary['medio'] / $graduates->count()) * 100, 1) }}%</td>
                </tr>
                <tr>
                    <td>Bajo (0-39%)</td>
                    <td>{{ $completionSummary['bajo'] }}</td>
                    <td>{{ round(($completionSummary['bajo'] / $graduates->count()) * 100, 1) }}%</td>
                </tr>
            </tbody>
        </table>
    @else
        <p style="text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px; font-size: 16px;">
            No hay datos de egresados disponibles.
        </p>
    @endif

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>