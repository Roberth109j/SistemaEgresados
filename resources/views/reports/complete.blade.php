<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte: {{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 16px; }
        .header { text-align: center; margin-bottom: 20px; }
        .section { margin-bottom: 30px; page-break-inside: avoid; }
        h2 { color: #333; border-bottom: 2px solid #3f80ea; padding-bottom: 5px; font-size: 20px; }
        h3 { color: #333; font-size: 18px; }
        table { width: 100%; border-collapse: collapse; page-break-inside: auto; margin-bottom: 15px; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 14px; }
        .stats-box { background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin-bottom: 20px; }
        .page-break { page-break-before: always; }
        .chart-container { margin: 15px 0; }
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
        .data-visual { margin-bottom: 20px; }
        .data-label { margin-bottom: 5px; font-weight: bold; font-size: 17px; }
        h1 { font-size: 24px; color: #333; }
        p { font-size: 16px; line-height: 1.4; }
        @page { margin: 1.5cm; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <div class="stats-box">
        <h2>Resumen General</h2>
        <table>
            <tr>
                <th>Total de Egresados</th>
                <td>{{ $stats['totalGraduates'] }}</td>
                <th>Egresados con Empleo</th>
                <td>{{ $stats['withEmployment'] }} ({{ $stats['totalGraduates'] > 0 ? round(($stats['withEmployment'] / $stats['totalGraduates']) * 100, 1) : 0 }}%)</td>
            </tr>
            <tr>
                <th>Con Educación Superior</th>
                <td>{{ $stats['withHigherEducation'] }} ({{ $stats['totalGraduates'] > 0 ? round(($stats['withHigherEducation'] / $stats['totalGraduates']) * 100, 1) : 0 }}%)</td>
                <th>Perfiles Completos</th>
                <td>{{ $stats['withCompleteProfiles'] }} ({{ $stats['totalGraduates'] > 0 ? round(($stats['withCompleteProfiles'] / $stats['totalGraduates']) * 100, 1) : 0 }}%)</td>
            </tr>
            <tr>
                <th>Ciudad más popular</th>
                <td>{{ $stats['mostPopularCity'] }}</td>
                <th>Carrera más común</th>
                <td>{{ $stats['mostPopularCareer'] }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Distribución por Género</h2>
        <!-- Visualización mejorada para PDF -->
        <div class="chart-container">
            @php
                $totalGender = array_sum(array_column($genderDistribution, 'value'));
                $colors = ['#3f80ea', '#e83e8c', '#6c757d', '#20c997', '#fd7e14'];
            @endphp
            
            @foreach($genderDistribution as $index => $gender)
                <div class="data-visual">
                    <div class="data-label">
                        {{ $gender['name'] }}
                    </div>
                    <div class="graph-bar">
                        @php
                            $percentage = ($gender['value'] / $totalGender) * 100;
                            $color = $gender['color'] ?? $colors[$index % count($colors)];
                        @endphp
                        <div class="graph-fill" style="width: {{ $percentage }}%; background-color: {{ $color }};">
                            {{ $gender['value'] }} ({{ round($percentage, 1) }}%)
                        </div>
                    </div>
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
                    <td>{{ round(($gender['value'] / $totalGender) * 100, 1) }}%</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Distribución por Ubicación</h2>
        <!-- Visualización mejorada para PDF -->
        <div class="chart-container">
            @php
                $totalLocation = array_sum(array_column($locationDistribution, 'value'));
                $topLocations = array_slice($locationDistribution, 0, 5); // Mostrar solo las 5 ubicaciones principales
            @endphp
            
            @foreach($topLocations as $index => $location)
                <div class="data-visual">
                    <div class="data-label">
                        {{ $location['name'] }}
                    </div>
                    <div class="graph-bar">
                        @php
                            $percentage = ($location['value'] / $totalLocation) * 100;
                            $color = $colors[$index % count($colors)];
                        @endphp
                        <div class="graph-fill" style="width: {{ $percentage }}%; background-color: {{ $color }};">
                            {{ $location['value'] }} ({{ round($percentage, 1) }}%)
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Ciudad/Ubicación</th>
                    <th>Cantidad</th>
                    <th>Porcentaje</th>
                </tr>
            </thead>
            <tbody>
                @foreach($locationDistribution as $location)
                <tr>
                    <td>{{ $location['name'] }}</td>
                    <td>{{ $location['value'] }}</td>
                    <td>{{ round(($location['value'] / $totalLocation) * 100, 1) }}%</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="page-break"></div>

    <div class="section">
        <h2>Distribución Académica</h2>
        <table>
            <thead>
                <tr>
                    <th>Institución</th>
                    <th>Carrera</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                @foreach($academicDistribution as $item)
                <tr>
                    <td>{{ is_array($item) ? $item['institution'] : $item->institution }}</td>
                    <td>{{ is_array($item) ? $item['career'] : $item->career }}</td>
                    <td>{{ is_array($item) ? $item['count'] : $item->count }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Distribución por Año de Graduación</h2>
        <!-- Visualización mejorada para PDF -->
        <div class="chart-container">
            @php
                $totalGradYear = array_sum(array_column($graduationYearDistribution, 'count'));
            @endphp
            
            @foreach($graduationYearDistribution as $index => $item)
                <div class="data-visual">
                    <div class="data-label">
                        {{ $item['year'] }}
                    </div>
                    <div class="graph-bar">
                        @php
                            $percentage = ($item['count'] / $totalGradYear) * 100;
                            $color = $colors[$index % count($colors)];
                        @endphp
                        <div class="graph-fill" style="width: {{ $percentage }}%; background-color: {{ $color }};">
                            {{ $item['count'] }} ({{ round($percentage, 1) }}%)
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Año</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                @foreach($graduationYearDistribution as $item)
                <tr>
                    <td>{{ $item['year'] }}</td>
                    <td>{{ $item['count'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="page-break"></div>

    <div class="section">
        <h2>Principales Empleadores</h2>
        <!-- Visualización mejorada para PDF -->
        <div class="chart-container">
            @php
                $totalEmployers = 0;
                foreach ($topEmployers as $employer) {
                    $totalEmployers += (is_array($employer) ? $employer['count'] : $employer->count);
                }
            @endphp
            
            @foreach($topEmployers as $index => $employer)
                <div class="data-visual">
                    <div class="data-label">
                        {{ is_array($employer) ? $employer['company'] : $employer->company }}
                    </div>
                    <div class="graph-bar">
                        @php
                            $count = is_array($employer) ? $employer['count'] : $employer->count;
                            $percentage = ($count / $totalEmployers) * 100;
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
                    <th>Empresa</th>
                    <th>Cantidad de Egresados</th>
                </tr>
            </thead>
            <tbody>
                @foreach($topEmployers as $employer)
                <tr>
                    <td>{{ is_array($employer) ? $employer['company'] : $employer->company }}</td>
                    <td>{{ is_array($employer) ? $employer['count'] : $employer->count }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Sectores de Empleo</h2>
        <!-- Visualización mejorada para PDF -->
        <div class="chart-container">
            @php
                $totalSectors = 0;
                foreach ($employmentSectorDistribution as $sector) {
                    $totalSectors += (is_array($sector) ? $sector['count'] : $sector->count);
                }
                $sectorColors = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#795548', '#607d8b'];
            @endphp
            
            @foreach($employmentSectorDistribution as $index => $sector)
                <div class="data-visual">
                    <div class="data-label">
                        {{ is_array($sector) ? $sector['sector'] : $sector->sector }}
                    </div>
                    <div class="graph-bar">
                        @php
                            $count = is_array($sector) ? $sector['count'] : $sector->count;
                            $percentage = ($totalSectors > 0) ? ($count / $totalSectors) * 100 : 0;
                            $color = $sectorColors[$index % count($sectorColors)];
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
                    <th>Sector</th>
                    <th>Cantidad de Egresados</th>
                </tr>
            </thead>
            <tbody>
                @foreach($employmentSectorDistribution as $sector)
                <tr>
                    <td>{{ is_array($sector) ? $sector['sector'] : $sector->sector }}</td>
                    <td>{{ is_array($sector) ? $sector['count'] : $sector->count }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Niveles Académicos</h2>
        <!-- Visualización mejorada para PDF -->
        <div class="chart-container">
            @php
                $totalAcademicLevel = array_sum(array_column($academicLevelDistribution, 'count'));
                $levelColors = ['#3f80ea', '#4caf50', '#ff9800', '#e83e8c'];
            @endphp
            
            @foreach($academicLevelDistribution as $index => $level)
                <div class="data-visual">
                    <div class="data-label">
                        {{ $level['level'] }}
                    </div>
                    <div class="graph-bar">
                        @php
                            $percentage = ($level['count'] / $totalAcademicLevel) * 100;
                            $color = $level['color'] ?? $levelColors[$index % count($levelColors)];
                        @endphp
                        <div class="graph-fill" style="width: {{ $percentage }}%; background-color: {{ $color }};">
                            {{ $level['count'] }} ({{ round($percentage, 1) }}%)
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Nivel Académico</th>
                    <th>Cantidad</th>
                    <th>Porcentaje</th>
                </tr>
            </thead>
            <tbody>
                @foreach($academicLevelDistribution as $level)
                <tr>
                    <td>{{ $level['level'] }}</td>
                    <td>{{ $level['count'] }}</td>
                    <td>{{ round(($level['count'] / $totalAcademicLevel) * 100, 1) }}%</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="page-break"></div>

    <div class="section">
        <h2>Conclusiones</h2>
        <p>De acuerdo a los datos analizados, se observa que la mayoría de los egresados ({{ $stats['withEmployment'] }} de {{ $stats['totalGraduates'] }}) se encuentran empleados actualmente. La ciudad con mayor concentración de egresados es {{ $stats['mostPopularCity'] }} y la carrera más común es {{ $stats['mostPopularCareer'] }}.</p>
        
        <p>Un total de {{ $stats['withHigherEducation'] }} egresados han continuado con estudios de educación superior (especialización, maestría o doctorado), lo que representa un {{ $stats['totalGraduates'] > 0 ? round(($stats['withHigherEducation'] / $stats['totalGraduates']) * 100, 1) : 0 }}% del total.</p>
        
        <p>Se recomienda realizar seguimiento a los {{ $stats['totalGraduates'] - $stats['withCompleteProfiles'] }} egresados que aún no han completado sus perfiles en el sistema para tener una visión más completa sobre su situación actual.</p>
    </div>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html> 