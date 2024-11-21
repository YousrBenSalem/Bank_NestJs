/* eslint-disable prettier/prettier */

import { Document, Types } from "mongoose";

export interface IComptebancaire extends Document {
  readonly numero:string ;
  readonly solde:number ;
  readonly dateOuverture:string ;
  readonly clientId: Types.ObjectId ;
    banqueId: Types.ObjectId ;


}