// Lógica del cliente para el Panel de Seguridad HTTP
document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const protocolPill = document.getElementById('connection-protocol');
    const headersContainer = document.getElementById('headers-container');
    const cookieStatus = document.getElementById('cookie-status');
    const consoleLogs = document.getElementById('console-logs');
    
    const btnSetCookie = document.getElementById('btn-set-cookie');
    const btnClearCookie = document.getElementById('btn-clear-cookie');
    const btnTestUsuarios = document.getElementById('btn-test-usuarios');

    // Función auxiliar para registrar logs en la interfaz
    function addLog(message, type = 'info') {
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = 'console-line';
        
        let typeClass = '';
        if (type === 'success') typeClass = 'console-success';
        if (type === 'error') typeClass = 'console-error';
        if (type === 'warning') typeClass = 'console-warning';

        line.innerHTML = `[${time}] <span class="${typeClass}">${message}</span>`;
        consoleLogs.appendChild(line);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
    }

    // Cabeceras esperadas a auditar
    const targetHeaders = [
        { name: 'Content-Security-Policy', desc: 'Previene XSS limitando de dónde se cargan los recursos.' },
        { name: 'Strict-Transport-Security', desc: 'Fuerza al navegador a usar siempre HTTPS (HSTS).' },
        { name: 'X-Frame-Options', desc: 'Previene Clickjacking evitando iframe de otros dominios.' },
        { name: 'X-Content-Type-Options', desc: 'Previene sniffing de MIME types forzando el tipo definido.' },
        { name: 'Referrer-Policy', desc: 'Controla cuánta información de referencia se envía en enlaces.' }
    ];

    // Cargar y renderizar el estado de seguridad
    async function loadSecurityStatus() {
        try {
            const response = await fetch('/api/security-status');
            if (!response.ok) throw new Error('Error al conectar con la API de seguridad');
            
            const data = await response.json();
            
            // 1. Mostrar protocolo y estado seguro
            const protocol = data.protocol;
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            
            protocolPill.textContent = `${protocol} ${isLocal ? '(Desarrollo Local)' : '(Producción)'}`;
            
            if (data.isSecureConnection) {
                protocolPill.className = 'status-pill secured';
                addLog('Conexión detectada sobre canal HTTPS seguro.', 'success');
            } else {
                protocolPill.className = 'status-pill unsecured';
                if (isLocal) {
                    addLog('Corriendo sobre HTTP en localhost (entorno de desarrollo aceptable).', 'info');
                } else {
                    addLog('ADVERTENCIA: Conexión sobre HTTP no seguro detectada en producción. HTTPS obligatorio.', 'warning');
                }
            }

            // 2. Renderizar Cabeceras de Seguridad y su estado
            headersContainer.innerHTML = '';
            
            targetHeaders.forEach(target => {
                const activeValue = data.securityHeaders[target.name];
                const isEnforced = activeValue && activeValue !== 'Faltante';
                
                const item = document.createElement('div');
                item.className = 'header-item';
                
                item.innerHTML = `
                    <div class="header-meta">
                        <span class="header-name">${target.name}</span>
                        <span class="header-status-badge ${isEnforced ? 'active' : 'missing'}">
                            ${isEnforced ? 'PROTEGIDO' : 'INSEGURO / FALTANTE'}
                        </span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                        ${target.desc}
                    </div>
                    ${isEnforced ? `<div class="header-value">${activeValue}</div>` : ''}
                `;
                
                headersContainer.appendChild(item);
            });

            // 3. Renderizar estado de las cookies
            if (data.cookies.hasUserSessionCookie) {
                cookieStatus.innerHTML = '<span style="color: var(--success); font-weight: 600;">ESTABLECIDA y SEGURA</span>';
            } else {
                cookieStatus.innerHTML = '<span style="color: var(--text-muted)">No establecida</span>';
            }

        } catch (error) {
            addLog(`Error de auditoría: ${error.message}`, 'error');
        }
    }

    // Eventos de botones
    btnSetCookie.addEventListener('click', async () => {
        try {
            addLog('Enviando petición para establecer cookie segura...');
            const response = await fetch('/api/set-secure-cookie');
            const data = await response.json();
            
            if (data.ok) {
                addLog(`Cookie establecida. Opciones: httpOnly=${data.cookieConfigured.options.httpOnly}, secure=${data.cookieConfigured.options.secure}, sameSite=${data.cookieConfigured.options.sameSite}`, 'success');
                // Al ser HttpOnly, document.cookie no la mostrará en el JS del cliente por seguridad.
                addLog('Nota de seguridad: La cookie es HttpOnly por lo que no es accesible a través de document.cookie.', 'warning');
                await loadSecurityStatus();
            }
        } catch (error) {
            addLog(`Error al configurar la cookie: ${error.message}`, 'error');
        }
    });

    btnClearCookie.addEventListener('click', async () => {
        try {
            addLog('Limpiando cookie segura...');
            const response = await fetch('/api/clear-cookie');
            const data = await response.json();
            
            if (data.ok) {
                addLog('Cookie limpiada en el servidor.', 'success');
                await loadSecurityStatus();
            }
        } catch (error) {
            addLog(`Error al limpiar la cookie: ${error.message}`, 'error');
        }
    });

    btnTestUsuarios.addEventListener('click', async () => {
        try {
            addLog('Llamando a la ruta de usuarios activos (/api/usuarios/activos)...');
            const response = await fetch('/api/usuarios/activos');
            const data = await response.json();
            
            if (response.ok) {
                addLog(`Respuesta exitosa de usuarios: ${JSON.stringify(data.data)}`, 'success');
            } else {
                addLog(`Error de usuarios API: ${response.statusText}`, 'error');
            }
        } catch (error) {
            addLog(`Error al llamar la API de usuarios: ${error.message}`, 'error');
        }
    });

    // Carga inicial
    loadSecurityStatus();
});
