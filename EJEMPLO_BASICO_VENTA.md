# Ejemplo Básico: Crear una Venta

## Paso 1: Crear Organización

```bash
curl -X POST http://localhost:3000/organization \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Empresa"
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Mi Empresa"
}
```

## Paso 2: Crear Negocio

```bash
curl -X POST http://localhost:3000/business \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Negocio",
    "description": "Descripción del negocio",
    "address": "Calle 123",
    "phone": "+1234567890",
    "email": "info@negocio.com"
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Mi Negocio",
  "description": "Descripción del negocio",
  "address": "Calle 123",
  "phone": "+1234567890",
  "email": "info@negocio.com",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## Paso 3: Crear Usuario

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@email.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@email.com"
}
```

## Paso 4: Crear Venta (Ejemplo Básico)

```bash
curl -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Producto 1",
    "quantity": 2,
    "price": 10.00,
    "totalAmount": 20.00,
    "businessId": 1
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "productName": "Producto 1",
  "quantity": 2,
  "price": 10.00,
  "totalAmount": 20.00,
  "paymentMethod": "cash",
  "status": "completed",
  "notes": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "ticket": null,
  "createdBy": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez"
  },
  "venue": null,
  "business": {
    "id": 1,
    "name": "Mi Negocio"
  }
}
```

## Paso 5: Verificar la Venta

```bash
curl http://localhost:3000/sales/1
```

## Paso 6: Ver Todas las Ventas del Negocio

```bash
curl http://localhost:3000/sales/business/1
```

## Ejemplo Completo en un Solo Script

```bash
#!/bin/bash

echo "🚀 Creando venta básica..."

# 1. Crear organización
echo "1️⃣ Creando organización..."
ORG_RESPONSE=$(curl -s -X POST http://localhost:3000/organization \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Empresa"}')
ORG_ID=$(echo $ORG_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "✅ Organización creada con ID: $ORG_ID"

# 2. Crear negocio
echo "2️⃣ Creando negocio..."
BUSINESS_RESPONSE=$(curl -s -X POST http://localhost:3000/business \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Negocio",
    "description": "Descripción del negocio",
    "address": "Calle 123",
    "phone": "+1234567890",
    "email": "info@negocio.com"
  }')
BUSINESS_ID=$(echo $BUSINESS_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "✅ Negocio creado con ID: $BUSINESS_ID"

# 3. Crear usuario
echo "3️⃣ Creando usuario..."
USER_RESPONSE=$(curl -s -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@email.com",
    "password": "password123"
  }')
USER_ID=$(echo $USER_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "✅ Usuario creado con ID: $USER_ID"

# 4. Crear venta
echo "4️⃣ Creando venta..."
SALE_RESPONSE=$(curl -s -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Producto 1",
    "quantity": 2,
    "price": 10.00,
    "totalAmount": 20.00,
    "businessId": '$BUSINESS_ID'
  }')
SALE_ID=$(echo $SALE_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "✅ Venta creada con ID: $SALE_ID"

echo "🎉 ¡Venta creada exitosamente!"
echo "📊 Resumen:"
echo "   - Organización ID: $ORG_ID"
echo "   - Negocio ID: $BUSINESS_ID"
echo "   - Usuario ID: $USER_ID"
echo "   - Venta ID: $SALE_ID"
```

## Notas Importantes

1. **Solo necesitas el `businessId`** para crear una venta básica
2. **El sistema infere automáticamente** la organización desde el negocio
3. **Se registra automáticamente** quién creó la venta
4. **Los timestamps se generan automáticamente**
5. **Los valores por defecto** son:
   - `paymentMethod`: "cash"
   - `status`: "completed"

## Campos Obligatorios para una Venta

```json
{
  "productName": "Nombre del producto",
  "quantity": 1,
  "price": 10.00,
  "totalAmount": 10.00,
  "businessId": 1
}
```

## Campos Opcionales

```json
{
  "paymentMethod": "credit_card", // cash, credit_card, debit_card, transfer, other
  "status": "completed", // pending, completed, cancelled, refunded
  "notes": "Notas adicionales",
  "venueId": 1, // En lugar de businessId
  "ticketId": 1 // En lugar de businessId
}
``` 