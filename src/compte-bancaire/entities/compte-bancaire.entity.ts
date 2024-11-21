/* eslint-disable prettier/prettier */

import mongoose, { Document, Types } from "mongoose";
import {Prop , Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema()
export class CompteBancaire extends Document{
  @Prop()
  numero : string ;

  @Prop()
  solde: number ;

  @Prop()
  dateOuverture: string ;

  @Prop({type:mongoose.Schema.Types.ObjectId , ref :'Personne' })
  clientId: Types.ObjectId ;

  @Prop({type:mongoose.Schema.Types.ObjectId , ref :'Banque' })
  banqueId: Types.ObjectId ;
  
}
export const CompteBancaireSchema = SchemaFactory.createForClass(CompteBancaire) 
