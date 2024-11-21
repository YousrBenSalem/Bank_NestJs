/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PersonneService } from './personne.service';
import { PersonneController } from './personne.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSchema } from 'src/client/entities/client.entity';
import { PersonneSchema } from './entities/personne.entity';
import { EmployeSchema } from 'src/employe/entities/employe.entity';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([
      {
        name: 'Personne',
        schema: PersonneSchema,
        discriminators : [
        { name: 'Client', schema: ClientSchema },
        {name:'Employe', schema:EmployeSchema}
        

      ] 
      }
    ])
  ],
  controllers: [PersonneController],
  providers: [PersonneService],
  exports :[PersonneService]
})
export class PersonneModule {}
