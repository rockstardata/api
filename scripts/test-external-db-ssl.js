const { Client } = require('pg');
require('dotenv').config();

async function testExternalDatabaseConnectionWithSSL() {
  console.log('🔍 Probando conexión a la base de datos externa con SSL (esquema dwh)...\n');

  // Verificar variables de entorno
  const requiredEnvVars = [
    'EXTERNAL_DB_HOST',
    'EXTERNAL_DB_PORT', 
    'EXTERNAL_DB_USERNAME',
    'EXTERNAL_DB_PASSWORD',
    'EXTERNAL_DB_DATABASE'
  ];

  console.log('📋 Variables de entorno requeridas:');
  const missingVars = [];
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${varName.includes('PASSWORD') ? '***' : value}`);
    } else {
      console.log(`❌ ${varName}: NO CONFIGURADA`);
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log(`\n❌ Faltan variables de entorno: ${missingVars.join(', ')}`);
    console.log('Por favor, configura estas variables en tu archivo .env');
    return;
  }

  // Configuración de conexión CON SSL
  const config = {
    host: process.env.EXTERNAL_DB_HOST,
    port: parseInt(process.env.EXTERNAL_DB_PORT),
    user: process.env.EXTERNAL_DB_USERNAME,
    password: process.env.EXTERNAL_DB_PASSWORD,
    database: process.env.EXTERNAL_DB_DATABASE,
    ssl: {
      rejectUnauthorized: false, // Para AWS RDS
      ca: undefined,
      key: undefined,
      cert: undefined
    },
    connectionTimeoutMillis: 15000, // 15 segundos
    query_timeout: 15000
  };

  const schema = 'dwh';

  console.log(`\n🔌 Configuración de conexión (CON SSL, esquema: ${schema}):`);
  console.log(`Host: ${config.host}:${config.port}`);
  console.log(`Database: ${config.database}`);
  console.log(`User: ${config.user}`);
  console.log(`SSL: Habilitado (rejectUnauthorized: false)`);

  const client = new Client(config);

  try {
    console.log(`\n🔄 Conectando a la base de datos con SSL y usando el esquema '${schema}'...`);
    await client.connect();
    console.log('✅ Conexión exitosa con SSL!');

    // Probar consulta simple
    console.log('\n📊 Probando consulta simple...');
    const result = await client.query('SELECT version()');
    console.log('✅ Consulta exitosa');
    console.log(`Versión de PostgreSQL: ${result.rows[0].version}`);

    // Obtener información de la conexión SSL
    console.log('\n🔐 Información de SSL:');
    const sslInfo = await client.query('SHOW ssl');
    console.log(`SSL activo: ${sslInfo.rows[0].ssl}`);

    // Obtener lista de tablas del esquema dwh
    console.log(`\n📋 Obteniendo lista de tablas del esquema '${schema}'...`);
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${schema}' 
      ORDER BY table_name
    `);
    
    console.log(`✅ Encontradas ${tablesResult.rows.length} tablas en el esquema '${schema}':`);
    tablesResult.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.table_name}`);
    });

    // Obtener datos de muestra de las primeras 3 tablas del esquema dwh
    if (tablesResult.rows.length > 0) {
      console.log(`\n📄 Obteniendo datos de muestra del esquema '${schema}'...`);
      
      for (let i = 0; i < Math.min(3, tablesResult.rows.length); i++) {
        const tableName = tablesResult.rows[i].table_name;
        try {
          const sampleResult = await client.query(`SELECT * FROM "${schema}"."${tableName}" LIMIT 3`);
          console.log(`✅ Tabla "${schema}.${tableName}": ${sampleResult.rows.length} registros obtenidos`);
          
          if (sampleResult.rows.length > 0) {
            console.log(`   Columnas: ${Object.keys(sampleResult.rows[0]).join(', ')}`);
            console.log(`   Primer registro:`, JSON.stringify(sampleResult.rows[0], null, 2));
          }
        } catch (tableError) {
          console.log(`❌ Error al acceder a tabla "${schema}.${tableName}": ${tableError.message}`);
        }
      }
    }

    console.log(`\n🎉 ¡Prueba de conexión con SSL y esquema '${schema}' completada exitosamente!`);
    console.log(`La base de datos externa está configurada correctamente y es accesible con SSL y el esquema '${schema}'.`);

  } catch (error) {
    console.log('\n❌ Error de conexión:');
    console.log(`Mensaje: ${error.message}`);
    console.log(`Código: ${error.code}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Posibles soluciones:');
      console.log('1. Verifica que el servidor de base de datos esté ejecutándose');
      console.log('2. Verifica que el puerto sea correcto');
      console.log('3. Verifica que el firewall no esté bloqueando la conexión');
    } else if (error.code === '28P01') {
      console.log('\n💡 Posibles soluciones:');
      console.log('1. Verifica el usuario y contraseña');
      console.log('2. Verifica que el usuario tenga permisos para acceder a la base de datos');
    } else if (error.code === '3D000') {
      console.log('\n💡 Posibles soluciones:');
      console.log('1. Verifica que el nombre de la base de datos sea correcto');
      console.log('2. Verifica que la base de datos exista');
    } else if (error.code === '28000') {
      console.log('\n💡 Posibles soluciones para AWS RDS:');
      console.log('1. Verifica que tu IP esté en el Security Group de AWS RDS');
      console.log('2. Verifica que el Security Group permita conexiones desde tu IP');
      console.log('3. Verifica que la base de datos esté configurada para aceptar conexiones SSL');
      console.log('4. Contacta al administrador de AWS para verificar la configuración de red');
    }
  } finally {
    await client.end();
    console.log('\n🔌 Conexión cerrada.');
  }
}

// Ejecutar la prueba
testExternalDatabaseConnectionWithSSL().catch(console.error); 