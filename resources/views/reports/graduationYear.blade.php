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
        .bar-chart { width: 100%; margin-top: 20px; margin-bottom: 30px; }
        .bar-container { margin-bottom: 10px; display: flex; align-items: center; }
        .bar-label { width: 15%; padding-right: 10px; text-align: right; }
        .bar-outer { width: 65%; background-color: #f1f1f1; border-radius: 4px; }
        .bar-inner { height: 20px; background-color: #3f80ea; border-radius: 4px; }
        .bar-value { width: 20%; padding-left: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <h2>Distribución por Año de Graduación</h2>
    <p>Este reporte muestra la distribución de egresados según su año de graduación.</p>

    <div class="bar-chart">
        @php
            $maxValue = $graduationYearDistribution ? max(array_column($graduationYearDistribution, 'count')) : 0;
            $totalGraduates = array_sum(array_column($graduationYearDistribution, 'count'));
        @endphp
        
        @foreach($graduationYearDistribution as $item)
            <div class="bar-container">
                <div class="bar-label">{{ $item['year'] }}</div>
                <div class="bar-outer">
                    <div class="bar-inner" style="width: {{ ($item['count'] / $maxValue) * 100 }}%;"></div>
                </div>
                <div class="bar-value">{{ $item['count'] }} ({{ round(($item['count'] / $totalGraduates) * 100, 1) }}%)</div>
            </div>
        @endforeach
    </div>

    <table>
        <thead>
            <tr>
                <th>Año de Graduación</th>
                <th>Cantidad de Egresados</th>
                <th>Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @foreach($graduationYearDistribution as $item)
            <tr>
                <td>{{ $item['year'] }}</td>
                <td>{{ $item['count'] }}</td>
                <td>{{ round(($item['count'] / $totalGraduates) * 100, 1) }}%</td>
            </tr>
            @endforeach
            <tr style="font-weight: bold;">
                <td>Total</td>
                <td>{{ $totalGraduates }}</td>
                <td>100%</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>