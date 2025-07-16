const { Client } = require('pg');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: false,
};

async function queryIncome() {
  const client = new Client(config);

  try {
    console.log('🔗 Conectando a base de datos...');
    await client.connect();
    console.log('✅ Conectado a base de datos');

    console.log('📊 Consultando tabla income...');
    const query = `
      SELECT 
        id, 
        name, 
        amount, 
        "venueId", 
        date,
        "createdAt"
      FROM income 
      ORDER BY id DESC 
      LIMIT 20
    `;
    
    const { rows } = await client.query(query);
    
    if (rows.length === 0) {
      console.log('⚠️ No hay registros en la tabla income');
    } else {
      console.log(`✅ ${rows.length} registros encontrados:`);
      console.table(rows);
    }

    // También mostrar estadísticas
    const statsQuery = `
      SELECT 
        COUNT(*) as total_records,
        SUM(amount) as total_amount,
        MIN(date) as earliest_date,
        MAX(date) as latest_date
      FROM income
    `;
    
    const statsResult = await client.query(statsQuery);
    console.log('\n📈 Estadísticas de income:');
    console.table(statsResult.rows);

  } catch (error) {
    console.error('❌ Error durante la consulta:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada.');
  }
}

queryIncome(); 