const { Client } = require('pg');
require('dotenv').config();

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

async function updateSaleDates() {
  const externalClient = new Client(externalConfig);
  const localClient = new Client(localConfig);

  try {
    await externalClient.connect();
    await localClient.connect();

    // 1. Leer IDs y fechas de la base externa (usando la columna 'date')
    const { rows } = await externalClient.query(`
      SELECT sales_detail_id, date
      FROM dwh.sales_details
      WHERE date IS NOT NULL
    `);

    // 2. Actualizar la tabla local
    let updated = 0;
    for (const row of rows) {
      const res = await localClient.query(
        `UPDATE sale SET "createdAt" = $1 WHERE id = $2`,
        [row.date, row.sales_detail_id]
      );
      if (res.rowCount > 0) updated++;
    }

    console.log(`Actualizadas ${updated} fechas en la tabla sale.`);
  } catch (error) {
    console.error('Error actualizando fechas:', error.message);
  } finally {
    await externalClient.end();
    await localClient.end();
  }
}

updateSaleDates(); 