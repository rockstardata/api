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

async function syncSales() {
  const externalClient = new Client(externalConfig);
  const localClient = new Client(localConfig);

  try {
    console.log('🔗 Conectando a base de datos EXTERNA...');
    await externalClient.connect();
    console.log('✅ Conectado a base de datos EXTERNA');

    console.log('🔗 Conectando a base de datos LOCAL...');
    await localClient.connect();
    console.log('✅ Conectado a base de datos LOCAL');

    // 1. JOIN entre sales_details y sales_header (solo columnas existentes)
    console.log('📥 Leyendo y uniendo datos de dwh.sales_details y dwh.sales_header...');
    const joinQuery = `
      SELECT
        sd.sales_detail_id,
        sd.product_id,
        sd.quantity,
        sd.product_price,
        sd.product_total_price,
        sd.insert_date,
        sd.update_date,
        sd.venue_id,
        sd.company_id,
        sh.total_amount,
        sh.insert_date as header_insert_date,
        sh.update_date as header_update_date
      FROM dwh.sales_details sd
      LEFT JOIN dwh.sales_header sh ON sd.sales_header_id = sh.sales_header_id
    `;
    const { rows } = await externalClient.query(joinQuery);
    console.log(`✅ ${rows.length} registros leídos y unidos`);

    // Eliminar línea de borrado: await localClient.query('DELETE FROM sale');
    // Insertar datos en public.sale (mapeo)
    if (rows.length === 0) {
      console.log('⚠️ No hay datos para insertar.');
      return;
    }

    const targetColumns = [
      'id', 'productName', 'quantity', 'price', 'totalAmount', 'paymentMethod', 'status', 'notes', 'createdAt', 'updatedAt', 'createdById', 'venueId', 'businessId'
    ];
    const colNames = targetColumns.map(c => `"${c}"`).join(', ');
    const valuePlaceholders = targetColumns.map((_, i) => `$${i + 1}`).join(', ');
    const insertQuery = `INSERT INTO sale (${colNames}) VALUES (${valuePlaceholders}) ON CONFLICT (id) DO NOTHING`;

    console.log('⬇️ Insertando datos en public.sale (con mapeo de columnas)...');
    for (const row of rows) {
      const now = new Date();
      const values = [
        row['sales_detail_id'], // id
        row['product_id'] ? String(row['product_id']) : null, // productName (puedes mejorar esto si tienes lookup de productos)
        row['quantity'],
        row['product_price'],
        row['product_total_price'] || row['total_amount'],
        'cash', // paymentMethod por defecto
        'completed', // status por defecto
        null, // notes por defecto
        row['insert_date'] ? row['insert_date'] : (row['header_insert_date'] ? row['header_insert_date'] : now),
        row['update_date'] ? row['update_date'] : (row['header_update_date'] ? row['header_update_date'] : (row['insert_date'] ? row['insert_date'] : now)),
        null, // createdById por defecto
        row['venue_id'] || null,
        row['company_id'] || null,
      ];
      await localClient.query(insertQuery, values);
    }
    console.log(`✅ ${rows.length} registros insertados en public.sale`);

    console.log('🎉 Sincronización de sales completada con éxito.');
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
  } finally {
    await externalClient.end();
    await localClient.end();
    console.log('🔌 Conexiones cerradas.');
  }
}

syncSales(); 