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

const roles = [
  {
    name: 'superadmin',
    description: 'Super Administrador con acceso completo al sistema',
  },
  {
    name: 'admin',
    description: 'Administrador con permisos de gestión de usuarios y roles',
  },
  {
    name: 'ceo',
    description: 'CEO con acceso a reportes y KPIs',
  },
  {
    name: 'user',
    description: 'Usuario básico con permisos limitados',
  },
];

async function initRoles() {
  const client = new Client(config);

  try {
    console.log('🔗 Conectando a base de datos...');
    await client.connect();
    console.log('✅ Conectado a base de datos');

    console.log('🏷️ Inicializando roles del sistema...');

    for (const role of roles) {
      try {
        // Verificar si el rol ya existe
        const existingRole = await client.query(
          'SELECT id, name FROM role WHERE name = $1',
          [role.name]
        );

        if (existingRole.rows.length > 0) {
          console.log(`⚠️ Rol "${role.name}" ya existe (ID: ${existingRole.rows[0].id})`);
          
          // Actualizar descripción si es necesario
          await client.query(
            'UPDATE role SET description = $1, "updatedAt" = NOW() WHERE name = $2',
            [role.description, role.name]
          );
          console.log(`✅ Descripción del rol "${role.name}" actualizada`);
        } else {
          // Crear nuevo rol
          const result = await client.query(
            'INSERT INTO role (name, description, "isActive", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, name',
            [role.name, role.description, true]
          );
          console.log(`✅ Rol "${role.name}" creado (ID: ${result.rows[0].id})`);
        }
      } catch (error) {
        console.error(`❌ Error procesando rol "${role.name}":`, error.message);
      }
    }

    // Mostrar roles existentes
    console.log('\n📋 Roles en el sistema:');
    const allRoles = await client.query('SELECT id, name, description, "isActive" FROM role ORDER BY name');
    console.table(allRoles.rows);

    console.log('\n✅ Inicialización de roles completada');

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initRoles().catch(console.error);
}

module.exports = { initRoles }; 