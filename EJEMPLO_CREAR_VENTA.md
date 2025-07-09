# Ejemplo: Crear una Venta con Organización, Negocio y Usuario

## Paso a Paso para Crear una Venta Completa

### 1. Estructura de Datos Necesaria

Antes de crear una venta, necesitas tener:

```
Organización (1) → Negocio (N) → Local (N) → Ticket (N) → Venta (N)
     ↓
   Usuario (N)
```

### 2. Ejemplos de Creación de Venta

#### Opción A: Venta Asociada a un Ticket Existente

```bash
POST /sales
Content-Type: application/json

{
  "productName": "Hamburguesa Clásica",
  "quantity": 2,
  "price": 12.50,
  "totalAmount": 25.00,
  "paymentMethod": "credit_card",
  "status": "completed",
  "notes": "Cliente VIP - Descuento aplicado",
  "ticketId": 5
}
```

**Resultado:**
- La venta se asocia automáticamente al ticket 5
- El ticket ya tiene asociado un local y negocio
- Se registra automáticamente la relación con la organización

#### Opción B: Venta Asociada Directamente a un Local

```bash
POST /sales
Content-Type: application/json

{
  "productName": "Pizza Margherita",
  "quantity": 1,
  "price": 18.00,
  "totalAmount": 18.00,
  "paymentMethod": "cash",
  "status": "completed",
  "venueId": 3
}
```

**Resultado:**
- La venta se asocia al local 3
- Se infiere automáticamente el negocio del local
- Se infiere automáticamente la organización del negocio

#### Opción C: Venta Asociada Directamente a un Negocio

```bash
POST /sales
Content-Type: application/json

{
  "productName": "Café Americano",
  "quantity": 3,
  "price": 4.50,
  "totalAmount": 13.50,
  "paymentMethod": "debit_card",
  "status": "completed",
  "businessId": 2
}
```

**Resultado:**
- La venta se asocia directamente al negocio 2
- Se infiere automáticamente la organización del negocio

### 3. Ejemplo Completo con Todas las Entidades

#### Paso 1: Crear Organización
```bash
POST /organization
{
  "name": "Restaurantes Deliciosos S.A."
}
```

#### Paso 2: Crear Negocio
```bash
POST /business
{
  "name": "Restaurante Centro",
  "description": "Restaurante en el centro de la ciudad",
  "address": "Calle Principal 123",
  "phone": "+1234567890",
  "email": "centro@restaurante.com",
  "organizationId": 1
}
```

#### Paso 3: Crear Local
```bash
POST /venue
{
  "name": "Sucursal Centro - Planta Baja",
  "businessId": 1
}
```

#### Paso 4: Crear Usuario
```bash
POST /users
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@restaurante.com",
  "password": "password123"
}
```

#### Paso 5: Asignar Permisos al Usuario
```bash
# Dar permisos para ver ventas del negocio
POST /permissions/sales/business/1/user/1

# Dar permisos para crear ventas
POST /permissions/sales/business/1/user/1?permissionType=create_sales
```

#### Paso 6: Crear Ticket (Opcional)
```bash
POST /tickets
{
  "totalAmount": 45.50,
  "status": "paid",
  "customerName": "María García",
  "customerEmail": "maria@email.com",
  "venueId": 1
}
```

#### Paso 7: Crear Venta
```bash
POST /sales
{
  "productName": "Ensalada César",
  "quantity": 2,
  "price": 15.25,
  "totalAmount": 30.50,
  "paymentMethod": "credit_card",
  "status": "completed",
  "notes": "Sin crutones por alergia",
  "ticketId": 1
}
```

### 4. Verificar la Venta Creada

```bash
GET /sales/1
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "productName": "Ensalada César",
  "quantity": 2,
  "price": 15.25,
  "totalAmount": 30.50,
  "paymentMethod": "credit_card",
  "status": "completed",
  "notes": "Sin crutones por alergia",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "ticket": {
    "id": 1,
    "totalAmount": 45.50,
    "status": "paid",
    "customerName": "María García",
    "venue": {
      "id": 1,
      "name": "Sucursal Centro - Planta Baja",
      "business": {
        "id": 1,
        "name": "Restaurante Centro",
        "organization": {
          "id": 1,
          "name": "Restaurantes Deliciosos S.A."
        }
      }
    }
  },
  "createdBy": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez"
  },
  "venue": {
    "id": 1,
    "name": "Sucursal Centro - Planta Baja"
  },
  "business": {
    "id": 1,
    "name": "Restaurante Centro"
  }
}
```

### 5. Consultar Ventas por Diferentes Criterios

#### Ver todas las ventas del negocio:
```bash
GET /sales/business/1
```

#### Ver todas las ventas del local:
```bash
GET /sales/venue/1
```

#### Ver resumen de ventas:
```bash
GET /sales/summary?businessId=1
```

### 6. Flujo Automático de Relaciones

Cuando creas una venta, el sistema automáticamente:

1. **Asocia la venta al usuario** que la crea
2. **Infiere el negocio** desde el ticket o local
3. **Infere la organización** desde el negocio
4. **Registra timestamps** de creación y actualización
5. **Valida permisos** del usuario para esa operación

### 7. Consideraciones Importantes

- **Solo necesitas especificar UNA relación**: `ticketId`, `venueId`, o `businessId`
- **El sistema infiere automáticamente** las otras relaciones
- **Se valida que el usuario tenga permisos** para crear ventas en ese contexto
- **Se registra automáticamente** quién creó la venta
- **Los timestamps se generan automáticamente**

### 8. Ejemplo con cURL

```bash
# Crear una venta simple
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

Este flujo te permite crear ventas de manera simple y el sistema se encarga automáticamente de todas las relaciones y validaciones. 