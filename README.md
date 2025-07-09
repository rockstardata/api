# 🚀 API Backend - Sistema de Gestión de Negocios y Ventas

Sistema completo de gestión empresarial con autenticación, autorización, gestión de ventas, negocios y permisos granulares.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Sistema de Permisos](#-sistema-de-permisos)
- [Endpoints Principales](#-endpoints-principales)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Relaciones entre Entidades](#-relaciones-entre-entidades)

## ✨ Características

- 🔐 **Autenticación JWT** con roles y permisos granulares
- 🏢 **Gestión de Organizaciones** y Negocios
- 💰 **Sistema de Ventas** completo con filtrado por permisos
- 👥 **Gestión de Usuarios** con roles (SuperAdmin, Admin, User)
- 🎫 **Sistema de Tickets** para transacciones
- 📊 **KPIs y Reportes** de ventas
- 🛡️ **Autorización basada en roles** y recursos
- 🏪 **Gestión de Locales/Venues**
- 👨‍💼 **Gestión de Staff** y empleados

## 🏗️ Estructura del Proyecto

```
nest-app/
│
├── docker-compose.yml        # Configuración Docker
├── eslint.config.mjs         # Configuración ESLint
├── nest-cli.json             # Configuración NestJS CLI
├── package.json              # Dependencias y scripts
├── README.md                 # Esta documentación
├── tsconfig.json             # Configuración TypeScript
│
├── src/                      # Código Fuente
│   │
│   ├── main.ts                   # Punto de entrada
│   ├── app.module.ts             # Módulo raíz
│   │
│   ├── auth/                     # 🔐 AUTENTICACIÓN Y AUTORIZACIÓN
│   │   ├── auth.controller.ts    # Login, registro
│   │   ├── auth.service.ts       # Lógica de autenticación
│   │   ├── permissions.controller.ts # Gestión de permisos
│   │   ├── permissions.service.ts    # Lógica de permisos
│   │   ├── decorators/           # Decoradores personalizados
│   │   │   ├── check-permissions.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── guards/               # Guards de seguridad
│   │   │   ├── permissions.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── entities/
│   │   │   └── user-permission.entity.ts
│   │   ├── enums/                # Tipos de permisos y recursos
│   │   │   ├── permission-type.enum.ts
│   │   │   └── resource-type.enum.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   │
│   ├── organization/             # 🏢 ORGANIZACIONES
│   │   ├── organization.controller.ts
│   │   ├── organization.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       ├── organization.entity.ts
│   │       └── organizationUser.entity.ts
│   │
│   ├── business/                 # 🏪 NEGOCIOS
│   │   ├── business.controller.ts
│   │   ├── business.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       └── business.entity.ts
│   │
│   ├── sales/                    # 💰 VENTAS
│   │   ├── sales.controller.ts
│   │   ├── sales.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       └── sale.entity.ts
│   │
│   ├── tickets/                  # 🎫 TICKETS
│   │   ├── tickets.controller.ts
│   │   ├── tickets.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       └── ticket.entity.ts
│   │
│   ├── venue/                    # 🏟️ LOCALES/VENUES
│   │   ├── venue.controller.ts
│   │   ├── venue.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       └── venue.entity.ts
│   │
│   ├── users/                    # 👥 USUARIOS
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       ├── user.entity.ts
│   │       └── user-venue-role.entity.ts
│   │
│   ├── staff-member/             # 👨‍💼 STAFF
│   │   ├── staff-member.controller.ts
│   │   ├── staff-member.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       └── staff-member.entity.ts
│   │
│   ├── role/                     # 🎭 ROLES
│   │   ├── role.controller.ts
│   │   ├── role.service.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   │   └── role.entity.ts
│   │   └── enums/
│   │       └── role.enum.ts
│   │
│   ├── income/                   # 💵 INGRESOS
│   ├── costs/                    # 💸 COSTOS
│   ├── kpis/                     # 📊 INDICADORES
│   ├── agreements/               # 📋 ACUERDOS
│   └── database/                 # 🗄️ CONFIGURACIÓN DB
│
└── test/                         # 🧪 PRUEBAS
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npm run migration:run

# Iniciar en desarrollo
npm run start:dev
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=myapp

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1d

# Puerto de la aplicación
PORT=3000
```

## 🔐 Sistema de Permisos

### Roles y Jerarquía

- **SuperAdmin**: Puede asignar cualquier permiso a cualquier usuario
- **Admin**: Puede asignar usuarios a organizaciones
- **User**: Solo puede ver lo que sus permisos le permiten

### Tipos de Permisos

- `view_sales` - Ver ventas
- `create_sales` - Crear ventas
- `update_sales` - Actualizar ventas
- `delete_sales` - Eliminar ventas
- `view_business` - Ver negocios
- `create_business` - Crear negocios
- `update_business` - Actualizar negocios
- `delete_business` - Eliminar negocios

### Niveles de Recursos

- **Organización**: Acceso a todas las ventas de la organización
- **Negocio**: Acceso a todas las ventas del negocio
- **Local/Venue**: Acceso a todas las ventas del local

## 🌐 Endpoints Principales

### Autenticación
```bash
POST /auth/login          # Login de usuario
POST /auth/register       # Registro de usuario
```

### Usuarios
```bash
GET    /users             # Listar usuarios
POST   /users             # Crear usuario
GET    /users/:id         # Obtener usuario
PATCH  /users/:id         # Actualizar usuario
DELETE /users/:id         # Eliminar usuario
```

### Organizaciones
```bash
GET    /organizations                    # Listar organizaciones
POST   /organizations                    # Crear organización (Admin+)
GET    /organizations/:id                # Obtener organización
PATCH  /organizations/:id                # Actualizar organización
DELETE /organizations/:id                # Eliminar organización
POST   /organizations/:id/assign-user/:userId  # Asignar usuario (Admin)
```

### Negocios
```bash
GET    /business              # Listar negocios
POST   /business              # Crear negocio
GET    /business/:id          # Obtener negocio
PATCH  /business/:id          # Actualizar negocio
DELETE /business/:id          # Eliminar negocio
```

### Ventas
```bash
GET    /sales                 # Listar ventas (filtradas por permisos)
POST   /sales                 # Crear venta
GET    /sales/:id             # Obtener venta
PATCH  /sales/:id             # Actualizar venta
DELETE /sales/:id             # Eliminar venta
GET    /sales/business/:id    # Ventas por negocio
GET    /sales/venue/:id       # Ventas por local
GET    /sales/user/:id        # Ventas por usuario
GET    /sales/summary         # Resumen de ventas
```

### Permisos (Solo SuperAdmin)
```bash
POST   /permissions/assign                           # Asignar permiso
POST   /permissions/sales/organization/:id/user/:id  # Permiso ventas por organización
POST   /permissions/sales/business/:id/user/:id      # Permiso ventas por negocio
POST   /permissions/sales/venue/:id/user/:id         # Permiso ventas por local
GET    /permissions/user/:id                         # Ver permisos de usuario
DELETE /permissions/remove/:id                       # Remover permiso
```

## 💡 Ejemplos de Uso

### 1. Crear una Venta Completa

```bash
# 1. Crear usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@email.com",
    "password": "password123"
  }'

# 2. Crear negocio
curl -X POST http://localhost:3000/business \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Negocio",
    "description": "Negocio principal",
    "address": "Calle 123",
    "email": "info@negocio.com"
  }'

# 3. Crear venta
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

### 2. Asignar Permisos (SuperAdmin)

```bash
# Asignar permiso de ventas por organización
curl -X POST http://localhost:3000/permissions/sales/organization/1/user/2 \
  -H "Authorization: Bearer TU_TOKEN_SUPERADMIN"

# Asignar permiso de ventas por negocio
curl -X POST http://localhost:3000/permissions/sales/business/1/user/2 \
  -H "Authorization: Bearer TU_TOKEN_SUPERADMIN"
```

### 3. Asignar Usuario a Organización (Admin)

```bash
curl -X POST http://localhost:3000/organizations/1/assign-user/2 \
  -H "Authorization: Bearer TU_TOKEN_ADMIN"
```

## 🔗 Relaciones entre Entidades

```
Organization (1) ←→ (N) Business (1) ←→ (N) Venue (1) ←→ (N) Ticket (1) ←→ (N) Sale
     ↑                                                           ↑
     │                                                           │
     └── (N) OrganizationUser (N) ←→ (1) User (1) ←→ (N) Sale  │
                                                                    │
Business (1) ←→ (N) StaffMember (N) ←→ (1) User ────────────────┘
```

### Jerarquía de Permisos

1. **Organización**: Acceso a todas las ventas de todos los negocios
2. **Negocio**: Acceso a todas las ventas del negocio
3. **Local**: Acceso a todas las ventas del local
4. **Propio**: Acceso solo a las ventas creadas por el usuario

## 🛡️ Seguridad

- **Autenticación JWT** con tokens seguros
- **Autorización basada en roles** (RBAC)
- **Permisos granulares** por recurso
- **Validación de datos** con class-validator
- **Protección CSRF** y rate limiting
- **Logs de auditoría** para acciones críticas

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de código
npm run test:cov
```

## 📦 Scripts Disponibles

```bash
npm run start              # Iniciar en producción
npm run start:dev          # Iniciar en desarrollo
npm run start:debug        # Iniciar en modo debug
npm run build              # Compilar el proyecto
npm run test               # Ejecutar tests
npm run test:e2e           # Ejecutar tests e2e
npm run test:cov           # Tests con cobertura
npm run lint               # Linting del código
npm run lint:fix           # Linting con auto-fix
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: contacto@rockstardata.io
- 📱 Teléfono: +34 919995060
- 🌐 Website: https://www.rockstardata.ai/

---


