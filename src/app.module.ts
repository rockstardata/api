import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { BusinessModule } from './business/business.module';
import { CompanyModule } from './company/company.module';
import { DatabaseModule } from './database/database.module';
import { OrganizationModule } from './organization/organization.module';
import { UsersModule } from './users/users.module';
// import { StaffMemberModule } from './staff-member/staff-member.module';
import { AgreementsModule } from './agreements/agreements.module';
import { RoleModule } from './role/role.module';
import { VenueModule } from './venue/venue.module';
// import { IncomeModule } from './income/income.module';
// import { KpisModule } from './kpis/kpis.module';
// import { TicketsModule } from './tickets/tickets.module';
// import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';
import { RecModule } from './rec/rec.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    OrganizationModule,
    CompanyModule,
    BusinessModule,
    // StaffMemberModule,
    VenueModule,
    RoleModule,
    AgreementsModule,
    // IncomeModule,
    // KpisModule,
    // TicketsModule,
    // SalesModule,
    AuthModule,
    RecModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
