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
        .employer-visual { margin-bottom: 20px; }
        .employer-name { margin-bottom: 5px; font-weight: bold; font-size: 17px; }
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

    <h2>Principales Empleadores de Egresados</h2>
    <p>Este reporte muestra las empresas que más contratan a nuestros egresados.</p>

    @if(isset($topEmployers) && count($topEmployers) > 0)
        <!-- Visualización alternativa para PDF con barras gráficas -->
        <div style="margin: 20px 0;">
            @php
                $totalCount = 0;
                foreach ($topEmployers as $employer) {
                    $totalCount += (is_array($employer) ? $employer['count'] : $employer->count);
                }
                $colors = ['#3f80ea', '#4caf50', '#ff9800', '#e83e8c', '#6f42c1', '#20c997', '#fd7e14', '#17a2b8'];
            @endphp
            
            @foreach($topEmployers as $index => $employer)
                <div class="employer-visual">
                    <div class="employer-name">
                        {{ is_array($employer) ? $employer['company'] : $employer->company }}
                    </div>
                    <div class="graph-bar">
                        @php
                            $count = is_array($employer) ? $employer['count'] : $employer->count;
                            $percentage = ($count / $totalCount) * 100;
                            $color = $colors[$index % count($colors)];
                        @endphp
                        <div class="graph-fill" style="width: {{ $percentage }}%; background-color: {{ $color }};">
                            {{ $count }} ({{ round($percentage, 1) }}%)
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <table>
            <thead>
                <tr>
                    <th>Empresa / Empleador</th>
                    <th>Cantidad de Egresados</th>
                    <th>Porcentaje</th>
                </tr>
            </thead>
            <tbody>
                @foreach($topEmployers as $employer)
                <tr>
                    <td>{{ is_array($employer) ? $employer['company'] : $employer->company }}</td>
                    <td>{{ is_array($employer) ? $employer['count'] : $employer->count }}</td>
                    <td>{{ round(((is_array($employer) ? $employer['count'] : $employer->count) / $totalCount) * 100, 1) }}%</td>
                </tr>
                @endforeach
                <tr style="font-weight: bold;">
                    <td>Total</td>
                    <td>{{ $totalCount }}</td>
                    <td>100%</td>
                </tr>
            </tbody>
        </table>
    @else
        <p style="text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px; font-size: 16px;">
            No hay datos disponibles sobre empleadores.
        </p>
    @endif

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>