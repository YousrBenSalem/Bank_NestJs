/* eslint-disable prettier/prettier */

import {  Injectable, NotFoundException,  } from '@nestjs/common';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { InjectModel } from '@nestjs/mongoose';
import  mongoose , { Model } from 'mongoose';
import { IEmploye } from './interface/employe.interface';
import { IBanque } from 'src/banque/interface/banque.interface';
import * as argon2 from "argon2";
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer'; 

@Injectable()
export class EmployeService {
    constructor (
  @InjectModel('Personne') private employeModel :Model<IEmploye> ,
    @InjectModel('Banque') private banqueModel :Model<IBanque> ,
        private mailerService : MailerService ,
){}
      hashData(data: string) {
    return argon2.hash(data);
  }


  // fonction pour generate un code de verification d'email avec crypto
  async generateCode() : Promise <string> {
    return crypto.randomBytes(3).toString('hex').toUpperCase();

    }
// fonction for create a new employe
async createEmploye (
  createEmployeDto:CreateEmployeDto 
):Promise<IEmploye>{

     const hashedPassword = await this.hashData(createEmployeDto.password);
    
     const code = await this.generateCode();

     const newEmploye = await new this.employeModel({... createEmployeDto, password:hashedPassword, code :code}); 

          // envoi du code de verification par email
       const mailOptions = {
      from: '"yousrbensalem@gmail.com"',
      to: createEmployeDto.email,
      subject: 'Vérification de votre adresse email',
      text: `Votre code de vérification est : ${code}`,
      html: `<p>Votre code de vérification est : <strong><a href=http://localhost:3000/personne/verify/${code}>${code}</a></strong></p>`,
    };
      await this.mailerService.sendMail(mailOptions);
  //const newEmploye = new this.employeModel(createEmployeDto);
  
  const savedEmploye = await newEmploye.save() as IEmploye;

  const banqueData = await this.banqueModel.findById(createEmployeDto.banqueId);
  if(banqueData){
  banqueData.employeId.push(savedEmploye._id as mongoose.Types.ObjectId)
    const savedbanque = await banqueData.save();
  console.log(savedbanque) ;
  }else {
      throw new NotFoundException('Banque not found');
  }

  return savedEmploye;
} 

// fonction for update employe 
async updateEmploye (
  employeId:string , upadetEmployeDto:UpdateEmployeDto
):Promise<IEmploye>{
     const existingEmploye = await this.employeModel.findById(employeId);
    if (!existingEmploye) {
        throw new NotFoundException(`Employe #${employeId} not found`);
    }

    // Assignez les modifications
    Object.assign(existingEmploye, upadetEmployeDto);

    // Sauvegardez les changements
    return await existingEmploye.save();
}

// fonction to get client by id 
async getEmployeById (employeId: string): Promise<IEmploye> {
  const existingEmploye = await this.employeModel.findById(employeId).exec();
  if (!existingEmploye) {
    throw new NotFoundException(`Employe #${employeId} not found`);
    }
    return existingEmploye ;
}


//fonction to get all employees
async getAllEmployes ():Promise<IEmploye[]>{
  const employeData = await this.employeModel.find({item :"Employe"});
  if (! employeData || employeData.length==0){
    throw new NotFoundException('No employe found');
  }
  return employeData;
}


// function to delete employe
async deleteEmploye (employeId:string):Promise<IEmploye>{
   const deletedEmploye = await this.employeModel.findByIdAndDelete(employeId);

   if(! deletedEmploye){
    throw new NotFoundException(` Employe #${employeId} not found`)
   }
   const BankData = await this.banqueModel.findById(deletedEmploye.banqueId);
   if(BankData){
    BankData.employeId = BankData.employeId.filter(empId => empId.toString() !== employeId);
    await BankData.save()
   }else{
    throw new NotFoundException(`Bank #${deletedEmploye.banqueId} not found`)
   }
   return deletedEmploye ;

}





}
