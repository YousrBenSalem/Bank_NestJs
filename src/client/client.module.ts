/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { PersonneSchema } from 'src/personne/entities/personne.entity';


@Module({
  imports:[
    MongooseModule.forFeature([
      { name: "Personne", 
        schema: PersonneSchema,
    }
    ])
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
