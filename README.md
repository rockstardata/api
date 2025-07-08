# api
api_backend_rockstardata
nest-app/
│
├── docker-compose.yml        # Configuración para levantar servicios con Docker.
├── eslint.config.mjs         # Configuración de ESLint para el linting del código.
├── nest-cli.json             # Configuración de la CLI de NestJS.
├── package-lock.json         # Lockfile de dependencias.
├── package.json              # Dependencias y scripts del proyecto.
├── README.md                 # Documentación principal del proyecto.
├── tsconfig.build.json       # Configuración de TypeScript para build.
├── tsconfig.json             # Configuración general de TypeScript.
│
├── src/                      # (Código Fuente) EL CORAZÓN DE TU APLICACIÓN.
│   │
│   ├── main.ts                   # Punto de entrada: inicia la app y el servidor.
│   ├── app.module.ts             # Módulo raíz: orquesta todos los módulos.
│   │
│   ├── agreements/               # MÓDULO DE ACUERDOS
│   │   ├── agreements.controller.ts   # Endpoints para acuerdos.
│   │   ├── agreements.module.ts       # Módulo de acuerdos.
│   │   ├── agreements.service.ts      # Lógica de negocio de acuerdos.
│   │   ├── dto/                      # Data Transfer Objects para acuerdos.
│   │   │   ├── create-agreement.dto.ts
│   │   │   └── update-agreement.dto.ts
│   │   └── entities/                 # Entidades de base de datos.
│   │       └── agreement.entity.ts
│   │
│   ├── auth/                        # MÓDULO DE AUTENTICACIÓN Y AUTORIZACIÓN
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── decorators/              # Decoradores personalizados (roles, permisos).
│   │   │   ├── check-permissions.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── dto/                     # DTOs para autenticación.
│   │   │   ├── assign-permission.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── entities/
│   │   │   └── user-permission.entity.ts
│   │   ├── enums/                   # Enumerados (tipos de permisos, recursos).
│   │   │   ├── permission-type.enum.ts
│   │   │   └── resource-type.enum.ts
│   │   ├── guards/                  # Guards para proteger rutas.
│   │   │   ├── permissions.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── permissions.controller.ts
│   │   ├── permissions.service.ts
│   │   └── strategies/              # Estrategias de autenticación (ej. JWT).
│   │       └── jwt.strategy.ts
│   │
│   ├── business/                    # MÓDULO DE NEGOCIOS
│   │   ├── business.controller.ts
│   │   ├── business.module.ts
│   │   ├── business.service.ts
│   │   ├── dto/
│   │   │   ├── create-business.dto.ts
│   │   │   └── update-business.dto.ts
│   │   └── entities/
│   │       └── business.entity.ts
│   │
│   ├── costs/                       # MÓDULO DE COSTOS
│   │   ├── costs.controller.ts
│   │   ├── costs.module.ts
│   │   ├── costs.service.ts
│   │   ├── dto/
│   │   │   ├── create-cost.dto.ts
│   │   │   └── update-cost.dto.ts
│   │   └── entities/
│   │       └── cost.entity.ts
│   │
│   ├── database/                    # CONFIGURACIÓN DE BASE DE DATOS
│   │   └── database.module.ts
│   │
│   ├── income/                      # MÓDULO DE INGRESOS
│   │   ├── income.controller.ts
│   │   ├── income.module.ts
│   │   ├── income.service.ts
│   │   ├── dto/
│   │   │   ├── create-income.dto.ts
│   │   │   └── update-income.dto.ts
│   │   └── entities/
│   │       └── income.entity.ts
│   │
│   ├── kpis/                        # MÓDULO DE INDICADORES (KPIs)
│   │   ├── kpis.controller.ts
│   │   ├── kpis.module.ts
│   │   ├── kpis.service.ts
│   │   ├── dto/
│   │   │   ├── create-kpi.dto.ts
│   │   │   └── update-kpi.dto.ts
│   │   └── entities/
│   │       └── kpi.entity.ts
│   │
│   ├── organization/                # MÓDULO DE ORGANIZACIONES
│   │   ├── organization.controller.ts
│   │   ├── organization.module.ts
│   │   ├── organization.service.ts
│   │   ├── dto/
│   │   │   ├── create-organization.dto.ts
│   │   │   └── update-organization.dto.ts
│   │   └── entities/
│   │       ├── organization.entity.ts
│   │       └── organizationUser.entity.ts
│   │
│   ├── role/                        # MÓDULO DE ROLES
│   │   ├── role.controller.ts
│   │   ├── role.module.ts
│   │   ├── role.service.ts
│   │   ├── dto/
│   │   │   ├── create-role.dto.ts
│   │   │   └── update-role.dto.ts
│   │   ├── entities/
│   │   │   └── role.entity.ts
│   │   └── enums/
│   │       └── role.enum.ts
│   │
│   ├── sales/                       # MÓDULO DE VENTAS
│   │   ├── sales.controller.ts
│   │   ├── sales.module.ts
│   │   ├── sales.service.ts
│   │   ├── dto/
│   │   │   └── create-sale.dto.ts
│   │   └── entities/
│   │       └── sale.entity.ts
│   │
│   ├── staff-member/                # MÓDULO DE MIEMBROS DEL STAFF
│   │   ├── staff-member.controller.ts
│   │   ├── staff-member.module.ts
│   │   ├── staff-member.service.ts
│   │   ├── dto/
│   │   │   ├── create-staff-member.dto.ts
│   │   │   └── update-staff-member.dto.ts
│   │   └── entities/
│   │       └── staff-member.entity.ts
│   │
│   ├── tickets/                     # MÓDULO DE TICKETS
│   │   ├── tickets.controller.ts
│   │   ├── tickets.module.ts
│   │   ├── tickets.service.ts
│   │   ├── dto/
│   │   │   ├── create-ticket.dto.ts
│   │   │   └── update-ticket.dto.ts
│   │   └── entities/
│   │       └── ticket.entity.ts
│   │
│   ├── users/                       # MÓDULO DE USUARIOS
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── entities/
│   │       ├── user.entity.ts
│   │       └── user-venue-role.entity.ts
│   │
│   └── venue/                       # MÓDULO DE RECINTOS/LUGARES
│       ├── venue.controller.ts
│       ├── venue.module.ts
│       ├── venue.service.ts
│       ├── dto/
│       │   ├── create-venue.dto.ts
│       │   └── update-venue.dto.ts
│       └── entities/
│           └── venue.entity.ts
│
├── test/                        # (Pruebas) Tests unitarios y end-to-end.
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
