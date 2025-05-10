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
        .level-box { padding: 15px; margin: 10px; display: inline-block; border-radius: 5px; width: 40%; }
        .level-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .level-count { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .level-percent { font-size: 14px; color: #555; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <h2>Niveles Académicos Alcanzados</h2>
    <p>Este reporte muestra la distribución de egresados según los niveles académicos que han alcanzado.</p>

    <div style="text-align: center; margin-bottom: 30px;">
        @php
            $totalCount = array_sum(array_column($academicLevelDistribution, 'count'));
        @endphp
        
        @foreach($academicLevelDistribution as $level)
            <div class="level-box" style="background-color: {{ str_replace('#', 'rgba(', $level['color']) }}0.2);">
                <div class="level-title">{{ ucfirst($level['level']) }}</div>
                <div class="level-count">{{ $level['count'] }}</div>
                <div class="level-percent">
                    {{ round(($level['count'] / $totalCount) * 100, 1) }}% del total
                </div>
            </div>
        @endforeach
    </div>

    <table>
        <thead>
            <tr>
                <th>Nivel Académico</th>
                <th>Cantidad de Egresados</th>
                <th>Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @foreach($academicLevelDistribution as $level)
            <tr>
                <td>{{ ucfirst($level['level']) }}</td>
                <td>{{ $level['count'] }}</td>
                <td>{{ round(($level['count'] / $totalCount) * 100, 1) }}%</td>
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