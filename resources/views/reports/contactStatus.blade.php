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
        .status-box { 
            margin: 10px; 
            padding: 15px; 
            border-radius: 5px; 
            width: 28%; 
            display: inline-block; 
            text-align: center; 
            background-color: #f9f9f9; 
            border: 1px solid #eee;
        }
        .status-count { font-size: 28px; font-weight: bold; margin: 10px 0; }
        .status-text { font-size: 18px; margin-bottom: 5px; }
        .status-percent { font-size: 16px; }
        
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
        .status-visual { margin-bottom: 20px; }
        .status-name { margin-bottom: 5px; font-weight: bold; font-size: 17px; }
        h1 { font-size: 24px; color: #333; }
        h2 { font-size: 20px; color: #333; }
        h3 { font-size: 18px; color: #333; }
        ul li { font-size: 16px; margin-bottom: 8px; }
        @page { margin: 1.5cm; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <h2>Estado de Contactabilidad de Egresados</h2>
    <p>Este reporte muestra el estado de contactabilidad de los egresados registrados en el sistema.</p>

    <!-- Visualización alternativa para PDF -->
    <div style="margin: 20px 0;">
        @php
            $totalCount = array_sum(array_column($contactStatusDistribution, 'count'));
        @endphp
        
        @foreach($contactStatusDistribution as $status)
            @php
                $color = $status['color'];
                $percentage = ($status['count'] / $totalCount) * 100;
            @endphp
            <div class="status-visual">
                <div class="status-name">
                    {{ $status['status'] }}
                </div>
                <div class="graph-bar">
                    <div class="graph-fill" style="width: {{ $percentage }}%; background-color: {{ $color }};">
                        {{ $status['count'] }} ({{ round($percentage, 1) }}%)
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <div style="text-align: center; margin: 30px 0;">
        @foreach($contactStatusDistribution as $status)
            <div class="status-box" style="background-color: {{ str_replace('#', 'rgba(', $status['color']) }}0.1); border-color: {{ $status['color'] }};">
                <div class="status-text">{{ $status['status'] }}</div>
                <div class="status-count" style="color: {{ $status['color'] }};">{{ $status['count'] }}</div>
                <div class="status-percent">{{ round(($status['count'] / $totalCount) * 100, 1) }}% del total</div>
            </div>
        @endforeach
    </div>

    <h3>Detalle de Egresados por Estado de Contacto</h3>
    <table>
        <thead>
            <tr>
                <th>Estado</th>
                <th>Cantidad</th>
                <th>Descripción</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Actualizado</td>
                <td>{{ collect($contactStatusDistribution)->firstWhere('status', 'Actualizado')['count'] ?? 0 }}</td>
                <td>Egresados con perfil completo (más del 70% de información) y datos de contacto actualizados.</td>
            </tr>
            <tr>
                <td>Parcial</td>
                <td>{{ collect($contactStatusDistribution)->firstWhere('status', 'Parcial')['count'] ?? 0 }}</td>
                <td>Egresados con perfil parcialmente completo (entre 30% y 70% de información).</td>
            </tr>
            <tr>
                <td>Desactualizado</td>
                <td>{{ collect($contactStatusDistribution)->firstWhere('status', 'Desactualizado')['count'] ?? 0 }}</td>
                <td>Egresados con perfil incompleto (menos del 30% de información) o sin datos de contacto actualizados.</td>
            </tr>
        </tbody>
    </table>

    <h3>Recomendaciones</h3>
    <ul>
        <li>Realizar campañas de actualización de datos para los {{ collect($contactStatusDistribution)->firstWhere('status', 'Desactualizado')['count'] ?? 0 }} egresados con estado desactualizado.</li>
        <li>Enviar recordatorios periódicos a los {{ collect($contactStatusDistribution)->firstWhere('status', 'Parcial')['count'] ?? 0 }} egresados con estado parcial para completar su información.</li>
        <li>Mantener un seguimiento regular con los {{ collect($contactStatusDistribution)->firstWhere('status', 'Actualizado')['count'] ?? 0 }} egresados actualizados para conservar la comunicación.</li>
    </ul>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>
 charset="utf-8">
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