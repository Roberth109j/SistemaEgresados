<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte: {{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; }
        .progress-container { margin-bottom: 20px; }
        .progress-bar { height: 25px; border-radius: 4px; margin-bottom: 5px; position: relative; }
        .progress-text { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
        .progress-label { display: flex; justify-content: space-between; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <h2>Progreso en Completitud de Perfiles</h2>
    <p>Este reporte muestra la distribución de egresados según el nivel de completitud de sus perfiles en el sistema.</p>

    <div class="progress-container">
        @php
            $totalCount = array_sum(array_column($profileCompletionDistribution, 'count'));
        @endphp
        
        @foreach($profileCompletionDistribution as $item)
            <h3>{{ $item['range'] }}</h3>
            <div class="progress-bar" style="background-color: {{ $item['color'] }}; width: {{ ($item['count'] / $totalCount) * 100 }}%">
                <div class="progress-text">{{ $item['count'] }} ({{ round(($item['count'] / $totalCount) * 100, 1) }}%)</div>
            </div>
            <div class="progress-label">
                <span>{{ $item['count'] }} egresados</span>
                <span>{{ round(($item['count'] / $totalCount) * 100, 1) }}% del total</span>
            </div>
        @endforeach
    </div>

    <table>
        <thead>
            <tr>
                <th>Rango de Completitud</th>
                <th>Cantidad de Egresados</th>
                <th>Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @foreach($profileCompletionDistribution as $item)
            <tr>
                <td>{{ $item['range'] }}</td>
                <td>{{ $item['count'] }}</td>
                <td>{{ round(($item['count'] / $totalCount) * 100, 1) }}%</td>
            </tr>
            @endforeach
            <tr style="font-weight: bold;">
                <td>Total</td>
                <td>{{ $totalCount }}</td>
                <td>100%</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>