/* eslint-disable prettier/prettier */

import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Types } from "mongoose";
export class CreateBanqueDto {
    @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly numero: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly nom: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(()=>Number)
  readonly capital: number;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  readonly adresseSiege: string;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  readonly ville: string;

    @IsString()

   logo: string;

     employeId: Types.ObjectId[]
}
