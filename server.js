const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const PRUEBAS_SEED = [
  { id:1,  orden:1,  categoria:'dia1',      titulo:'Beber de un cubo',         descripcion:'El novio debe beberse un cubo de sangría sin usar las manos.',                  emoji:'🪣' },
  { id:2,  orden:2,  categoria:'dia1',      titulo:'Karaoke obligatorio',       descripcion:'Cantar "My Way" completo en el primer bar que encontréis. Sin excusas.',       emoji:'🎤' },
  { id:3,  orden:3,  categoria:'dia1',      titulo:'Foto con desconocido',      descripcion:'Foto con alguien que no conocéis de nada. Tiene que salir sonriendo.',         emoji:'📸' },
  { id:4,  orden:4,  categoria:'dia1',      titulo:'Chupito de la suerte',      descripcion:'El barman elige el chupito. Sin mirar qué es. Sin quejarse.',                  emoji:'🥃' },
  { id:5,  orden:5,  categoria:'dia1',      titulo:'Tutu rosa toda la noche',   descripcion:'El novio lleva un tutu rosa el resto de la noche del día 1. Obligatorio.',     emoji:'🩱' },
  { id:6,  orden:6,  categoria:'dia1',      titulo:'Ruleta de bebidas',         descripcion:'Cada uno pide una bebida diferente y se intercambian al azar entre todos.',    emoji:'🎡' },
  { id:7,  orden:7,  categoria:'dia1',      titulo:'El discurso',               descripcion:'El novio da un discurso de 2 minutos sobre por qué merece casarse.',           emoji:'🎙️' },
  { id:8,  orden:8,  categoria:'dia1',      titulo:'Tour a ciegas',             descripcion:'30 minutos con los ojos vendados guiado por el grupo. El grupo decide.',       emoji:'🙈' },
  { id:9,  orden:9,  categoria:'dia1',      titulo:'Prueba de memoria',         descripcion:'Recita los nombres de todos los presentes de corrido. Si falla: chupito.',     emoji:'🧠' },
  { id:10, orden:10, categoria:'dia1',      titulo:'Llamada misteriosa',        descripcion:'Llamar a alguien elegido por el grupo de sus contactos. En altavoz.',          emoji:'📞' },
  { id:11, orden:11, categoria:'dia2',      titulo:'Maratón de barras',         descripcion:'Un chupito en cada bar de la calle principal. Sin saltarse ninguno.',          emoji:'🏃' },
  { id:12, orden:12, categoria:'dia2',      titulo:'Chef del desayuno',         descripcion:'El novio prepara el desayuno para todos con lo que haya disponible.',          emoji:'👨‍🍳' },
  { id:13, orden:13, categoria:'dia2',      titulo:'Actividad sorpresa',        descripcion:'Actividad elegida por el grupo: karts, pádel o lo que se vote en el momento.', emoji:'🏎️' },
  { id:14, orden:14, categoria:'dia2',      titulo:'Confesión pública',         descripcion:'El novio cuenta la historia más vergonzosa de su vida. Con detalles.',         emoji:'😳' },
  { id:15, orden:15, categoria:'dia2',      titulo:'Reto del agua fría',        descripcion:'Ducha de agua fría de 2 minutos. El grupo supervisa y cronometra.',            emoji:'🚿' },
  { id:16, orden:16, categoria:'dia2',      titulo:'El artista',                descripcion:'Pintar un retrato de la novia en 5 minutos. Se envía a ella por WhatsApp.',    emoji:'🎨' },
  { id:17, orden:17, categoria:'dia2',      titulo:'Compra misteriosa',         descripcion:'El novio compra un regalo de menos de 5€ para cada miembro del grupo.',        emoji:'🛍️' },
  { id:18, orden:18, categoria:'dia2',      titulo:'Imitaciones',               descripcion:'Imitar a cada miembro del grupo 30 segundos. El grupo puntúa del 1 al 10.',    emoji:'🎭' },
  { id:19, orden:19, categoria:'dia2',      titulo:'La propuesta',              descripcion:'Recrear cómo le pidió matrimonio a la novia. Dramatización total.',             emoji:'💍' },
  { id:20, orden:20, categoria:'dia2',      titulo:'Noche del chef',            descripcion:'El novio invita a cenar. Él elige el restaurante. Paga él. Sin rechistar.',    emoji:'🍽️' },
  { id:21, orden:21, categoria:'continuas', titulo:'Sin móvil 1 hora',          descripcion:'El novio deja el móvil al grupo durante 1 hora. Ellos gestionan todo.',        emoji:'📵' },
  { id:22, orden:22, categoria:'continuas', titulo:'Rey de los shots',           descripcion:'Cada vez que alguien grita "¡Novio!" debe hacer un chupito inmediatamente.',   emoji:'👑' },
  { id:23, orden:23, categoria:'continuas', titulo:'Prenda acumulada',           descripcion:'El novio lleva una prenda ridícula elegida por el grupo hasta medianoche.',    emoji:'🤡' },
  { id:24, orden:24, categoria:'continuas', titulo:'Número de teléfono',         descripcion:'Conseguir el número de teléfono de 3 desconocidos distintos antes del final.', emoji:'📱' },
  { id:25, orden:25, categoria:'continuas', titulo:'Fotógrafo oficial',          descripcion:'El novio hace de fotógrafo del grupo durante 2 horas sin descanso ni queja.',  emoji:'📷' },
  { id:26, orden:26, categoria:'continuas', titulo:'El mensajero',               descripcion:'Entregar un mensaje escrito por el grupo a un desconocido en el siguiente bar.', emoji:'✉️' },
  { id:27, orden:27, categoria:'continuas', titulo:'Siempre de pie',             descripcion:'El novio no puede sentarse en toda la noche del día 1. El grupo vigila.',      emoji:'🧍' },
  { id:28, orden:28, categoria:'continuas', titulo:'El juez',                    descripcion:'El novio decide quién bebe en cada ronda durante 1 hora. Poder absoluto.',     emoji:'⚖️' },
  { id:29, orden:29, categoria:'continuas', titulo:'Prohibido decir "novia"',    descripcion:'Si pronuncia la palabra "novia" en voz alta: chupito. Vale toda la despedida.', emoji:'🤐' },
  { id:30, orden:30, categoria:'continuas', titulo:'El guardaespaldas',          descripcion:'Un miembro del grupo es su guardaespaldas durante 3 horas. Rol total.',        emoji:'🕴️' },
];

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS pruebas (
        id          INTEGER PRIMARY KEY,
        orden       INTEGER NOT NULL,
        categoria   TEXT    NOT NULL,
        titulo      TEXT    NOT NULL,
        descripcion TEXT    NOT NULL,
        emoji       TEXT    NOT NULL DEFAULT '🎯',
        extraida    BOOLEAN NOT NULL DEFAULT false,
        completada  BOOLEAN NOT NULL DEFAULT false,
        uso_comodin BOOLEAN NOT NULL DEFAULT false
      );
      -- Añadir columna si no existe (por si la tabla ya estaba creada)
      CREATE TABLE IF NOT EXISTS config (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // Asegurar columna uso_comodin siempre (por si la tabla existía sin ella)
    await client.query('ALTER TABLE pruebas ADD COLUMN IF NOT EXISTS uso_comodin BOOLEAN NOT NULL DEFAULT false');
    await client.query("ALTER TABLE pruebas ADD COLUMN IF NOT EXISTS comodin_quien TEXT NOT NULL DEFAULT ''");

    const { rows } = await client.query('SELECT COUNT(*) as n FROM pruebas');
    if (parseInt(rows[0].n) === 0) {
      for (const p of PRUEBAS_SEED) {
        await client.query(
          'INSERT INTO pruebas (id,orden,categoria,titulo,descripcion,emoji) VALUES ($1,$2,$3,$4,$5,$6)',
          [p.id, p.orden, p.categoria, p.titulo, p.descripcion, p.emoji]
        );
      }
      console.log('✅ Base de datos inicializada con 30 pruebas.');
    }
  } finally {
    client.release();
  }
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/pruebas
app.get('/api/pruebas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pruebas ORDER BY orden ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/pruebas/next
app.get('/api/pruebas/next', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM pruebas WHERE extraida=false ORDER BY orden ASC LIMIT 1'
    );
    res.json(rows[0] || { done: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/pruebas/:id/extraer
app.post('/api/pruebas/:id/extraer', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query(
      'SELECT * FROM pruebas WHERE extraida=false ORDER BY orden ASC LIMIT 1'
    );
    const next = rows[0];
    if (!next || next.id !== id) {
      return res.status(400).json({ error: 'No es la siguiente prueba en orden.' });
    }
    await pool.query('UPDATE pruebas SET extraida=true WHERE id=$1', [id]);
    const { rows: updated } = await pool.query('SELECT * FROM pruebas WHERE id=$1', [id]);
    res.json({ ok: true, prueba: updated[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/pruebas/:id/unextract — devolver prueba a la máquina
app.post('/api/pruebas/:id/unextract', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query('SELECT uso_comodin FROM pruebas WHERE id=$1', [id]);
    const tenia_comodin = rows[0] && rows[0].uso_comodin;
    await pool.query("UPDATE pruebas SET extraida=false, completada=false, uso_comodin=false, comodin_quien='' WHERE id=$1", [id]);
    res.json({ ok: true, devolver_comodin: tenia_comodin });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/pruebas/:id/completar
app.patch('/api/pruebas/:id/completar', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query('SELECT * FROM pruebas WHERE id=$1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrada.' });
    const nuevo = !rows[0].completada;
    // Si se está completando y se usó comodín, guardarlo; si se des-completa, limpiar
    const comodin = nuevo ? (req.body && req.body.uso_comodin ? true : false) : false;
    const quien = comodin ? (req.body.comodin_quien || '') : '';
    await pool.query(
      'UPDATE pruebas SET completada=$1, uso_comodin=$2, comodin_quien=$3 WHERE id=$4',
      [nuevo, comodin, quien, id]
    );
    res.json({ ok: true, completada: nuevo, uso_comodin: comodin, comodin_quien: quien });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/reset
app.post('/api/reset', async (req, res) => {
  try {
    const { clave } = req.body;
    if (clave !== (process.env.RESET_KEY || 'LAPURI')) {
      return res.status(403).json({ error: 'Clave incorrecta.' });
    }
    await pool.query('UPDATE pruebas SET extraida=false, completada=false');
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/config/:key
app.get('/api/config/:key', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM config WHERE key=$1', [req.params.key]);
    if (!rows[0]) return res.status(404).json({ value: null });
    res.json({ key: rows[0].key, value: rows[0].value });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/config
app.post('/api/config', async (req, res) => {
  try {
    const { key, value } = req.body;
    await pool.query(
      'INSERT INTO config (key,value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2',
      [key, value]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`🎰 Servidor en http://localhost:${PORT}`));
}).catch(err => {
  console.error('Error iniciando DB:', err.message);
  process.exit(1);
});
