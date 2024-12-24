/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { BanqueService } from './banque.service';
import { BanqueController } from './banque.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BanqueSchema } from './entities/banque.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([
      {
        name: 'Banque',
        schema: BanqueSchema,
      }
    ])
  ],
  controllers: [BanqueController],
  providers: [BanqueService],
    exports :[BanqueService]

})
export class BanqueModule {}
