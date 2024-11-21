/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { Personne } from "src/personne/entities/personne.entity";
@Schema()
export class Client  extends Personne {
    item : string ;
  @Prop()
  numero : string ;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CompteBancaire' }] })
  compteBancaireId : Types.ObjectId []

  @Prop({type: mongoose.Schema.Types.ObjectId , ref:'Personne'})
  employeId : Types.ObjectId 



}

export const ClientSchema = SchemaFactory.createForClass(Client);
