# 🎭 Sistema de Asignación de Permisos por Roles

## 📋 Descripción General

El sistema implementa un control de acceso basado en roles (RBAC - Role-Based Access Control) que permite a los **SuperAdmin** gestionar los permisos de otros usuarios de manera eficiente y segura.

## 🏗️ Arquitectura del Sistema

### **Dos Niveles de Control:**

1. **Sistema de Roles** (`Role` + `UserVenueRole` + `OrganizationUser`)
2. **Sistema de Permisos Específicos** (`UserPermission`)

### **Jerarquía de Roles:**
```
SuperAdmin > Admin > CEO > User
```

## 🔐 Roles Disponibles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **SuperAdmin** | Acceso completo al sistema | Todos los permisos |
| **Admin** | Gestión de usuarios y roles | Gestión de usuarios, roles y permisos limitados |
| **CEO** | Acceso a reportes y KPIs | Visualización de datos y reportes |
| **User** | Usuario básico | Permisos limitados de visualización |

## 🚀 Endpoints Disponibles

### **Gestión de Roles**

#### **1. Crear Rol**
```http
POST /roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "manager",
  "description": "Rol de gerente con permisos de gestión",
  "permissions": ["view_sales", "create_sales"]
}
```

#### **2. Obtener Todos los Roles**
```http
GET /roles
Authorization: Bearer <token>
```

#### **3. Obtener Roles con Conteo de Usuarios**
```http
GET /roles/with-user-count
Authorization: Bearer <token>
```

#### **4. Obtener Rol por ID**
```http
GET /roles/{id}
Authorization: Bearer <token>
```

#### **5. Obtener Rol por Nombre**
```http
GET /roles/name/{name}
Authorization: Bearer <token>
```

#### **6. Actualizar Rol**
```http
PATCH /roles/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "senior_manager",
  "description": "Rol de gerente senior"
}
```

#### **7. Eliminar Rol**
```http
DELETE /roles/{id}
Authorization: Bearer <token>
```

### **Gestión de Roles de Usuarios**

#### **1. Asignar Rol a Usuario**
```http
POST /users/assign-role
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 1,
  "roleId": 2,
  "organizationId": 1,
  "venueId": null
}
```

#### **2. Remover Rol de Usuario**
```http
DELETE /users/remove-role/{userId}?organizationId=1
Authorization: Bearer <token>
```

#### **3. Obtener Roles de Usuario**
```http
GET /users/roles/{userId}
Authorization: Bearer <token>
```

#### **4. Obtener Usuarios por Rol**
```http
GET /users/by-role/{roleId}?organizationId=1
Authorization: Bearer <token>
```

### **Gestión de Permisos Específicos**

#### **1. Asignar Permiso Específico**
```http
POST /permissions/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 1,
  "permissionType": "view_sales",
  "resourceType": "venue",
  "resourceId": 5
}
```

#### **2. Asignar Permisos por Rol**
```http
POST /permissions/assign-role-permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 1,
  "roleName": "admin",
  "resourceType": "organization",
  "resourceId": 1
}
```

#### **3. Asignar Permisos de Ventas**
```http
POST /permissions/sales/organization/{organizationId}/user/{userId}?permissionType=create_sales
Authorization: Bearer <token>
```

#### **4. Verificar Permiso**
```http
GET /permissions/check/{userId}?permissionType=view_sales&resourceType=venue&resourceId=5
Authorization: Bearer <token>
```

#### **5. Obtener Permisos de Usuario**
```http
GET /permissions/user/{userId}
Authorization: Bearer <token>
```

#### **6. Remover Permiso**
```http
DELETE /permissions/remove/{userId}?permissionType=view_sales&resourceType=venue&resourceId=5
Authorization: Bearer <token>
```

#### **7. Remover Todos los Permisos**
```http
DELETE /permissions/remove-all/{userId}
Authorization: Bearer <token>
```

## 📊 Tipos de Permisos

### **Permisos Disponibles:**
- `view_income` - Ver ingresos
- `view_sales` - Ver ventas
- `create_sales` - Crear ventas
- `update_sales` - Actualizar ventas
- `delete_sales` - Eliminar ventas
- `view_business` - Ver negocios
- `create_business` - Crear negocios
- `update_business` - Actualizar negocios
- `delete_business` - Eliminar negocios

### **Tipos de Recursos:**
- `organization` - Organización
- `company` - Compañía
- `venue` - Local/Restaurante

## 🎯 Permisos por Rol

### **SuperAdmin**
```typescript
[
  'view_income', 'view_sales', 'create_sales', 'update_sales', 'delete_sales',
  'view_business', 'create_business', 'update_business', 'delete_business'
]
```

### **Admin**
```typescript
[
  'view_income', 'view_sales', 'create_sales', 'update_sales',
  'view_business', 'create_business', 'update_business'
]
```

### **CEO**
```typescript
[
  'view_income', 'view_sales', 'view_business'
]
```

### **User**
```typescript
[
  'view_sales'
]
```

## 🔧 Configuración Inicial

### **1. Inicializar Roles del Sistema**
```bash
node scripts/init-roles.js
```

### **2. Crear SuperAdmin**
```bash
curl -X POST http://localhost:3000/database/create-superadmin
```

### **3. Ejemplo de Flujo Completo**

#### **Paso 1: Crear un nuevo rol**
```bash
curl -X POST http://localhost:3000/roles \
  -H "Authorization: Bearer <superadmin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "venue_manager",
    "description": "Gerente de local con permisos de gestión"
  }'
```

#### **Paso 2: Asignar rol a usuario**
```bash
curl -X POST http://localhost:3000/users/assign-role \
  -H "Authorization: Bearer <superadmin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "roleId": 5,
    "venueId": 3
  }'
```

#### **Paso 3: Asignar permisos específicos**
```bash
curl -X POST http://localhost:3000/permissions/assign-role-permissions \
  -H "Authorization: Bearer <superadmin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "roleName": "admin",
    "resourceType": "venue",
    "resourceId": 3
  }'
```

## 🛡️ Seguridad

### **Validaciones Implementadas:**

1. **Verificación de Existencia**: Se valida que usuarios, roles y recursos existan
2. **Prevención de Duplicados**: No se pueden crear permisos duplicados
3. **Soft Delete**: Los roles se marcan como inactivos en lugar de eliminarse
4. **Verificación de Uso**: No se pueden eliminar roles que están siendo usados
5. **Jerarquía de Permisos**: Solo SuperAdmin puede gestionar permisos

### **Guards de Seguridad:**
- `AuthGuard('jwt')` - Verifica autenticación
- `RolesGuard` - Verifica roles del usuario
- `PermissionsGuard` - Verifica permisos específicos

## 📝 Ejemplos de Uso

### **Escenario 1: Crear un Gerente de Local**

```bash
# 1. Crear rol de gerente
curl -X POST http://localhost:3000/roles \
  -H "Authorization: Bearer <token>" \
  -d '{"name": "venue_manager", "description": "Gerente de local"}'

# 2. Asignar rol al usuario
curl -X POST http://localhost:3000/users/assign-role \
  -H "Authorization: Bearer <token>" \
  -d '{"userId": 5, "roleId": 6, "venueId": 3}'

# 3. Asignar permisos de admin para el local
curl -X POST http://localhost:3000/permissions/assign-role-permissions \
  -H "Authorization: Bearer <token>" \
  -d '{"userId": 5, "roleName": "admin", "resourceType": "venue", "resourceId": 3}'
```

### **Escenario 2: Promover Usuario a CEO**

```bash
# 1. Asignar rol de CEO
curl -X POST http://localhost:3000/users/assign-role \
  -H "Authorization: Bearer <token>" \
  -d '{"userId": 3, "roleId": 3, "organizationId": 1}'

# 2. Asignar permisos de CEO
curl -X POST http://localhost:3000/permissions/assign-role-permissions \
  -H "Authorization: Bearer <token>" \
  -d '{"userId": 3, "roleName": "ceo", "resourceType": "organization", "resourceId": 1}'
```

### **Escenario 3: Revocar Permisos**

```bash
# Remover todos los permisos de un usuario
curl -X DELETE http://localhost:3000/permissions/remove-all/5 \
  -H "Authorization: Bearer <token>"

# Remover rol específico
curl -X DELETE http://localhost:3000/users/remove-role/5?venueId=3 \
  -H "Authorization: Bearer <token>"
```

## 🔍 Monitoreo y Auditoría

### **Consultas Útiles:**

#### **Ver todos los roles con conteo de usuarios:**
```bash
curl -X GET http://localhost:3000/roles/with-user-count \
  -H "Authorization: Bearer <token>"
```

#### **Ver roles de un usuario específico:**
```bash
curl -X GET http://localhost:3000/users/roles/5 \
  -H "Authorization: Bearer <token>"
```

#### **Ver usuarios con un rol específico:**
```bash
curl -X GET http://localhost:3000/users/by-role/2?organizationId=1 \
  -H "Authorization: Bearer <token>"
```

#### **Verificar si un usuario tiene un permiso:**
```bash
curl -X GET "http://localhost:3000/permissions/check/5?permissionType=view_sales&resourceType=venue&resourceId=3" \
  -H "Authorization: Bearer <token>"
```

## 🚨 Consideraciones Importantes

1. **Solo SuperAdmin** puede gestionar permisos y roles
2. **Los roles se pueden asignar** tanto a nivel de organización como de local
3. **Los permisos son específicos** por recurso (organización, compañía, local)
4. **No se pueden eliminar roles** que están siendo usados por usuarios
5. **Los permisos se pueden asignar** individualmente o por rol completo
6. **El sistema es jerárquico**: SuperAdmin > Admin > CEO > User

## 📚 Documentación Swagger

Accede a la documentación completa en:
```
http://localhost:3000/docs
```

Allí encontrarás todos los endpoints con ejemplos de uso y respuestas. 