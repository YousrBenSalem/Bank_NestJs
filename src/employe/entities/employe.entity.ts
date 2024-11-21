/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

import { Personne } from "src/personne/entities/personne.entity";
@Schema()
export class Employe  extends Personne {

    @Prop()
  salaire: number;

    @Prop()
  numINSEE: number;

  item : string

@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Banque' })
   banqueId: Types.ObjectId;

   @Prop({type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Banque' }]})
   clientId: Types.ObjectId[];

}
export const EmployeSchema = SchemaFactory.createForClass(Employe);
