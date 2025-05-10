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
        .bar-chart { width: 100%; margin-bottom: 30px; }
        .bar-container { margin-bottom: 10px; display: flex; align-items: center; }
        .bar-label { width: 20%; padding-right: 10px; text-align: right; }
        .bar-outer { width: 60%; background-color: #f1f1f1; border-radius: 4px; }
        .bar-inner { height: 20px; background-color: #4CAF50; border-radius: 4px; }
        .bar-value { width: 20%; padding-left: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <h2>Distribución por Ubicación</h2>
    <p>Este reporte muestra la distribución de egresados por ciudad o ubicación geográfica.</p>

    <div class="bar-chart">
        @php
            $maxValue = $locationDistribution ? max(array_column($locationDistribution, 'value')) : 0;
        @endphp
        
        @foreach($locationDistribution as $location)
            <div class="bar-container">
                <div class="bar-label">{{ $location['name'] }}</div>
                <div class="bar-outer">
                    <div class="bar-inner" style="width: {{ ($location['value'] / $maxValue) * 100 }}%;"></div>
                </div>
                <div class="bar-value">{{ $location['value'] }} ({{ round(($location['value'] / array_sum(array_column($locationDistribution, 'value'))) * 100, 1) }}%)</div>
            </div>
        @endforeach
    </div>

    <table>
        <thead>
            <tr>
                <th>Ciudad/Ubicación</th>
                <th>Cantidad de Egresados</th>
                <th>Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @foreach($locationDistribution as $location)
            <tr>
                <td>{{ $location['name'] }}</td>
                <td>{{ $location['value'] }}</td>
                <td>{{ round(($location['value'] / array_sum(array_column($locationDistribution, 'value'))) * 100, 1) }}%</td>
            </tr>
            @endforeach
            <tr style="font-weight: bold;">
                <td>Total</td>
                <td>{{ array_sum(array_column($locationDistribution, 'value')) }}</td>
                <td>100%</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>