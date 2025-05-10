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
        .info-box { padding: 15px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; }
        .info-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .info-name { font-weight: bold; }
        .info-email { color: #666; }
        .info-content { white-space: pre-line; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Generado el {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <h2>Observaciones y Comentarios Personalizados</h2>
    <p>Este reporte muestra información adicional y comentarios registrados por los egresados.</p>

    @if(count($graduates->filter(function($g) { return !empty($g['additional_info']); })) > 0)
        @foreach($graduates->filter(function($g) { return !empty($g['additional_info']); }) as $graduate)
            <div class="info-box">
                <div class="info-header">
                    <div class="info-name">{{ $graduate['name'] }}</div>
                    <div class="info-email">{{ $graduate['email'] }}</div>
                </div>
                <div class="info-content">{{ $graduate['additional_info'] }}</div>
            </div>
        @endforeach
    @else
        <p style="text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
            No hay información adicional registrada por los egresados.
        </p>
    @endif

    <div class="footer">
        <p>Sistema de Gestión de Egresados - {{ date('Y') }}</p>
    </div>
</body>
</html> 