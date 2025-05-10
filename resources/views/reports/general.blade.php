<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte: {{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .stats-container { display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 20px; }
        .stat-item { width: 30%; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <div class="stats-container">
        <div class="stat-item">
            <h3>Total de Egresados</h3>
            <p>{{ $stats['totalGraduates'] }}</p>
        </div>
        <div class="stat-item">
            <h3>Con Empleo</h3>
            <p>{{ $stats['withEmployment'] }} ({{ $stats['totalGraduates'] > 0 ? round(($stats['withEmployment'] / $stats['totalGraduates']) * 100, 1) : 0 }}%)</p>
        </div>
        <div class="stat-item">
            <h3>Con Educación Superior</h3>
            <p>{{ $stats['withHigherEducation'] }} ({{ $stats['totalGraduates'] > 0 ? round(($stats['withHigherEducation'] / $stats['totalGraduates']) * 100, 1) : 0 }}%)</p>
        </div>
        <div class="stat-item">
            <h3>Con Perfiles Completos</h3>
            <p>{{ $stats['withCompleteProfiles'] }} ({{ $stats['totalGraduates'] > 0 ? round(($stats['withCompleteProfiles'] / $stats['totalGraduates']) * 100, 1) : 0 }}%)</p>
        </div>
        <div class="stat-item">
            <h3>Ciudad más popular</h3>
            <p>{{ $stats['mostPopularCity'] }}</p>
        </div>
        <div class="stat-item">
            <h3>Carrera más común</h3>
            <p>{{ $stats['mostPopularCareer'] }}</p>
        </div>
    </div>

    <h2>Muestra de Egresados</h2>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Carrera</th>
                <th>Género</th>
                <th>Ciudad</th>
            </tr>
        </thead>
        <tbody>
            @foreach($graduates as $graduate)
            <tr>
                <td>{{ $graduate['name'] }}</td>
                <td>{{ $graduate['email'] }}</td>
                <td>{{ $graduate['career'] }}</td>
                <td>{{ $graduate['gender'] }}</td>
                <td>{{ $graduate['city'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html>