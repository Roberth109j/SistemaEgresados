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
        .summary { margin-bottom: 20px; }
        .subtitle { font-size: 16px; font-weight: bold; color: #333; margin: 20px 0 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <div class="summary">
        <h2>Distribución Académica</h2>
        <p>Este reporte muestra la distribución de egresados por institución y carrera académica.</p>
    </div>

    <div class="subtitle">Distribución por Institución y Programa Académico</div>
    <table>
        <thead>
            <tr>
                <th>Institución</th>
                <th>Carrera / Programa</th>
                <th>Egresados</th>
                <th>Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalEgresados = array_sum(array_column($academicDistribution, 'count'));
            @endphp
            
            @foreach($academicDistribution as $item)
            <tr>
                <td>{{ $item->institution }}</td>
                <td>{{ $item->career }}</td>
                <td>{{ $item->count }}</td>
                <td>{{ round(($item->count / $totalEgresados) * 100, 1) }}%</td>
            </tr>
            @endforeach
            <tr style="font-weight: bold;">
                <td colspan="2">Total</td>
                <td>{{ $totalEgresados }}</td>
                <td>100%</td>
            </tr>
        </tbody>
    </table>

    @php
        $institutionSummary = collect($academicDistribution)->groupBy('institution')->map(function ($items) {
            return $items->sum('count');
        })->sortByDesc(function ($count) {
            return $count;
        });
    @endphp

    <div class="subtitle">Resumen por Institución</div>
    <table>
        <thead>
            <tr>
                <th>Institución</th>
                <th>Cantidad de Egresados</th>
                <th>Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @foreach($institutionSummary as $institution => $count)
            <tr>
                <td>{{ $institution }}</td>
                <td>{{ $count }}</td>
                <td>{{ round(($count / $totalEgresados) * 100, 1) }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>