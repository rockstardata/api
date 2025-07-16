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

// Datos de ventas que proporcionaste
const salesData = [
  { id: 49620, productId: "119", amount: 16.00, venueId: 3, date: "2024-07-05" },
  { id: 49621, productId: "97", amount: 9.00, venueId: 3, date: "2024-07-05" },
  { id: 49622, productId: "97", amount: 9.00, venueId: 3, date: "2024-07-05" },
  { id: 49623, productId: "108", amount: 17.00, venueId: 3, date: "2024-07-05" },
  { id: 49624, productId: "108", amount: 17.00, venueId: 3, date: "2024-07-05" },
  { id: 49625, productId: "121", amount: 15.00, venueId: 3, date: "2024-07-05" },
  { id: 49626, productId: "121", amount: 15.00, venueId: 3, date: "2024-07-05" },
  { id: 49627, productId: "14", amount: 3.75, venueId: 3, date: "2024-07-05" },
  { id: 49628, productId: "14", amount: 3.75, venueId: 3, date: "2024-07-05" },
  { id: 49629, productId: "106", amount: 17.00, venueId: 3, date: "2024-07-05" },
  { id: 49630, productId: "106", amount: 17.00, venueId: 3, date: "2024-07-05" },
  { id: 49631, productId: "198", amount: 2.50, venueId: 3, date: "2024-07-05" },
  { id: 49632, productId: "198", amount: 2.50, venueId: 3, date: "2024-07-05" },
  { id: 49633, productId: "198", amount: 2.50, venueId: 3, date: "2024-07-05" },
  { id: 49634, productId: "198", amount: 2.50, venueId: 3, date: "2024-07-05" },
  { id: 49636, productId: "102", amount: 18.00, venueId: 5, date: "2024-07-05" },
  { id: 49638, productId: "120", amount: 16.00, venueId: 5, date: "2024-07-05" },
  { id: 49640, productId: "15", amount: 2.25, venueId: 5, date: "2024-07-05" },
  { id: 49642, productId: "122", amount: 16.00, venueId: 5, date: "2024-07-05" },
  { id: 49644, productId: "124", amount: 17.00, venueId: 5, date: "2024-07-05" },
  // Agregar más datos según necesites...
];

async function generarIngresosDesdeVentas() {
  const client = new Client(config);

  try {
    console.log('🔗 Conectando a base de datos...');
    await client.connect();
    console.log('✅ Conectado a base de datos');

    // Primero verificar qué venues existen
    console.log('🏢 Verificando venues existentes...');
    const venuesQuery = 'SELECT id, name FROM venue ORDER BY id';
    const venuesResult = await client.query(venuesQuery);
    console.log(`✅ ${venuesResult.rows.length} venues encontrados:`);
    console.table(venuesResult.rows);

    // Generar ingresos a partir de los datos de ventas
    console.log('💰 Generando registros de ingresos...');
    
    const insertQuery = `
      INSERT INTO income (
        name, 
        amount, 
        "venueId", 
        date, 
        category, 
        status,
        "createdAt",
        "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `;

    let insertedCount = 0;
    for (const sale of salesData) {
      // Verificar si el venue existe
      const venueExists = venuesResult.rows.some(v => v.id === sale.venueId);
      if (!venueExists) {
        console.log(`⚠️ Venue ID ${sale.venueId} no existe, saltando venta ${sale.id}`);
        continue;
      }

      const values = [
        `Venta Producto ${sale.productId}`, // name
        sale.amount, // amount
        sale.venueId, // venueId
        sale.date, // date
        'ticket_sales', // category
        'received', // status
        new Date(), // createdAt
        new Date()  // updatedAt
      ];

      try {
        await client.query(insertQuery, values);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error insertando venta ${sale.id}:`, error.message);
      }
    }

    console.log(`✅ ${insertedCount} registros de ingresos generados exitosamente`);

    // Mostrar estadísticas finales
    const statsQuery = `
      SELECT 
        COUNT(*) as total_ingresos,
        SUM(amount) as total_monto,
        MIN(date) as fecha_mas_antigua,
        MAX(date) as fecha_mas_reciente
      FROM income
    `;
    
    const statsResult = await client.query(statsQuery);
    console.log('\n📈 Estadísticas finales de ingresos:');
    console.table(statsResult.rows);

  } catch (error) {
    console.error('❌ Error durante la generación de ingresos:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada.');
  }
}

generarIngresosDesdeVentas(); 