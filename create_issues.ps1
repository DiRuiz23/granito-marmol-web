# create_issues.ps1
# Script to create GitHub issues with priorities and project assignments using the gh CLI

# Check if gh CLI is installed
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) is not installed. Please install it first: https://cli.github.com/"
    exit 1
}

# Check login status
$authStatus = gh auth status 2>&1
if ($lastExitCode -ne 0) {
    Write-Host "You are not logged into GitHub CLI." -ForegroundColor Yellow
    Write-Host "Running 'gh auth login' to authenticate..." -ForegroundColor Cyan
    gh auth login
    if ($lastExitCode -ne 0) {
        Write-Error "Authentication failed. Please log in and run this script again."
        exit 1
    }
}

# Ask for Valeria's GitHub username
$valeriaUsername = Read-Host -Prompt "Enter Valeria's GitHub username to assign the issues (or press Enter to skip assignment)"

# Ask for Project Name/Number (optional)
$projectName = Read-Host -Prompt "Enter GitHub Project Name or Number if you want to add issues to a Board (optional, e.g. 'Mi Tablero' or press Enter to skip)"

$issues = @(
    @{
        Title = "Blueprint cotizacion/ - Motor de cotizacion + Strategy Pattern + PDF"
        Sprint = "Sprint 1-2"
        Activity = "Act. 3 #2"
        Priority = "Alta"
        Body = '**De parte de:** Diego
**Sprint:** Sprint 1-2
**Actividad:** Act. 3 #2
**Prioridad:** Alta (Critico para el flujo de negocio)

**Descripcion:**
Implementar el motor de cotizacion utilizando el patron Strategy y la generacion de PDF en el Blueprint `cotizacion/`.'
    },
    @{
        Title = "Modelos SQLAlchemy: cotizacion.py, cliente.py"
        Sprint = "Sprint 2"
        Activity = "Act. 3 #2"
        Priority = "Media"
        Body = '**De parte de:** Diego
**Sprint:** Sprint 2
**Actividad:** Act. 3 #2
**Prioridad:** Media (Requerido para la persistencia de cotizaciones)

**Descripcion:**
Crear los modelos de SQLAlchemy para `cotizacion.py` y `cliente.py`.'
    },
    @{
        Title = "Seguridad: JWT + RBAC + bcrypt + rate limiting + logs de auditoria"
        Sprint = "Sprint 1-2"
        Activity = "Act. 1 + Act. 2"
        Priority = "Media"
        Body = '**De parte de:** Diego
**Sprint:** Sprint 1-2
**Actividad:** Act. 1 + Act. 2
**Prioridad:** Media (Esencial para la seguridad del backend)

**Descripcion:**
Configurar la seguridad del sistema:
- Autenticacion con JWT
- Control de acceso basado en roles (RBAC)
- Encriptacion de contraseñas con bcrypt
- Limitacion de peticiones (rate limiting)
- Logs de auditoria para acciones criticas'
    },
    @{
        Title = "Configuracion HTTPS en Render"
        Sprint = "Sprint 1"
        Activity = "Act. 1 + Act. 3 #6"
        Priority = "Alta"
        Body = '**De parte de:** Diego
**Sprint:** Sprint 1
**Actividad:** Act. 1 + Act. 3 #6
**Prioridad:** Alta (Bloqueante para el despliegue e integracion segura)

**Descripcion:**
Configurar el soporte y redireccion HTTPS para el despliegue de la aplicacion en Render.'
    },
    @{
        Title = "Sanitizacion de inputs backend (anti SQLi y XSS)"
        Sprint = "Sprint 2"
        Activity = "Act. 2"
        Priority = "Media"
        Body = '**De parte de:** Diego
**Sprint:** Sprint 2
**Actividad:** Act. 2
**Prioridad:** Media (Mitigacion basica de vulnerabilidades de inyeccion)

**Descripcion:**
Implementar middleware o utilidades de sanitizacion en el backend para prevenir ataques de inyeccion SQL (SQLi) y Cross-Site Scripting (XSS).'
    },
    @{
        Title = "Dockerfile backend + docker-compose.yml (3 servicios)"
        Sprint = "Sprint 1"
        Activity = "Act. 3 #3"
        Priority = "Alta"
        Body = '**De parte de:** Diego
**Sprint:** Sprint 1
**Actividad:** Act. 3 #3
**Prioridad:** Alta (Infraestructura basica del entorno de desarrollo)

**Descripcion:**
Crear el `Dockerfile` para el backend y configurar el archivo `docker-compose.yml` para levantar la arquitectura de 3 servicios (ej. Frontend, Backend, Base de Datos).'
    },
    @{
        Title = "GitHub Actions: workflow ci.yml (linter + pytest en cada PR)"
        Sprint = "Sprint 3"
        Activity = "Act. 3 #4"
        Priority = "Baja"
        Body = '**De parte de:** Diego
**Sprint:** Sprint 3
**Actividad:** Act. 3 #4
**Prioridad:** Baja (Automatizacion y calidad de codigo)

**Descripcion:**
Configurar el workflow de integracion continua (`ci.yml`) en GitHub Actions para ejecutar de manera automatica el linter y los tests unitarios con pytest en cada Pull Request.'
    }
)

foreach ($issue in $issues) {
    Write-Host "Creating issue: $($issue.Title)..." -ForegroundColor Cyan
    
    # Construct base arguments
    $args = @("issue", "create", "--title", $issue.Title, "--body", $issue.Body)
    
    # Add priority label
    $args += @("--label", "prio: $($issue.Priority)")
    # Add sprint label
    $args += @("--label", $issue.Sprint)
    
    # Add assignee
    if (![string]::IsNullOrEmpty($valeriaUsername)) {
        $args += @("--assignee", $valeriaUsername)
    }
    
    # Add project if provided
    if (![string]::IsNullOrEmpty($projectName)) {
        $args += @("--project", $projectName)
    }
    
    # Execute the command
    gh @args
    Write-Host "Done.`n" -ForegroundColor Green
}
