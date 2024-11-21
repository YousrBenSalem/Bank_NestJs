/* eslint-disable prettier/prettier */

import { Document, Types } from "mongoose";

export interface IBanque extends Document {
  readonly numero:string ;
  readonly nom:string ;
  readonly capital:number ;
  readonly adresseSiege:string ;
   logo:string ;
  employeId: Types.ObjectId[]
  compteBancaireId : Types.ObjectId[]

}