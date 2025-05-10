<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte: {{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 16px; }
        .header { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 15px; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 14px; }
        .gender-box { padding: 15px; margin: 5px; display: inline-block; border-radius: 5px; width: 28%; }
        
        /* Estilos para la representación gráfica */
        .chart-container { margin: 20px 0; }
        .bar-chart { width: 100%; margin-top: 20px; }
        .bar-container { margin-bottom: 15px; }
        .bar-label { width: 25%; display: inline-block; font-weight: bold; font-size: 16px; }
        .bar-outer { display: inline-block; width: 60%; height: 30px; background-color: #f1f1f1; border-radius: 4px; position: relative; }
        .bar-inner { 
            height: 30px; 
            position: absolute; 
            left: 0; 
            top: 0; 
            border-radius: 4px; 
            color: white; 
            text-align: center; 
            line-height: 30px; 
            font-weight: bold; 
            font-size: 15px;
        }
        .bar-value { display: inline-block; width: 15%; text-align: right; font-size: 15px; }
        
        /* Colores específicos para cada género */
        .bar-masculino { background-color: #3f80ea; }
        .bar-femenino { background-color: #e83e8c; }
        .bar-otro { background-color: #6c757d; }
        
        /* Estilos para gráficos alternativos */
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
            border-radius: 4px;
            color: white;
            text-align: right;
            padding-right: 10px;
            font-weight: bold;
            font-size: 15px;
            line-height: 30px;
            white-space: nowrap;
        }
        .gender-visual { margin-bottom: 20px; }
        .gender-name { margin-bottom: 5px; font-weight: bold; font-size: 17px; }
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

    <div style="text-align: center; margin-bottom: 20px;">
        <h2>Distribución por Género</h2>
        <p>Total de datos analizados: {{ array_sum(array_column($genderDistribution, 'value')) }}</p>
    </div>

    <!-- Visualización alternativa para PDF -->
    <div style="margin: 20px 0;">
        @php
            $totalValue = array_sum(array_column($genderDistribution, 'value'));
        @endphp
        
        @foreach($genderDistribution as $gender)
            <div class="gender-visual">
                <div class="gender-name">
                    {{ $gender['name'] }}
                </div>
                <div class="graph-bar">
                    @php
                        $percentage = ($gender['value'] / $totalValue) * 100;
                        
                        $barClass = '';
                        $barColor = '';
                        if (strtolower($gender['name']) === 'masculino') {
                            $barClass = 'bar-masculino';
                            $barColor = '#3f80ea';
                        } elseif (strtolower($gender['name']) === 'femenino') {
                            $barClass = 'bar-femenino';
                            $barColor = '#e83e8c';
                        } else {
                            $barClass = 'bar-otro';
                            $barColor = '#6c757d';
                        }
                    @endphp
                    <div class="graph-fill {{ $barClass }}" style="width: {{ $percentage }}%; background-color: {{ $barColor }};">
                        {{ $gender['value'] }} ({{ round($percentage, 1) }}%)
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <!-- Representación visual alternativa - Gráfico de cajas -->
    <div style="text-align: center; margin: 30px 0;">
        @foreach($genderDistribution as $gender)
            @php
                $percentage = ($gender['value'] / $totalValue) * 100;
                $backgroundColor = str_replace('#', 'rgba(', $gender['color']) . '0.2)';
                $borderColor = $gender['color'];
            @endphp
            <div class="gender-box" style="background-color: {{ $backgroundColor }}; border: 2px solid {{ $borderColor }};">
                <h3 style="font-size: 18px;">{{ $gender['name'] }}</h3>
                <p style="font-size: 28px; font-weight: bold;">{{ $gender['value'] }}</p>
                <p style="font-size: 16px;">{{ number_format($percentage, 1) }}%</p>
            </div>
        @endforeach
    </div>

    <table>
        <thead>
            <tr>
                <th>Género</th>
                <th>Cantidad</th>
                <th>Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @foreach($genderDistribution as $gender)
            <tr>
                <td>{{ $gender['name'] }}</td>
                <td>{{ $gender['value'] }}</td>
                <td>{{ round(($gender['value'] / $totalValue) * 100, 1) }}%</td>
            </tr>
            @endforeach
            <tr style="font-weight: bold;">
                <td>Total</td>
                <td>{{ $totalValue }}</td>
                <td>100%</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>