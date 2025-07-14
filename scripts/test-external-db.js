const { Client } = require('pg');
require('dotenv').config();

async function testExternalDatabaseConnection() {
  console.log('🔍 Probando conexión a la base de datos externa (esquema dwh)...\n');

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

  // Configuración de conexión
  const config = {
    host: process.env.EXTERNAL_DB_HOST,
    port: parseInt(process.env.EXTERNAL_DB_PORT),
    user: process.env.EXTERNAL_DB_USERNAME,
    password: process.env.EXTERNAL_DB_PASSWORD,
    database: process.env.EXTERNAL_DB_DATABASE,
    ssl: process.env.EXTERNAL_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 15000, // 15 segundos
    query_timeout: 15000
  };

  console.log('\n🔌 Configuración de conexión:');
  console.log(`Host: ${config.host}:${config.port}`);
  console.log(`Database: ${config.database}`);
  console.log(`User: ${config.user}`);
  console.log(`SSL: ${config.ssl ? 'Habilitado' : 'Deshabilitado'}`);

  const client = new Client(config);

  try {
    console.log('\n🔄 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conexión exitosa!');

    // Probar consulta simple
    console.log('\n📊 Probando consulta simple...');
    const result = await client.query('SELECT version()');
    console.log('✅ Consulta exitosa');
    console.log(`Versión de PostgreSQL: ${result.rows[0].version}`);

    // Obtener lista de tablas del esquema dwh
    console.log('\n📋 Obteniendo lista de tablas del esquema dwh...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'dwh' 
      ORDER BY table_name
    `);
    
    console.log(`✅ Encontradas ${tablesResult.rows.length} tablas en el esquema dwh:`);
    tablesResult.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.table_name}`);
    });

    // Obtener datos de muestra de las primeras 3 tablas del esquema dwh
    if (tablesResult.rows.length > 0) {
      console.log('\n📄 Obteniendo datos de muestra del esquema dwh...');
      
      for (let i = 0; i < Math.min(3, tablesResult.rows.length); i++) {
        const tableName = tablesResult.rows[i].table_name;
        try {
          const sampleResult = await client.query(`SELECT * FROM "dwh"."${tableName}" LIMIT 3`);
          console.log(`✅ Tabla "dwh.${tableName}": ${sampleResult.rows.length} registros obtenidos`);
          
          if (sampleResult.rows.length > 0) {
            console.log(`   Columnas: ${Object.keys(sampleResult.rows[0]).join(', ')}`);
            console.log(`   Primer registro:`, JSON.stringify(sampleResult.rows[0], null, 2));
          }
        } catch (tableError) {
          console.log(`❌ Error al acceder a tabla "dwh.${tableName}": ${tableError.message}`);
        }
      }
    } else {
      console.log('\n⚠️ No se encontraron tablas en el esquema dwh');
      console.log('Verificando si existe el esquema dwh...');
      
      try {
        const schemaResult = await client.query(`
          SELECT schema_name 
          FROM information_schema.schemata 
          WHERE schema_name = 'dwh'
        `);
        
        if (schemaResult.rows.length > 0) {
          console.log('✅ El esquema dwh existe pero está vacío');
        } else {
          console.log('❌ El esquema dwh no existe');
          console.log('💡 Posibles soluciones:');
          console.log('1. Verifica que el esquema dwh esté creado en la base de datos');
          console.log('2. Verifica que el usuario tenga permisos para acceder al esquema dwh');
        }
      } catch (schemaError) {
        console.log(`❌ Error al verificar esquema dwh: ${schemaError.message}`);
      }
    }

    console.log('\n🎉 ¡Prueba de conexión completada exitosamente!');
    console.log('La base de datos externa está configurada correctamente y es accesible con el esquema dwh.');

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
testExternalDatabaseConnection().catch(console.error); 