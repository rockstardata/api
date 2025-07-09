# Guía de Permisos para Ventas

## Descripción General

Este sistema permite asignar permisos específicos a usuarios para que puedan ver, crear, actualizar o eliminar ventas en diferentes niveles de la organización:

- **Nivel Organización**: Acceso a todas las ventas de todos los negocios de una organización
- **Nivel Negocio**: Acceso a todas las ventas de un negocio específico
- **Nivel Local**: Acceso a todas las ventas de un local específico

## Tipos de Permisos Disponibles

### Para Ventas:
- `view_sales`: Ver ventas
- `create_sales`: Crear ventas
- `update_sales`: Actualizar ventas
- `delete_sales`: Eliminar ventas

### Para Negocios:
- `view_business`: Ver negocios
- `create_business`: Crear negocios
- `update_business`: Actualizar negocios
- `delete_business`: Eliminar negocios

## Cómo Asignar Permisos

### 1. Asignar Permisos de Ventas a Nivel Organización

```bash
# Asignar permiso para ver ventas de toda una organización
POST /permissions/sales/organization/{organizationId}/user/{userId}

# Ejemplo:
POST /permissions/sales/organization/1/user/5
```

### 2. Asignar Permisos de Ventas a Nivel Negocio

```bash
# Asignar permiso para ver ventas de un negocio específico
POST /permissions/sales/business/{businessId}/user/{userId}

# Ejemplo:
POST /permissions/sales/business/3/user/5
```

### 3. Asignar Permisos de Ventas a Nivel Local

```bash
# Asignar permiso para ver ventas de un local específico
POST /permissions/sales/venue/{venueId}/user/{userId}

# Ejemplo:
POST /permissions/sales/venue/7/user/5
```

### 4. Asignar Permisos con Tipo Específico

```bash
# Asignar permiso de creación de ventas
POST /permissions/sales/business/3/user/5?permissionType=create_sales

# Asignar permiso de actualización de ventas
POST /permissions/sales/business/3/user/5?permissionType=update_sales

# Asignar permiso de eliminación de ventas
POST /permissions/sales/business/3/user/5?permissionType=delete_sales
```

## Cómo Verificar Permisos

### 1. Verificar Permisos de un Usuario

```bash
# Ver todos los permisos de un usuario
GET /permissions/user/{userId}

# Ejemplo:
GET /permissions/user/5
```

### 2. Verificar un Permiso Específico

```bash
# Verificar si un usuario tiene un permiso específico
GET /permissions/check/{userId}?permissionType=view_sales&resourceType=business&resourceId=3

# Ejemplo:
GET /permissions/check/5?permissionType=view_sales&resourceType=business&resourceId=3
```

## Cómo Remover Permisos

```bash
# Remover un permiso específico
DELETE /permissions/remove/{userId}?permissionType=view_sales&resourceType=business&resourceId=3

# Ejemplo:
DELETE /permissions/remove/5?permissionType=view_sales&resourceType=business&resourceId=3
```

## Cómo Funciona el Filtrado de Ventas

### 1. Obtener Todas las Ventas (Filtradas por Permisos)

```bash
# Si el usuario tiene permisos, verá solo las ventas permitidas
# Si no tiene permisos, verá solo sus propias ventas
GET /sales
```

### 2. Obtener Ventas por Negocio

```bash
# Solo funciona si el usuario tiene permisos para ese negocio
GET /sales/business/{businessId}
```

### 3. Obtener Ventas por Local

```bash
# Solo funciona si el usuario tiene permisos para ese local
GET /sales/venue/{venueId}
```

### 4. Obtener Resumen de Ventas

```bash
# Solo funciona si el usuario tiene permisos para el negocio/local
GET /sales/summary?businessId=3
GET /sales/summary?venueId=7
```

## Jerarquía de Permisos

El sistema sigue esta jerarquía de permisos:

1. **Organización**: Acceso a todas las ventas de todos los negocios de la organización
2. **Negocio**: Acceso a todas las ventas de un negocio específico
3. **Local**: Acceso a todas las ventas de un local específico
4. **Propio**: Acceso solo a las ventas creadas por el usuario

## Ejemplos de Uso

### Escenario 1: Gerente de Organización
```bash
# Asignar permisos de vista a nivel organización
POST /permissions/sales/organization/1/user/10

# El usuario 10 podrá ver todas las ventas de la organización 1
```

### Escenario 2: Gerente de Negocio
```bash
# Asignar permisos de vista a nivel negocio
POST /permissions/sales/business/3/user/15

# El usuario 15 podrá ver todas las ventas del negocio 3
```

### Escenario 3: Cajero de Local
```bash
# Asignar permisos de vista y creación a nivel local
POST /permissions/sales/venue/7/user/20?permissionType=view_sales
POST /permissions/sales/venue/7/user/20?permissionType=create_sales

# El usuario 20 podrá ver y crear ventas en el local 7
```

### Escenario 4: Usuario sin Permisos Específicos
```bash
# Si un usuario no tiene permisos específicos, solo verá sus propias ventas
GET /sales
# Retorna solo las ventas donde createdBy = userId
```

## Consideraciones de Seguridad

1. **Verificación Automática**: Todos los endpoints de ventas verifican automáticamente los permisos
2. **Filtrado por Defecto**: Si no hay permisos específicos, solo se muestran las ventas propias
3. **Validación de Recursos**: Se valida que los recursos (organización, negocio, local) existan antes de asignar permisos
4. **Prevención de Duplicados**: No se pueden asignar permisos duplicados para el mismo usuario y recurso

## Endpoints Disponibles

### Permisos:
- `POST /permissions/assign` - Asignar permiso general
- `POST /permissions/sales/organization/{id}/user/{id}` - Asignar permiso de ventas por organización
- `POST /permissions/sales/business/{id}/user/{id}` - Asignar permiso de ventas por negocio
- `POST /permissions/sales/venue/{id}/user/{id}` - Asignar permiso de ventas por local
- `GET /permissions/user/{id}` - Ver permisos de un usuario
- `GET /permissions/check/{id}` - Verificar permiso específico
- `DELETE /permissions/remove/{id}` - Remover permiso

### Ventas (con filtrado automático por permisos):
- `GET /sales` - Obtener ventas (filtradas por permisos)
- `GET /sales/business/{id}` - Obtener ventas por negocio
- `GET /sales/venue/{id}` - Obtener ventas por local
- `GET /sales/summary` - Obtener resumen de ventas
- `POST /sales` - Crear venta
- `PATCH /sales/{id}` - Actualizar venta
- `DELETE /sales/{id}` - Eliminar venta 