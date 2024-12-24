/* eslint-disable prettier/prettier */

import { Controller, Post, Body, Param, Res, HttpStatus, Put, Get, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BanqueService } from './banque.service';
import { CreateBanqueDto } from './dto/create-banque.dto';
import { UpdateBanqueDto } from './dto/update-banque.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from "path";
import { diskStorage } from "multer";
@ApiTags('banque')
@Controller('banque')
export class BanqueController {
  constructor(private readonly banqueService: BanqueService) {}
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        nom :{
          type: 'string',
        },
        ville :{
          type: 'string',
        },
        adresseSiege :{
          type: 'string',
        },
        capital:{
          type: 'number',
        },
        numero:{
          type: 'string',
        },
        file:{
          type: 'string',
          format:'binary'
        }
      }
    }
  })
  @Post()
    @UseInterceptors(FileInterceptor("file", {
    storage:diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
    })
  }))
  async createBank(
    @Res()  response ,
    @Body() createBanqueDto: CreateBanqueDto,
    @UploadedFile() file

  ){
    try {
      createBanqueDto.logo = file ? file.filename : null
      const newBank = await this.banqueService.createBank(createBanqueDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Bank created successfully',
        newBank,
      })
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode :400,
        message: 'Error creating bank'+err,
        })  
    }
  }
    @Get("verify/:code")
  async verifyCode(@Param('code') code: string ,   @Res() res,
) {
    return this.banqueService.VerificationCode(code , res );

  }
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        nom :{
          type: 'string',
        },
        ville :{
          type: 'string',
        },
        adresseSiege :{
          type: 'string',
        },
        capital:{
          type: 'number',
        },
        numero:{
          type: 'string',
        },
        file:{
          type: 'string',
          format:'binary'
        }
      }
    }
  })
  @Put('/:id')
    @UseInterceptors(FileInterceptor("file", {
    storage:diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
    })
  }))
  async updateBank(
    @Res()  response ,
    @Param('id') bankId: string,
    @Body() updateBanqueDto:UpdateBanqueDto,
    @UploadedFile() file

  ){
    try {
      updateBanqueDto.logo = file ? file.filename : null ;
      const updatedBank = await this.banqueService.updateBank(bankId, updateBanqueDto);
      return response.status(HttpStatus.OK).json({
        message: 'Bank updated successfully',
        updatedBank,
      })
      
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
    }
  }

  @Get()
  async getAllBank(@Res() response) {
    try {
      const banksData = await this.banqueService.getAllBanks();
      return response.status(HttpStatus.OK).json({
        message: 'Banks retrieved successfully',
        banksData
      });
    } catch (err) {
      return response.status(err.status).json(err.response)
      
    }
  }

  @Get('/:id')
  async getBankById(@Res() response, @Param('id') bankId: string){
    try {
      const bankData = await this.banqueService.getBankById(bankId);
      return response.status(HttpStatus.OK).json({
        message: 'Bank retrieved successfully',
        bankData,
      })
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
      
    }
  }

  @Delete('/:id')
  async deleteBank(@Res() response, @Param('id') bankId: string) {
    try {
      const deletedBank = await this.banqueService.deleteBank(bankId);
      return response.status(HttpStatus.OK).json({
        message: 'Bank deleted successfully',
        deletedBank,  
        })
      
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
      
    }
  }

}
