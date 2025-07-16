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

async function syncIncomeDatesWithSales() {
  const client = new Client(config);

  try {
    console.log('🔗 Conectando a base de datos...');
    await client.connect();
    console.log('✅ Conectado a base de datos');

    // 1. Verificar ingresos que tienen saleId (ya están ligados a ventas)
    console.log('📊 Verificando ingresos ligados a ventas...');
    const linkedIncomesQuery = `
      SELECT i.id, i.name, i."saleId", i.date as income_date, s."createdAt" as sale_date
      FROM income i
      INNER JOIN sale s ON i."saleId" = s.id
      WHERE i.date != s."createdAt"::date
      ORDER BY i.id
    `;
    
    const linkedIncomes = await client.query(linkedIncomesQuery);
    console.log(`✅ ${linkedIncomes.rows.length} ingresos ligados a ventas encontrados con fechas diferentes`);

    // 2. Actualizar fechas de ingresos ligados a ventas
    if (linkedIncomes.rows.length > 0) {
      console.log('🔄 Actualizando fechas de ingresos ligados a ventas...');
      let updatedCount = 0;
      
      for (const income of linkedIncomes.rows) {
        try {
          await client.query(`
            UPDATE income 
            SET date = $1::date, "updatedAt" = NOW()
            WHERE id = $2
          `, [income.sale_date, income.id]);
          updatedCount++;
          console.log(`✅ Ingreso ${income.id} actualizado: ${income.income_date} → ${income.sale_date}`);
        } catch (error) {
          console.error(`❌ Error actualizando ingreso ${income.id}:`, error.message);
        }
      }
      console.log(`✅ ${updatedCount} ingresos actualizados con fechas de ventas`);
    }

    // 3. Crear ingresos para ventas que no tienen ingreso asociado
    console.log('📊 Verificando ventas sin ingresos asociados...');
    const salesWithoutIncomeQuery = `
      SELECT s.id, s."productName", s."totalAmount", s."createdAt", s."venueId", v.name as venue_name
      FROM sale s
      LEFT JOIN venue v ON s."venueId" = v.id
      WHERE NOT EXISTS (
        SELECT 1 FROM income i WHERE i."saleId" = s.id
      )
      ORDER BY s."createdAt" DESC
      LIMIT 50
    `;
    
    const salesWithoutIncome = await client.query(salesWithoutIncomeQuery);
    console.log(`✅ ${salesWithoutIncome.rows.length} ventas sin ingresos asociados encontradas`);

    // 4. Crear ingresos para ventas sin ingreso
    if (salesWithoutIncome.rows.length > 0) {
      console.log('💰 Creando ingresos para ventas sin ingreso asociado...');
      let createdCount = 0;
      
      for (const sale of salesWithoutIncome.rows) {
        try {
          await client.query(`
            INSERT INTO income (
              name, amount, category, status, date, "venueId", "saleId", 
              "createdAt", "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          `, [
            `Venta: ${sale.productName}`,
            sale.totalAmount,
            'ticket_sales',
            'received',
            sale.createdAt,
            sale.venueId,
            sale.id
          ]);
          createdCount++;
          console.log(`✅ Ingreso creado para venta ${sale.id}: ${sale.productName} - $${sale.totalAmount}`);
        } catch (error) {
          console.error(`❌ Error creando ingreso para venta ${sale.id}:`, error.message);
        }
      }
      console.log(`✅ ${createdCount} ingresos creados para ventas`);
    }

    // 5. Mostrar estadísticas finales
    console.log('\n📈 Estadísticas finales:');
    
    const statsQuery = `
      SELECT 
        COUNT(*) as total_income,
        COUNT(CASE WHEN "saleId" IS NOT NULL THEN 1 END) as linked_to_sales,
        COUNT(CASE WHEN "saleId" IS NULL THEN 1 END) as not_linked_to_sales,
        MIN(date) as earliest_date,
        MAX(date) as latest_date
      FROM income
    `;
    
    const stats = await client.query(statsQuery);
    console.table(stats.rows);

    // 6. Mostrar distribución por fechas
    console.log('\n📅 Distribución de ingresos por fechas:');
    const dateDistributionQuery = `
      SELECT 
        date,
        COUNT(*) as income_count,
        SUM(amount) as total_amount
      FROM income
      GROUP BY date
      ORDER BY date DESC
      LIMIT 10
    `;
    
    const dateDistribution = await client.query(dateDistributionQuery);
    console.table(dateDistribution.rows);

    console.log('🎉 Sincronización de fechas completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada.');
  }
}

syncIncomeDatesWithSales(); 