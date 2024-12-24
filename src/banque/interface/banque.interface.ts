/* eslint-disable prettier/prettier */

import { Document, Types } from "mongoose";

export interface IBanque extends Document {
  readonly numero:string ;
  readonly nom:string ;
    readonly email:string ;
       password:string ;
        readonly username:string ;

             refreshToken: string;

      code : string ;
    verify : boolean ;



  readonly capital:number ;
  readonly adresseSiege:string ;
   logo:string ;
  employeId: Types.ObjectId[]
  compteBancaireId : Types.ObjectId[]

}