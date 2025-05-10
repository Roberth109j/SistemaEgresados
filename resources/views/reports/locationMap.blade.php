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
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 15px; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 14px; }
        .location-visual { margin-bottom: 20px; }
        .location-name { margin-bottom: 5px; font-weight: bold; font-size: 17px; }
        .graph-bar { 
            height: 30px; 
            background-color: #f1f1f1; 
            margin: 5px 0; 
            border-radius: 4px; 
            position: relative; 
            overflow: hidden;
        }
        .graph-fill {
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background-color: #3f80ea;
            border-radius: 4px;
            color: white;
            text-align: right;
            padding-right: 10px;
            font-weight: bold;
            font-size: 15px;
            line-height: 30px;
            white-space: nowrap;
        }
        .section { margin-bottom: 30px; }
        .subtitle { font-size: 18px; font-weight: bold; margin: 20px 0 15px 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h1 { font-size: 24px; color: #333; }
        h2 { font-size: 20px; color: #333; }
        @page { margin: 1.5cm; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <div class="section">
        <h2>Distribución Geográfica de Egresados</h2>
        <p>Este reporte muestra la distribución geográfica de los egresados registrados en el sistema.</p>
        
        @if(isset($graduates) && $graduates->count() > 0)
            <!-- Visualización alternativa para PDF con barras gráficas -->
            <div class="subtitle">Distribución por Departamentos</div>
            @php
                $departmentDistribution = collect($graduates)
                    ->groupBy('department')
                    ->map(function ($items, $key) {
                        return [
                            'name' => $key ?: 'No especificado',
                            'count' => count($items)
                        ];
                    })
                    ->sortByDesc('count')
                    ->values()
                    ->all();
                    
                $totalCount = array_sum(array_column($departmentDistribution, 'count'));
                $colors = ['#3f80ea', '#4caf50', '#ff9800', '#e83e8c', '#6f42c1', '#20c997'];
            @endphp
            
            @foreach($departmentDistribution as $index => $dept)
                <div class="location-visual">
                    <div class="location-name">
                        {{ $dept['name'] }}
                    </div>
                    <div class="graph-bar">
                        @php
                            $percentage = ($dept['count'] / $totalCount) * 100;
                            $color = $colors[$index % count($colors)];
                        @endphp
                        <div class="graph-fill" style="width: {{ $percentage }}%; background-color: {{ $color }};">
                            {{ $dept['count'] }} ({{ round($percentage, 1) }}%)
                        </div>
                    </div>
                </div>
            @endforeach
            
            <table>
                <thead>
                    <tr>
                        <th>Departamento</th>
                        <th>Cantidad de Egresados</th>
                        <th>Porcentaje</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($departmentDistribution as $dept)
                    <tr>
                        <td>{{ $dept['name'] }}</td>
                        <td>{{ $dept['count'] }}</td>
                        <td>{{ round(($dept['count'] / $totalCount) * 100, 1) }}%</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            
            <div class="subtitle">Distribución por Ciudades</div>
            @php
                $cityDistribution = collect($graduates)
                    ->groupBy(function ($item) {
                        return $item['city'] . ' - ' . $item['department'];
                    })
                    ->map(function ($items, $key) {
                        $parts = explode(' - ', $key);
                        return [
                            'city' => $parts[0] ?: 'No especificado',
                            'department' => isset($parts[1]) ? $parts[1] : 'No especificado',
                            'count' => count($items)
                        ];
                    })
                    ->sortByDesc('count')
                    ->values()
                    ->all();
            @endphp
            
            <table>
                <thead>
                    <tr>
                        <th>Ciudad</th>
                        <th>Departamento</th>
                        <th>Cantidad de Egresados</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($cityDistribution as $city)
                    <tr>
                        <td>{{ $city['city'] }}</td>
                        <td>{{ $city['department'] }}</td>
                        <td>{{ $city['count'] }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px; font-size: 16px;">
                No hay datos geográficos disponibles.
            </p>
        @endif
    </div>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>