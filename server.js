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
  { id:1,  orden:1,  categoria:'continuas', titulo:'Cuidar de La Puri',              descripcion:'Debes mantener a La Puri contigo TODO el finde sin perderla.',                                                                                    emoji:'👰' },
  { id:2,  orden:2,  categoria:'continuas', titulo:'Encontrar nombres del grupo',     descripcion:'Debes encontrar personas que se llamen como los miembros del grupo. Se permite 1 comodín.',                                                       emoji:'🪪' },
  { id:3,  orden:3,  categoria:'continuas', titulo:'30 vídeos Viva La Puri',          descripcion:'Debes conseguir 30 personas diferentes diciendo en vídeo "VIVA LA PURI".',                                                                        emoji:'🎥' },
  { id:4,  orden:4,  categoria:'continuas', titulo:'3 chupitos invitados',             descripcion:'Debes conseguir que 3 personas diferentes te inviten a un chupito.',                                                                               emoji:'🥃' },
  { id:5,  orden:5,  categoria:'continuas', titulo:'Foto con 5 calvos',               descripcion:'Debes conseguir una foto brindando con 5 personas calvas.',                                                                                        emoji:'🦲' },
  { id:6,  orden:6,  categoria:'continuas', titulo:'Foto con despedidas',             descripcion:'Debes hacerte una foto con 3 despedidas distintas.',                                                                                               emoji:'📸' },
  { id:7,  orden:7,  categoria:'continuas', titulo:'Objeto random',                   descripcion:'Debes conseguir que alguien te regale un objeto y conservarlo hasta el final del finde.',                                                          emoji:'🎁' },
  { id:8,  orden:8,  categoria:'continuas', titulo:'Firma de famoso',                 descripcion:'Debes conseguir que alguien finja ser famoso y te firme la camiseta o el disfraz.',                                                               emoji:'✍️' },
  { id:9,  orden:9,  categoria:'continuas', titulo:'Selfie infiltrado x5',            descripcion:'Debes colarte en 5 fotos distintas de grupos de desconocidos.',                                                                                    emoji:'🤳' },
  { id:10, orden:10, categoria:'continuas', titulo:'Trabajando en fin de semana',     descripcion:'Debes encontrar 20 detalles constructivos mal resueltos por la ciudad, marcarlos con gommets rojos y hacer foto para el reporte final.',           emoji:'🚧' },
  { id:11, orden:11, categoria:'dia1',      titulo:'Elección de bebida',              descripcion:'Un desconocido debe decidir qué bebida vas a tomar.',                                                                                              emoji:'🍺' },
  { id:12, orden:12, categoria:'dia1',      titulo:'Intercambio de bebida',           descripcion:'Debes convencer a alguien para intercambiar bebidas contigo.',                                                                                     emoji:'🍻' },
  { id:13, orden:13, categoria:'dia1',      titulo:'Entrevista absurda',              descripcion:'Debes entrevistar a un desconocido como si fuera famoso.',                                                                                         emoji:'🎤' },
  { id:14, orden:14, categoria:'dia1',      titulo:'Poema a la cerveza',              descripcion:'Debes improvisar un poema dramático dedicado a la cerveza delante de gente.',                                                                      emoji:'📜' },
  { id:15, orden:15, categoria:'dia1',      titulo:'Confesión pública',               descripcion:'Debes contar la historia más vergonzosa de tu vida.',                                                                                              emoji:'😳' },
  { id:16, orden:16, categoria:'dia1',      titulo:'Discurso callejero',              descripcion:'Debes parar a un grupo y dar un discurso improvisado durante al menos 30 segundos.',                                                              emoji:'📢' },
  { id:17, orden:17, categoria:'dia1',      titulo:'Día caluroso',                    descripcion:'Debes conseguir 3 gafas o 3 gorras prestadas y hacerte una foto con todas puestas a la vez.',                                                     emoji:'🧢' },
  { id:18, orden:18, categoria:'dia1',      titulo:'Brindis épico',                   descripcion:'Debes ponerte en un sitio visible y hacer un discurso de brindis delante del bar.',                                                               emoji:'🥂' },
  { id:19, orden:19, categoria:'dia1',      titulo:'DJ improvisado',                  descripcion:'Debes conseguir que pongan "Me Rehuso". Si fallas, el grupo elegirá la canción.',                                                                 emoji:'🎧' },
  { id:20, orden:20, categoria:'dia1',      titulo:'Coreografía grupal',              descripcion:'Debes encontrar a la persona que baile más raro y unirte a ella.',                                                                                emoji:'🕺' },
  { id:21, orden:21, categoria:'dia1',      titulo:'Conga humana',                    descripcion:'Debes iniciar una conga y conseguir que se unan al menos 5 personas.',                                                                            emoji:'🐍' },
  { id:22, orden:22, categoria:'dia1',      titulo:'Aplauso del local',               descripcion:'Debes conseguir que una gran parte del local te aplauda.',                                                                                         emoji:'👏' },
  { id:23, orden:23, categoria:'dia1',      titulo:'El rey de los chupitos',          descripcion:'Cada vez que alguien diga "Viva el novio", debes beber un trago.',                                                                                emoji:'👑' },
  { id:24, orden:24, categoria:'dia2',      titulo:'Un buen despertar',               descripcion:'Debes darte una ducha de agua fría de 2 minutos para empezar el día.',                                                                            emoji:'🚿' },
  { id:25, orden:25, categoria:'dia2',      titulo:'Entrenamiento real',              descripcion:'Debes montar una pirámide humana de desconocidos siendo tú el vértice superior.',                                                                 emoji:'🏗️' },
  { id:26, orden:26, categoria:'dia2',      titulo:'Personaje famoso',                descripcion:'Te escribirán un personaje en la frente y debes adivinarlo preguntando solo a desconocidos.',                                                     emoji:'🎭' },
  { id:27, orden:27, categoria:'dia2',      titulo:'Bandeja nupcial',                 descripcion:'Debes hacer 30 toques con un desconocido usando las raquetas y La Puri.',                                                                         emoji:'🎾' },
  { id:28, orden:28, categoria:'dia2',      titulo:'Un puente para La Puri',          descripcion:'Debes alinear a 5 desconocidos y pasar a La Puri usando únicamente la barbilla.',                                                                emoji:'🌉' },
  { id:29, orden:29, categoria:'dia2',      titulo:'La guardería',                    descripcion:'Debes convencer a un desconocido para que cuide de La Puri durante 15 minutos.',                                                                  emoji:'🍼' },
  { id:30, orden:30, categoria:'dia2',      titulo:'La cara de La Puri',              descripcion:'Con los ojos vendados, debes recrear la cara de La Puri en la raqueta con pegatinas mientras un desconocido te guía.',                           emoji:'👀' },
  { id:31, orden:31, categoria:'dia2',      titulo:'Camarero de raqueta',             descripcion:'Debes traer bebidas usando la raqueta como bandeja. No puedes sujetar el vaso con la mano.',                                                     emoji:'🍹' },
  { id:32, orden:32, categoria:'dia2',      titulo:'Brindis sobre raqueta',           descripcion:'Debes brindar con la bebida apoyada sobre la raqueta antes de beber.',                                                                           emoji:'🥂' },
  { id:33, orden:33, categoria:'dia2',      titulo:'Karaoke con desconocidos',        descripcion:'Debes cantar una canción completa con al menos un desconocido usando la raqueta como micrófono.',                                                emoji:'🎤' },
  { id:34, orden:34, categoria:'dia2',      titulo:'Autógrafo absurdo',               descripcion:'Debes conseguir un autógrafo de alguien "famoso". Si no lo consigues, alguien debe firmarte la nalga, Richi.',                                  emoji:'✍️' },
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

    // Upsert: insertar o actualizar título/descripción/emoji/orden/categoría
    // así los cambios en PRUEBAS_SEED se aplican sin borrar el progreso (extraida/completada)
    for (const p of PRUEBAS_SEED) {
      await client.query(`
        INSERT INTO pruebas (id,orden,categoria,titulo,descripcion,emoji)
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (id) DO UPDATE SET
          orden=$2, categoria=$3, titulo=$4, descripcion=$5, emoji=$6
      `, [p.id, p.orden, p.categoria, p.titulo, p.descripcion, p.emoji]);
    }
    console.log('Pruebas sincronizadas: ' + PRUEBAS_SEED.length);
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
    const catOrder = "CASE categoria WHEN 'continuas' THEN 0 WHEN 'dia1' THEN 1 ELSE 2 END";
    const { rows } = await pool.query(
      `SELECT * FROM pruebas WHERE extraida=false ORDER BY orden ASC LIMIT 1`
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
    if (clave !== (process.env.RESET_KEY || 'lapuri')) {
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

// POST /api/pruebas — añadir nueva prueba
app.post('/api/pruebas', async (req, res) => {
  try {
    const { categoria, titulo, descripcion, emoji, insertarAntesDe } = req.body;
    if (!categoria || !titulo || !descripcion) return res.status(400).json({ error: 'Faltan campos' });
    const { rows: maxRows } = await pool.query('SELECT MAX(id) as maxid FROM pruebas');
    const newId = (maxRows[0].maxid || 0) + 1;
    let newOrden;
    if (insertarAntesDe) {
      // Obtener orden de la prueba destino, hacer hueco
      const { rows: destRows } = await pool.query('SELECT orden FROM pruebas WHERE id=$1', [insertarAntesDe]);
      if (destRows[0]) {
        newOrden = destRows[0].orden;
        // Desplazar las pruebas desde esa posición
        await pool.query('UPDATE pruebas SET orden = orden + 1 WHERE orden >= $1', [newOrden]);
      } else {
        const { rows: maxO } = await pool.query('SELECT MAX(orden) as maxorden FROM pruebas');
        newOrden = (maxO[0].maxorden || 0) + 1;
      }
    } else {
      const { rows: maxO } = await pool.query('SELECT MAX(orden) as maxorden FROM pruebas');
      newOrden = (maxO[0].maxorden || 0) + 1;
    }
    await pool.query(
      'INSERT INTO pruebas (id,orden,categoria,titulo,descripcion,emoji) VALUES ($1,$2,$3,$4,$5,$6)',
      [newId, newOrden, categoria, titulo, descripcion, emoji || '🎯']
    );
    const { rows } = await pool.query('SELECT * FROM pruebas WHERE id=$1', [newId]);
    res.json({ ok: true, prueba: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/pruebas/:id/categoria — cambiar categoría
app.patch('/api/pruebas/:id/categoria', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { categoria } = req.body;
    if (!['continuas','dia1','dia2','sorpresa'].includes(categoria)) return res.status(400).json({ error: 'Categoría inválida' });
    await pool.query('UPDATE pruebas SET categoria=$1 WHERE id=$2', [categoria, id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/pruebas/:id — borrar prueba
app.delete('/api/pruebas/:id', async (req, res) => {
  try {
    const { clave } = req.body;
    if (clave !== (process.env.RESET_KEY || 'lapuri')) return res.status(403).json({ error: 'Sin permiso' });
    const id = parseInt(req.params.id);
    await pool.query('DELETE FROM pruebas WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


// PATCH /api/pruebas/:id/editar — editar título, descripción, emoji
app.patch('/api/pruebas/:id/editar', async (req, res) => {
  try {
    const { clave, titulo, descripcion, emoji } = req.body;
    if (clave !== (process.env.RESET_KEY || 'lapuri')) return res.status(403).json({ error: 'Sin permiso' });
    const id = parseInt(req.params.id);
    const sets = [];
    const vals = [];
    let idx = 1;
    if (titulo     !== undefined) { sets.push('titulo=$'+idx++);      vals.push(titulo); }
    if (descripcion!== undefined) { sets.push('descripcion=$'+idx++); vals.push(descripcion); }
    if (emoji      !== undefined) { sets.push('emoji=$'+idx++);       vals.push(emoji); }
    if (!sets.length) return res.status(400).json({ error: 'Nada que actualizar' });
    vals.push(id);
    await pool.query('UPDATE pruebas SET '+sets.join(',')+' WHERE id=$'+idx, vals);
    const { rows } = await pool.query('SELECT * FROM pruebas WHERE id=$1', [id]);
    res.json({ ok: true, prueba: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/pruebas/:id/mover — mover a posición exacta (orden numérico)
app.patch('/api/pruebas/:id/mover', async (req, res) => {
  try {
    const { clave, nuevaPosicion } = req.body;
    if (clave !== (process.env.RESET_KEY || 'lapuri')) return res.status(403).json({ error: 'Sin permiso' });
    const id = parseInt(req.params.id);
    const pos = parseInt(nuevaPosicion);
    if (!pos || pos < 1) return res.status(400).json({ error: 'Posición inválida' });

    // Obtener todas las pruebas no extraídas ordenadas
    const { rows: all } = await pool.query('SELECT * FROM pruebas ORDER BY orden ASC');
    const noExtraidas = all.filter(p => !p.extraida);
    const extraidas   = all.filter(p =>  p.extraida);

    // Encontrar la prueba a mover
    const idx = noExtraidas.findIndex(p => p.id === id);
    if (idx === -1) return res.status(400).json({ error: 'Prueba no encontrada o ya extraída' });

    // Eliminarla y reinsertarla en la nueva posición (1-based entre no extraídas)
    const [item] = noExtraidas.splice(idx, 1);
    const insertAt = Math.min(Math.max(pos - 1, 0), noExtraidas.length);
    noExtraidas.splice(insertAt, 0, item);

    // Reasignar órdenes: extraídas mantienen su orden, no extraídas se reordenan desde max(extraidas)+1
    const baseOrden = extraidas.length > 0 ? Math.max(...extraidas.map(p => p.orden)) + 1 : 1;
    // Mejor: asignar órdenes globalmente manteniendo extraídas fijas
    // Reordenar solo las no extraídas en huecos libres
    let ordenCounter = 1;
    const client = await pool.connect();
    try {
      // Mezclar: ir asignando orden a todo en el orden correcto
      // Extraídas ya tienen su orden fijo, solo actualizamos no extraídas
      for (let i = 0; i < noExtraidas.length; i++) {
        // Buscar el siguiente orden libre (no ocupado por extraídas)
        let oVal = i + 1;
        // Asignamos secuencialmente dentro de no extraídas
        await client.query('UPDATE pruebas SET orden=$1 WHERE id=$2', [1000 + i, noExtraidas[i].id]);
      }
      // Ahora asignar órdenes reales evitando colisiones con extraídas
      const extraidasOrdenes = new Set(extraidas.map(p => p.orden));
      let seq = 1;
      for (let i = 0; i < noExtraidas.length; i++) {
        while (extraidasOrdenes.has(seq)) seq++;
        await client.query('UPDATE pruebas SET orden=$1 WHERE id=$2', [seq, noExtraidas[i].id]);
        seq++;
      }
    } finally {
      client.release();
    }

    const { rows } = await pool.query('SELECT * FROM pruebas ORDER BY orden ASC');
    res.json({ ok: true, pruebas: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/pruebas/reordenar — [{id, nuevo_orden}, ...]
app.post('/api/pruebas/reordenar', async (req, res) => {
  try {
    const { orden } = req.body; // array de {id, orden}
    if (!Array.isArray(orden)) return res.status(400).json({ error: 'Formato inválido' });
    for (const item of orden) {
      await pool.query('UPDATE pruebas SET orden=$1 WHERE id=$2 AND extraida=false', [item.orden, item.id]);
    }
    const rows = await pool.query('SELECT * FROM pruebas ORDER BY orden ASC');
    res.json({ ok: true, pruebas: rows.rows });
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
