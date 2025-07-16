// scripts/export-db-to-sql.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function getAllTables() {
  const res = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  return res.rows.map(r => r.table_name);
}

function escapeValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number' || typeof val === 'boolean') return val;
  // Para fechas y strings
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function exportTableData(table) {
  const res = await client.query(`SELECT * FROM "${table}"`);
  if (res.rows.length === 0) return '';
  const columns = Object.keys(res.rows[0]);
  let sql = '';
  for (const row of res.rows) {
    const values = columns.map(col => escapeValue(row[col]));
    sql += `INSERT INTO "${table}" (${columns.map(c => '"'+c+'"').join(', ')}) VALUES (${values.join(', ')});
`;
  }
  return sql;
}

async function main() {
  await client.connect();
  console.log('Conectado a la base de datos.');
  const tables = await getAllTables();
  let fullSql = '';
  for (const table of tables) {
    console.log(`Exportando datos de la tabla: ${table}`);
    fullSql += await exportTableData(table);
  }
  const outPath = path.resolve(__dirname, 'seed-data.sql');
  fs.writeFileSync(outPath, fullSql, 'utf8');
  console.log(`Exportación completada. Archivo generado: ${outPath}`);
  await client.end();
}

main().catch(err => {
  console.error('Error exportando la base de datos:', err);
  process.exit(1);
}); 