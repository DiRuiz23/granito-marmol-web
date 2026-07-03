import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import usuariosRouter from './usuarios.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Redirección HTTPS (Middleware)
// Detecta si la solicitud no es HTTPS y redirige. Soporta proxies como Render/Heroku (x-forwarded-proto).
app.use((req, res, next) => {
    // En producción (Render/Heroku), la conexión HTTPS se termina en el proxy.
    // El proxy reenvía la petición como HTTP agregando la cabecera 'x-forwarded-proto'.
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    
    // Si no es HTTPS y no estamos en entorno de desarrollo local (localhost), redirigir
    const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1' || req.hostname === '::1';
    
    if (!isHttps && !isLocalhost) {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});

// 2. Cabeceras de Seguridad con Helmet
// Configura CSP, HSTS, X-Frame-Options, X-Content-Type-Options y Referrer-Policy
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"], // Permite scripts propios e inline de confianza
                "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"], // Permite fuentes y estilos de Google
                "font-src": ["'self'", "https://fonts.gstatic.com"],
                "img-src": ["'self'", "data:", "https://images.unsplash.com"],
            },
        },
        // HSTS (HTTP Strict Transport Security) - Fuerza a usar HTTPS durante 1 año
        strictTransportSecurity: {
            maxAge: 31536000, // 1 año en segundos
            includeSubDomains: true,
            preload: true
        },
        xFrameOptions: { action: "deny" }, // Previene Clickjacking
        referrerPolicy: { policy: "strict-origin-when-cross-origin" }
    })
);

// Middleware para procesar JSON y cookies
app.use(express.json());
app.use(cookieParser('secreto_de_firma_cookie')); // Firma de cookies

// Servir archivos estáticos del frontend desde 'dist' (producción) o raíz (desarrollo)
const staticPath = fs.existsSync(path.join(__dirname, 'dist'))
    ? path.join(__dirname, 'dist')
    : path.join(__dirname);
app.use(express.static(staticPath));

// 3. Configuración de Cookies Seguras
// Endpoint para establecer una cookie de sesión segura
app.get('/api/set-secure-cookie', (req, res) => {
    const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1' || req.hostname === '::1';
    
    const cookieOptions = {
        httpOnly: true,                 // Previene acceso desde Javascript (mitiga XSS)
        secure: !isLocalhost,           // Solo se envía sobre HTTPS (en producción es obligatorio)
        sameSite: 'lax',                // Protege contra ataques CSRF
        maxAge: 24 * 60 * 60 * 1000,    // 1 día de duración
        signed: true                    // Firma criptográficamente la cookie
    };

    res.cookie('user_session', 'token_seguro_firmado_123456', cookieOptions);
    res.json({
        ok: true,
        message: 'Cookie segura establecida con éxito',
        cookieConfigured: {
            name: 'user_session',
            value: 'token_seguro_firmado_123456',
            options: {
                httpOnly: cookieOptions.httpOnly,
                secure: cookieOptions.secure,
                sameSite: cookieOptions.sameSite,
                maxAge: cookieOptions.maxAge,
                signed: cookieOptions.signed
            }
        }
    });
});

// Endpoint para limpiar la cookie de sesión
app.get('/api/clear-cookie', (req, res) => {
    res.clearCookie('user_session');
    res.json({ ok: true, message: 'Cookie limpiada con éxito' });
});

// Endpoint para retornar el estado actual de las cabeceras de seguridad y cookies
app.get('/api/security-status', (req, res) => {
    const headers = res.getHeaders();
    const cookiesReceived = req.signedCookies;
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';

    res.json({
        ok: true,
        protocol: isHttps ? 'HTTPS' : 'HTTP',
        isSecureConnection: isHttps,
        securityHeaders: {
            'Content-Security-Policy': headers['content-security-policy'] || 'Faltante',
            'Strict-Transport-Security': headers['strict-transport-security'] || 'Faltante',
            'X-Frame-Options': headers['x-frame-options'] || 'Faltante',
            'X-Content-Type-Options': headers['x-content-type-options'] || 'Faltante',
            'Referrer-Policy': headers['referrer-policy'] || 'Faltante',
            'X-Download-Options': headers['x-download-options'] || 'Faltante',
            'X-Permitted-Cross-Domain-Policies': headers['x-permitted-cross-domain-policies'] || 'Faltante',
            'X-XSS-Protection': headers['x-xss-protection'] || 'Faltante'
        },
        cookies: {
            hasUserSessionCookie: !!cookiesReceived['user_session'],
            cookieValueEncrypted: cookiesReceived['user_session'] ? '[CONFIDENCIAL]' : null
        }
    });
});

// Proxy for Python Flask backend (Cotizaciones API)
app.all(/^\/api\/cotizacion/, async (req, res) => {
    const pythonBackendUrl = `http://127.0.0.1:8000${req.originalUrl}`;
    try {
        const fetchOptions = {
            method: req.method,
            headers: {}
        };

        // Forward headers, but exclude host to prevent issues with remote/localhost mismatch
        for (const [key, val] of Object.entries(req.headers)) {
            if (key.toLowerCase() !== 'host') {
                fetchOptions.headers[key] = val;
            }
        }

        // If it's a POST/PUT/PATCH, forward the body
        if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
            fetchOptions.body = JSON.stringify(req.body);
            // Ensure Content-Type is set to JSON since we stringified the body
            fetchOptions.headers['content-type'] = 'application/json';
        }

        const response = await fetch(pythonBackendUrl, fetchOptions);
        
        // Forward relevant headers from Python
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }
        
        const disposition = response.headers.get('content-disposition');
        if (disposition) {
            res.setHeader('Content-Disposition', disposition);
        }

        if (contentType && contentType.includes('application/pdf')) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return res.send(buffer);
        }

        const textResponse = await response.text();
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(textResponse);
        } catch (e) {
            return res.status(response.status).send(textResponse);
        }

        return res.status(response.status).json(jsonResponse);
    } catch (error) {
        console.error('Error proxying request to Python backend:', error);
        return res.status(502).json({
            ok: false,
            message: 'Error al conectar con el backend de cotizaciones (Python/Flask)',
            details: error.message
        });
    }
});

// 4. Integración del controlador de usuarios existente
app.use('/api/usuarios', usuariosRouter);

// Fallback para servir el frontend (dist/index.html o raíz index.html)
app.use((req, res) => {
    const indexPath = fs.existsSync(path.join(__dirname, 'dist', 'index.html'))
        ? path.join(__dirname, 'dist', 'index.html')
        : path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` Servidor de Seguridad HTTP corriendo con éxito  `);
    console.log(` Puerto: ${PORT}                                 `);
    console.log(` URL Local: http://localhost:${PORT}             `);
    console.log(`=================================================`);
});
