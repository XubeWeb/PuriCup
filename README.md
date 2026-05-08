# 🎰 Despedida de Soltero — Máquina Gancho

Web interactiva para despedidas de soltero. Máquina gancho con física real, 30 pruebas ordenadas, 3 categorías y panel de control en tiempo real. Todos los dispositivos ven el mismo estado.

---

## Estructura del proyecto

```
despedida/
├── server.js          ← Backend Express + SQLite
├── package.json
├── render.yaml        ← Config despliegue Render
├── public/
│   └── index.html     ← Frontend completo
└── db/                ← Se crea automáticamente en local
```

---

## Personalizar las pruebas

Edita el array en `server.js` (línea ~30), en la sección `// SEED`.  
Cada prueba tiene:

```js
{
  id: 1,
  orden: 1,               // orden de salida (1 = primero)
  categoria: 'dia1',      // 'dia1' | 'dia2' | 'continuas'
  titulo: 'Mi prueba',
  descripcion: 'Descripción detallada de lo que hay que hacer.',
  emoji: '🎯'
}
```

**Si ya desplegaste y quieres cambiar pruebas:** borra el archivo `despedida.db` en Render (Shell → `rm /data/despedida.db`) y reinicia el servicio. Se regenera solo.

---

## Desplegar en Render (gratis)

### 1. Sube el código a GitHub

```bash
cd despedida
git init
git add .
git commit -m "Despedida máquina gancho"
```

Ve a github.com → New repository → crea uno privado → sigue las instrucciones para subir.

### 2. Crea el servicio en Render

1. Ve a **render.com** y crea cuenta (gratis)
2. Dashboard → **New** → **Web Service**
3. Conecta tu repositorio de GitHub
4. Render detecta el `render.yaml` automáticamente
5. Haz clic en **Deploy**

Render configurará automáticamente:
- Node.js como entorno
- `npm install` como build
- `npm start` como arranque
- Disco persistente en `/data` para la base de datos

### 3. Variables de entorno (opcional)

En Render → tu servicio → **Environment**:

| Variable | Valor | Para qué |
|----------|-------|----------|
| `RESET_KEY` | `tuClaveSecreta` | Clave para reiniciar la partida |

Por defecto la clave es `despedida2025`.

### 4. ¡Listo!

Render te da una URL tipo `https://despedida-soltero.onrender.com`.  
Compártela con todos — funciona en móvil, tablet y PC.

---

## Uso durante la despedida

1. **Mueve el gancho** con ◀ ▶ (o teclado ← →)
2. **Pulsa BAJAR** para soltar el gancho
3. Si atrapa una bola, **cae a la caja lateral**
4. **Toca la bola** en la caja → animación de apertura → aparece la carta con la prueba
5. **Voltea la carta** para ver los detalles
6. La prueba aparece en el **panel inferior** en su categoría
7. Cuando se complete, pulsa **"Completada"** — queda marcada para todos

---

## API endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/pruebas` | Todas las pruebas y su estado |
| GET | `/api/pruebas/next` | La siguiente pendiente de extraer |
| POST | `/api/pruebas/:id/extraer` | Marcar como extraída |
| PATCH | `/api/pruebas/:id/completar` | Toggle completada/pendiente |
| POST | `/api/reset` | Reiniciar todo (requiere clave) |

---

## Nota sobre el plan gratuito de Render

El plan gratuito **hiberna** el servicio tras 15 minutos sin tráfico.  
La primera visita tras la hibernación tarda ~30 segundos en arrancar.  
Para evitarlo, activa el servicio unos minutos antes de empezar a jugar.
