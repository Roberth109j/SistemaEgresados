<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte: {{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; }
        .skill-bar { height: 25px; border-radius: 4px; margin-bottom: 15px; position: relative; }
        .skill-name { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: white; font-weight: bold; }
        .skill-count { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: white; font-weight: bold; }
        .subtitle { font-size: 18px; font-weight: bold; margin: 20px 0 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <div class="section">
        <h2>Habilidades más Frecuentes</h2>
        <p>Este reporte muestra las habilidades más mencionadas por los egresados en sus perfiles profesionales.</p>

        <div class="subtitle">Habilidades Blandas (Soft Skills)</div>
        @php
            $maxSoftCount = !empty($skillsDistribution['softSkills']) ? max(array_column($skillsDistribution['softSkills'], 'count')) : 0;
        @endphp
        
        @if(!empty($skillsDistribution['softSkills']))
            @foreach(array_slice($skillsDistribution['softSkills'], 0, 10) as $index => $skill)
                <div class="skill-bar" style="width: {{ ($skill['count'] / $maxSoftCount) * 100 }}%; background-color: #6f42c1;">
                    <div class="skill-name">{{ $skill['name'] }}</div>
                    <div class="skill-count">{{ $skill['count'] }}</div>
                </div>
            @endforeach
            
            <table>
                <thead>
                    <tr>
                        <th>Habilidad Blanda</th>
                        <th>Frecuencia</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($skillsDistribution['softSkills'] as $skill)
                    <tr>
                        <td>{{ $skill['name'] }}</td>
                        <td>{{ $skill['count'] }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No hay datos disponibles sobre habilidades blandas.</p>
        @endif

        <div class="subtitle">Habilidades Técnicas (Hard Skills)</div>
        @php
            $maxHardCount = !empty($skillsDistribution['hardSkills']) ? max(array_column($skillsDistribution['hardSkills'], 'count')) : 0;
        @endphp
        
        @if(!empty($skillsDistribution['hardSkills']))
            @foreach(array_slice($skillsDistribution['hardSkills'], 0, 10) as $index => $skill)
                <div class="skill-bar" style="width: {{ ($skill['count'] / $maxHardCount) * 100 }}%; background-color: #4caf50;">
                    <div class="skill-name">{{ $skill['name'] }}</div>
                    <div class="skill-count">{{ $skill['count'] }}</div>
                </div>
            @endforeach
            
            <table>
                <thead>
                    <tr>
                        <th>Habilidad Técnica</th>
                        <th>Frecuencia</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($skillsDistribution['hardSkills'] as $skill)
                    <tr>
                        <td>{{ $skill['name'] }}</td>
                        <td>{{ $skill['count'] }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No hay datos disponibles sobre habilidades técnicas.</p>
        @endif
    </div>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>