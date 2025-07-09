# Ejemplos con cURL: Crear Venta Completa

## Ejemplo 1: Venta Simple con Negocio

```bash
# 1. Crear organización
curl -X POST http://localhost:3000/organization \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Restaurante S.A."
  }'

# 2. Crear negocio
curl -X POST http://localhost:3000/business \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurante Principal",
    "description": "Restaurante en el centro",
    "address": "Calle 123",
    "phone": "+1234567890",
    "email": "info@restaurante.com"
  }'

# 3. Crear usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ana",
    "lastName": "García",
    "email": "ana@restaurante.com",
    "password": "password123"
  }'

# 4. Asignar permisos
curl -X POST http://localhost:3000/permissions/sales/business/1/user/1

# 5. Crear venta
curl -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Hamburguesa",
    "quantity": 1,
    "price": 12.00,
    "totalAmount": 12.00,
    "businessId": 1
  }'
```

## Ejemplo 2: Venta con Local y Ticket

```bash
# 1. Crear local
curl -X POST http://localhost:3000/venue \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sucursal Norte",
    "businessId": 1
  }'

# 2. Crear ticket
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "totalAmount": 25.50,
    "status": "paid",
    "customerName": "Carlos López",
    "customerEmail": "carlos@email.com",
    "venueId": 1
  }'

# 3. Crear venta asociada al ticket
curl -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Pizza Margherita",
    "quantity": 1,
    "price": 18.00,
    "totalAmount": 18.00,
    "paymentMethod": "credit_card",
    "ticketId": 1
  }'
```

## Ejemplo 3: Venta con Local Directo

```bash
# Crear venta directamente asociada a un local
curl -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Café Americano",
    "quantity": 2,
    "price": 4.50,
    "totalAmount": 9.00,
    "paymentMethod": "cash",
    "venueId": 1
  }'
```

## Verificar Resultados

```bash
# Ver la venta creada
curl http://localhost:3000/sales/1

# Ver todas las ventas del negocio
curl http://localhost:3000/sales/business/1

# Ver todas las ventas del local
curl http://localhost:3000/sales/venue/1

# Ver resumen de ventas
curl http://localhost:3000/sales/summary?businessId=1
```

## Respuesta Esperada

Al crear una venta, deberías recibir algo como:

```json
{
  "id": 1,
  "productName": "Hamburguesa",
  "quantity": 1,
  "price": 12.00,
  "totalAmount": 12.00,
  "paymentMethod": "cash",
  "status": "completed",
  "notes": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "ticket": null,
  "createdBy": {
    "id": 1,
    "firstName": "Ana",
    "lastName": "García"
  },
  "venue": {
    "id": 1,
    "name": "Sucursal Norte"
  },
  "business": {
    "id": 1,
    "name": "Restaurante Principal",
    "organization": {
      "id": 1,
      "name": "Mi Restaurante S.A."
    }
  }
}
```

## Notas Importantes

1. **Solo necesitas especificar UNA relación**: `businessId`, `venueId`, o `ticketId`
2. **El sistema infere automáticamente** las otras relaciones
3. **Los timestamps se generan automáticamente**
4. **Se valida que los recursos existan** antes de crear la venta
5. **Se registra automáticamente** quién creó la venta

## Flujo Recomendado

1. **Crear organización** (una vez)
2. **Crear negocio** (asociado a la organización)
3. **Crear local** (asociado al negocio)
4. **Crear usuario** (una vez)
5. **Asignar permisos** (al usuario para el negocio/local)
6. **Crear ventas** (asociadas al negocio, local o ticket) 