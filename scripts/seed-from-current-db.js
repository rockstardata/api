// scripts/seed-from-current-db.js
const { DataSource } = require('typeorm');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Entidades principales
const entities = [
  require('../src/organization/entities/organization.entity').Organization,
  require('../src/company/entities/company.entity').Company,
  require('../src/users/entities/user.entity').User,
  require('../src/venue/entities/venue.entity').Venue,
  require('../src/business/entities/business.entity').Business,
  require('../src/tickets/entities/ticket.entity').Ticket,
  require('../src/sales/entities/sale.entity').Sale,
  require('../src/income/entities/income.entity').Income,
  require('../src/costs/entities/cost.entity').Cost,
  require('../src/agreements/entities/agreement.entity').Agreement,
  require('../src/kpis/entities/kpi.entity').Kpi,
];

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities,
  synchronize: false,
});

async function main() {
  await dataSource.initialize();
  console.log('Conectado a la base de datos local.');

  // Exportar datos de cada entidad
  const exportData = {};
  for (const entity of entities) {
    const repo = dataSource.getRepository(entity);
    const rows = await repo.find();
    if (rows.length > 0) {
      exportData[entity.name] = rows;
      console.log(`Exportados ${rows.length} registros de ${entity.name}`);
    }
  }

  // Guardar los datos en un archivo temporal
  const fs = require('fs');
  const exportPath = path.resolve(__dirname, 'seed-data.json');
  fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
  console.log(`Datos exportados a ${exportPath}`);

  // Ahora, importar los datos en la base de datos local (idempotente)
  for (const entity of entities) {
    const repo = dataSource.getRepository(entity);
    const rows = exportData[entity.name] || [];
    for (const row of rows) {
      // Verificar si ya existe por ID
      const exists = await repo.findOneBy({ id: row.id });
      if (!exists) {
        // Eliminar campos de solo lectura
        delete row.createdAt;
        delete row.updatedAt;
        // Insertar
        await repo.save(row);
        console.log(`Insertado ${entity.name} con id ${row.id}`);
      }
    }
  }

  console.log('Seed completado.');
  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Error en el seed:', err);
  process.exit(1);
}); 