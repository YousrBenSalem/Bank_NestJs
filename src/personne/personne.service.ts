/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePersonneDto } from './dto/update-personne.dto';
import * as argon2 from "argon2";
import { HachagePasswordDto } from './dto/hachage-password.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPersonne } from './interface/personne.interface';
import { join } from 'path';

@Injectable()
export class PersonneService {
    constructor(@InjectModel('Personne') private personneModel: Model<IPersonne>) {}

  
      hashData(data: string) {
    return argon2.hash(data);
  }
async hachPassword ( hachagePasswordDto:HachagePasswordDto, userId : string): Promise<void> {
  const {oldPassword , newPassword} = hachagePasswordDto ;
    console.log('Old Password:', oldPassword);
    console.log('New Password:', newPassword);
  const existingUser = await this.personneModel.findById(userId);
  if(!existingUser){
    console.log('Error: Old password is incorrect');
    throw new NotFoundException('Personne not found');
  }else {
    const matchPassword= await argon2.verify(existingUser.password , oldPassword) ;
    if(!matchPassword){
      throw new NotFoundException('Password is incorrect');
      }else {
        const hashedNewPassword = await this.hashData(newPassword)
        existingUser.password = hashedNewPassword ;
        await existingUser.save();
          console.log('Password updated successfully');
    }

}
}


 // forget password
  async findByEmail (email : string):Promise<IPersonne>{
    return this.personneModel.findOne({email}).exec();
  } 

  async updateToken (id: any , token : string) {
    const user = await this.personneModel.findByIdAndUpdate(id ,{refreshToken :token} , {$new : true} );
    if (!user) {
      throw new NotFoundException('User not found');
      }
    return user
      
        
  }

  async findAll(): Promise <IPersonne[]> {
      return this.personneModel.find().exec();

  }

  async findById(id: string) : Promise<IPersonne> {
      return this.personneModel.findById(id);

  }
  async findByUsername(username: string): Promise<IPersonne> {
    return this.personneModel.findOne({ username }).exec();
  }
  async update(id: string, updatePersonneDto: UpdatePersonneDto) :Promise<IPersonne>{
      return this.personneModel
      .findByIdAndUpdate(id, updatePersonneDto, { new: true })
      .exec();
  }

  async remove(id: string) :Promise<IPersonne> {
      return this.personneModel.findByIdAndDelete(id).exec();

  }

  async findUserByNameOrEmail (query: { email?: string; nom?: string }): Promise<IPersonne> {
    
    return this.personneModel.findOne({
      $or: [{ email: query.email }, { nom: query.nom }],
    });
  }

  async findUserByNameAndEmail(query: { email: string; name: string }): Promise<IPersonne>{
  return await this.personneModel.findOne({
    $and: [
      {  name: query.name },
      {email: query.email  },
    ],
  }).exec();
}

 // fonction verification de code par email 
 async VerificationCode(code: string, res :any): Promise<void> {
  try {
      const ExistiongCode = await this.personneModel.findOne({ code})
  if (!ExistiongCode) {

      return res.sendFile(join(__dirname+'../../../verifyEmail/error.html'))
    // navigate to html page error.html
    
  }

        ExistiongCode.code=undefined;
        ExistiongCode.verify=true
        await ExistiongCode.save()
        return res.sendFile(join(__dirname+'../../../verifyEmail/correct.html'))
    
  } catch (error) {
    return error ;
    
  }




 }
  
}
