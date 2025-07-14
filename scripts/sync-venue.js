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

// Mapeo de columnas: origen (dwh.venue) -> destino (public.venue)
const columnMap = [
  { source: 'venue_id', target: 'id' },
  { source: 'venue_name', target: 'name' },
  { source: 'company_id', target: 'companyId' },
  { source: 'active', target: 'isActive' },
  { source: 'insert_date', target: 'createdAt' },
  { source: 'update_date', target: 'updatedAt' },
];

// Valores ficticios para los campos locales sin equivalente externo
const defaultFields = {
  description: 'Local de Barcelona',
  address: 'Carrer de Barcelona, 123',
  phone: '+34 600 000 000',
  email: 'info@barcelona.local',
};

async function syncVenue() {
  const externalClient = new Client(externalConfig);
  const localClient = new Client(localConfig);

  try {
    console.log('🔗 Conectando a base de datos EXTERNA...');
    await externalClient.connect();
    console.log('✅ Conectado a base de datos EXTERNA');

    console.log('🔗 Conectando a base de datos LOCAL...');
    await localClient.connect();
    console.log('✅ Conectado a base de datos LOCAL');

    // 1. Leer datos de dwh.venue
    console.log('📥 Leyendo datos de dwh.venue...');
    const { rows } = await externalClient.query('SELECT * FROM dwh.venues');
    console.log(`✅ ${rows.length} registros leídos de dwh.venue`);

    // Eliminar línea de borrado: await localClient.query('DELETE FROM venue');
    // Insertar datos en public.venue (usando el mapeo y valores ficticios)
    if (rows.length === 0) {
      console.log('⚠️ No hay datos para insertar.');
      return;
    }
    const targetColumns = [
      'id', 'name', 'description', 'address', 'phone', 'email', 'isActive', 'createdAt', 'updatedAt', 'companyId'
    ];
    const colNames = targetColumns.map(c => `"${c}"`).join(', ');
    const valuePlaceholders = targetColumns.map((_, i) => `$${i + 1}`).join(', ');
    const insertQuery = `INSERT INTO venue (${colNames}) VALUES (${valuePlaceholders}) ON CONFLICT (id) DO NOTHING`;

    console.log('⬇️ Insertando datos en public.venue (con mapeo de columnas y datos ficticios)...');
    for (const row of rows) {
      const now = new Date();
      const values = [
        row['venue_id'],
        row['venue_name'],
        defaultFields.description,
        defaultFields.address,
        defaultFields.phone,
        defaultFields.email,
        row['active'],
        row['insert_date'] ? row['insert_date'] : now,
        row['update_date'] ? row['update_date'] : (row['insert_date'] ? row['insert_date'] : now),
        row['company_id'],
      ];
      await localClient.query(insertQuery, values);
    }
    console.log(`✅ ${rows.length} registros insertados en public.venue`);

    console.log('🎉 Sincronización de venue completada con éxito.');
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
  } finally {
    await externalClient.end();
    await localClient.end();
    console.log('🔌 Conexiones cerradas.');
  }
}

syncVenue(); 