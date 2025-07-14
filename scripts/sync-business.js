const { Client } = require('pg');
require('dotenv').config();

// Configuración de conexiones
const externalConfig = {
  host: process.env.EXTERNAL_DB_HOST,
  port: parseInt(process.env.EXTERNAL_DB_PORT),
  user: process.env.EXTERNAL_DB_USERNAME,
  password: process.env.EXTERNAL_DB_PASSWORD,
  database: process.env.EXTERNAL_DB_DATABASE,
  ssl: { rejectUnauthorized: false },
};

const localConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: false,
};

// Mapeo de columnas: origen (dwh.bussines_model) -> destino (public.business)
const columnMap = [
  { source: 'bussines_model_id', target: 'id' },
  { source: 'bussines_model', target: 'name' },
  { source: 'insert_date', target: 'createdAt' },
  { source: 'update_date', target: 'updatedAt' },
];

async function syncBusiness() {
  const externalClient = new Client(externalConfig);
  const localClient = new Client(localConfig);

  try {
    console.log('🔗 Conectando a base de datos EXTERNA...');
    await externalClient.connect();
    console.log('✅ Conectado a base de datos EXTERNA');

    console.log('🔗 Conectando a base de datos LOCAL...');
    await localClient.connect();
    console.log('✅ Conectado a base de datos LOCAL');

    // 1. Leer datos de dwh.bussines_model
    console.log('📥 Leyendo datos de dwh.bussines_model...');
    const { rows } = await externalClient.query('SELECT * FROM dwh.bussines_model');
    console.log(`✅ ${rows.length} registros leídos de dwh.bussines_model`);

    // Eliminar línea de borrado: await localClient.query('DELETE FROM business');
    // Insertar datos en public.business (usando el mapeo)
    if (rows.length === 0) {
      console.log('⚠️ No hay datos para insertar.');
      return;
    }
    const targetColumns = columnMap.map(m => m.target);
    const colNames = targetColumns.map(c => `"${c}"`).join(', ');
    const valuePlaceholders = targetColumns.map((_, i) => `$${i + 1}`).join(', ');
    const insertQuery = `INSERT INTO business (${colNames}) VALUES (${valuePlaceholders}) ON CONFLICT (id) DO NOTHING`;

    console.log('⬇️ Insertando datos en public.business (con mapeo de columnas)...');
    for (const row of rows) {
      const values = columnMap.map(m => {
        if (m.target === 'updatedAt') {
          // Si update_date es null, usar insert_date. Si ambos son null, usar fecha actual.
          if (row['update_date']) return row['update_date'];
          if (row['insert_date']) return row['insert_date'];
          return new Date();
        }
        return row[m.source];
      });
      await localClient.query(insertQuery, values);
    }
    console.log(`✅ ${rows.length} registros insertados en public.business`);

    console.log('🎉 Sincronización de business completada con éxito.');
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
  } finally {
    await externalClient.end();
    await localClient.end();
    console.log('🔌 Conexiones cerradas.');
  }
}

syncBusiness(); 