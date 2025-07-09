// Script de ejemplo: Crear una venta completa con organización, negocio y usuario
// Ejecutar con: node scripts/ejemplo-venta-completa.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function crearVentaCompleta() {
  try {
    console.log('🚀 Iniciando creación de venta completa...\n');

    // Paso 1: Crear Organización
    console.log('1️⃣ Creando organización...');
    const organizacion = await axios.post(`${BASE_URL}/organization`, {
      name: 'Restaurantes Deliciosos S.A.'
    });
    console.log(`✅ Organización creada: ${organizacion.data.name} (ID: ${organizacion.data.id})\n`);

    // Paso 2: Crear Negocio
    console.log('2️⃣ Creando negocio...');
    const negocio = await axios.post(`${BASE_URL}/business`, {
      name: 'Restaurante Centro',
      description: 'Restaurante en el centro de la ciudad',
      address: 'Calle Principal 123',
      phone: '+1234567890',
      email: 'centro@restaurante.com',
      organizationId: organizacion.data.id
    });
    console.log(`✅ Negocio creado: ${negocio.data.name} (ID: ${negocio.data.id})\n`);

    // Paso 3: Crear Local
    console.log('3️⃣ Creando local...');
    const local = await axios.post(`${BASE_URL}/venue`, {
      name: 'Sucursal Centro - Planta Baja',
      businessId: negocio.data.id
    });
    console.log(`✅ Local creado: ${local.data.name} (ID: ${local.data.id})\n`);

    // Paso 4: Crear Usuario
    console.log('4️⃣ Creando usuario...');
    const usuario = await axios.post(`${BASE_URL}/users`, {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@restaurante.com',
      password: 'password123'
    });
    console.log(`✅ Usuario creado: ${usuario.data.firstName} ${usuario.data.lastName} (ID: ${usuario.data.id})\n`);

    // Paso 5: Asignar Permisos
    console.log('5️⃣ Asignando permisos...');
    await axios.post(`${BASE_URL}/permissions/sales/business/${negocio.data.id}/user/${usuario.data.id}`);
    await axios.post(`${BASE_URL}/permissions/sales/business/${negocio.data.id}/user/${usuario.data.id}?permissionType=create_sales`);
    console.log(`✅ Permisos asignados al usuario ${usuario.data.id} para el negocio ${negocio.data.id}\n`);

    // Paso 6: Crear Ticket (Opcional)
    console.log('6️⃣ Creando ticket...');
    const ticket = await axios.post(`${BASE_URL}/tickets`, {
      totalAmount: 45.50,
      status: 'paid',
      customerName: 'María García',
      customerEmail: 'maria@email.com',
      venueId: local.data.id
    });
    console.log(`✅ Ticket creado: ${ticket.data.id} para ${ticket.data.customerName}\n`);

    // Paso 7: Crear Venta
    console.log('7️⃣ Creando venta...');
    const venta = await axios.post(`${BASE_URL}/sales`, {
      productName: 'Ensalada César',
      quantity: 2,
      price: 15.25,
      totalAmount: 30.50,
      paymentMethod: 'credit_card',
      status: 'completed',
      notes: 'Sin crutones por alergia',
      ticketId: ticket.data.id
    });
    console.log(`✅ Venta creada: ${venta.data.productName} (ID: ${venta.data.id})\n`);

    // Paso 8: Verificar la venta creada
    console.log('8️⃣ Verificando venta creada...');
    const ventaVerificada = await axios.get(`${BASE_URL}/sales/${venta.data.id}`);
    
    console.log('📋 Detalles de la venta:');
    console.log(`   - Producto: ${ventaVerificada.data.productName}`);
    console.log(`   - Cantidad: ${ventaVerificada.data.quantity}`);
    console.log(`   - Precio: $${ventaVerificada.data.price}`);
    console.log(`   - Total: $${ventaVerificada.data.totalAmount}`);
    console.log(`   - Método de pago: ${ventaVerificada.data.paymentMethod}`);
    console.log(`   - Estado: ${ventaVerificada.data.status}`);
    console.log(`   - Notas: ${ventaVerificada.data.notes}`);
    console.log(`   - Creado por: ${ventaVerificada.data.createdBy?.firstName} ${ventaVerificada.data.createdBy?.lastName}`);
    console.log(`   - Local: ${ventaVerificada.data.venue?.name}`);
    console.log(`   - Negocio: ${ventaVerificada.data.business?.name}`);
    console.log(`   - Organización: ${ventaVerificada.data.business?.organization?.name}\n`);

    // Paso 9: Consultar ventas por diferentes criterios
    console.log('9️⃣ Consultando ventas por diferentes criterios...');
    
    const ventasNegocio = await axios.get(`${BASE_URL}/sales/business/${negocio.data.id}`);
    console.log(`   - Ventas del negocio: ${ventasNegocio.data.length} ventas`);
    
    const ventasLocal = await axios.get(`${BASE_URL}/sales/venue/${local.data.id}`);
    console.log(`   - Ventas del local: ${ventasLocal.data.length} ventas`);
    
    const resumenVentas = await axios.get(`${BASE_URL}/sales/summary?businessId=${negocio.data.id}`);
    console.log(`   - Resumen: ${resumenVentas.data.totalSales} ventas, $${resumenVentas.data.totalAmount} total\n`);

    console.log('🎉 ¡Venta completa creada exitosamente!');
    console.log('\n📊 Resumen de entidades creadas:');
    console.log(`   - Organización: ${organizacion.data.name}`);
    console.log(`   - Negocio: ${negocio.data.name}`);
    console.log(`   - Local: ${local.data.name}`);
    console.log(`   - Usuario: ${usuario.data.firstName} ${usuario.data.lastName}`);
    console.log(`   - Ticket: #${ticket.data.id}`);
    console.log(`   - Venta: ${venta.data.productName}`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Ejecutar el script
crearVentaCompleta(); 