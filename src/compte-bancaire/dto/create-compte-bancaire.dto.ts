/* eslint-disable prettier/prettier */

import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Types } from "mongoose";

export class CreateCompteBancaireDto {

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly numero: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(()=>Number)

  readonly solde: number;

  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  readonly dateOuverture: string;

  readonly  clientId: Types.ObjectId ;

    banqueId: Types.ObjectId ;



}
