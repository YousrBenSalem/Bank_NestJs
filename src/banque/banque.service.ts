/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBanqueDto } from './dto/create-banque.dto';
import { UpdateBanqueDto } from './dto/update-banque.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IBanque } from './interface/banque.interface';
import { Model } from 'mongoose';
import * as argon2 from "argon2";
import { MailerService } from '@nestjs-modules/mailer';  
import * as crypto from 'crypto';
import { join } from 'path';

@Injectable()
export class BanqueService {
constructor (
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
// fonction for create a new bank
async createBank (
  createBanqueDto:CreateBanqueDto 
):Promise<IBanque>{
     const hashedPassword = await this.hashData(createBanqueDto.password);
      const code = await this.generateCode();
  const newBank = new this.banqueModel({...createBanqueDto, password:hashedPassword , code : code });
            // envoi du code de verification par email
       const mailOptions = {
      from: '"yousrbensalem@gmail.com"',
      to: createBanqueDto.email,
      subject: 'Vérification de votre adresse email',
      text: `Votre code de vérification est : ${code}`,
      html: `<p>Votre code de vérification est : <strong><a href=http://localhost:3000/banque/verify/${code}>${code}</a></strong></p>`,
    };
      await this.mailerService.sendMail(mailOptions); 
  return newBank.save();
}
    async findByUsername(email: string): Promise<IBanque> {
    return this.banqueModel.findOne({ email }).exec();
  }

// fonction for update bank 
async updateBank (
  bankId:string , upadetBanqueDto:UpdateBanqueDto
):Promise<IBanque>{
  const existingBank = await this.banqueModel.findByIdAndUpdate(bankId, upadetBanqueDto ,{new:true});
  if(!existingBank){
    throw new NotFoundException ( `Bank #${bankId} not found`);
  }
  return existingBank ;
}

// fonction to get bank by id 
async getBankById (bankId: string): Promise<IBanque> {
  const existingBank = await this.banqueModel.findById(bankId).exec();
  if (!existingBank) {
    throw new NotFoundException(`Bank #${bankId} not found`);
    }
    return existingBank ;
}

//fonction to get all banks
async getAllBanks ():Promise<IBanque[]>{
  const bankData = await this.banqueModel.find();
  if (! bankData || bankData.length==0){
    throw new NotFoundException('No bank found');
  }
  return bankData;
}


// function to delete banks
async deleteBank (bankId:string):Promise<IBanque>{
   const deletedBank = await this.banqueModel.findByIdAndDelete(bankId);

   if(! deletedBank){
    throw new NotFoundException(`Bank #${bankId} not found`)
   }
   return deletedBank ;

}

 // fonction verification de code par email 
 async VerificationCode(code: string, res :any): Promise<void> {
  try {
      const ExistiongCode = await this.banqueModel.findOne({ code})
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


  async updateToken (id: any , token : string) {
    const user = await this.banqueModel.findByIdAndUpdate(id ,{refreshToken :token} , {$new : true} );
    if (!user) {
      throw new NotFoundException('Bank not found');
      }
    return user
      
        
  }


}
