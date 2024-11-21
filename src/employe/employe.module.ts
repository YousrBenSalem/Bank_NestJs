/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { EmployeService } from './employe.service';
import { EmployeController } from './employe.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { PersonneSchema } from 'src/personne/entities/personne.entity';
import { BanqueSchema } from 'src/banque/entities/banque.entity';

@Module({
    imports: [
    MongooseModule.forFeature([
      {
        name: 'Personne',
        schema: PersonneSchema,
      },
      {
        name: 'Banque',
        schema: BanqueSchema,

      }
    ])
  ],
  controllers: [EmployeController],
  providers: [EmployeService],
})
export class EmployeModule {}
