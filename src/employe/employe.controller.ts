/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Param, Delete, Res, HttpStatus, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EmployeService } from './employe.service';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@ApiTags('employe')
@Controller('employe')
export class EmployeController {
  constructor(private readonly employeService: EmployeService) {}

  @ApiConsumes('multipart/form-data')
@ApiBody({
  schema:{
    type: 'object',
    properties: {
      name: { type: 'string' },
      prenom:{type:'string'},
      adresse :{type:'string'},
      email:{type:'string'},
      password :{type:'string'},
      image:{
        type:'string',
        format: 'binary',
      },
      cin:{type:'string'},
      photoCin:{
        type:'string',
        format: 'binary',
      },
      autreFichier:{
        type:'array',
        items:{
          type:'string',
          format: 'binary',
        }
      },
      salaire:{
        type:'number',
      },
      numINSEE :{
        type:'number',

      },
      item:{
        type : 'string',
        default:'Employe'
      },
      banqueId:{
        type:'string',
      }

    }
  }
})
  @Post()
      @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 }, 
        { name: 'photoCin', maxCount: 1 }, 
        { name: 'autreFichier', maxCount: 5 }, 
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            cb(null, `${new Date().getTime()}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async createEmploye(
    @Res()  response ,
    @Body() createEmployeDto: CreateEmployeDto,
      @UploadedFiles() files: {
        image;
        photoCin;
        autreFichier;
    },
  ){
    try {
      createEmployeDto.image = files.image ? files.image[0].filename : null;
      createEmployeDto.photoCin = files.photoCin ? files.photoCin[0].filename : null;

      
      if (files.autreFichier) {
        createEmployeDto.autreFichier = files.autreFichier.map((file) => file.filename);
      } else {
        createEmployeDto.autreFichier = [];
      }
      const newEmploye = await this.employeService.createEmploye(createEmployeDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Employe created successfully',
        newEmploye,
      })
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode :400,
        message: 'Error creating employe'+err,
        })  
    }
  }
  @ApiConsumes('multipart/form-data')
@ApiBody({
  schema:{
    type: 'object',
    properties: {
      name: { type: 'string' },
      prenom:{type:'string'},
      adresse :{type:'string'},
      email:{type:'string'},
      password :{type:'string'},
      image:{
        type:'string',
        format: 'binary',
      },
      cin:{type:'string'},
      photoCin:{
        type:'string',
        format: 'binary',
      },
      autreFichier:{
        type:'array',
        items:{
          type:'string',
          format: 'binary',
        }
      },
      salaire:{
        type:'number',
      },
      numINSEE :{
        type:'number',

      },
      item:{
        type : 'string',
        default:'Employe'
      },
  

    }
  }
})
  @Put('/:id')
    @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 }, 
        { name: 'photoCin', maxCount: 1 }, 
        { name: 'autreFichier', maxCount: 5 }, 
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            cb(null, `${new Date().getTime()}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async updateClient(
    @Res()  response ,
    @Param('id') id: string,
    @Body() updateEmployeDto:UpdateEmployeDto,
        @UploadedFiles() files: {
      image;
      photoCin;
      autreFichier;
    },
  ){
    try {
      updateEmployeDto.image = files.image ? files.image[0].filename : null;
      updateEmployeDto.photoCin = files.photoCin ? files.photoCin[0].filename : null;

      
      if (files.autreFichier) {
        updateEmployeDto.autreFichier = files.autreFichier.map((file) => file.filename);
      } else {
        updateEmployeDto.autreFichier = [];
      }
      const updatedClient = await this.employeService.updateEmploye(id, updateEmployeDto);
      return response.status(HttpStatus.OK).json({
        message: 'Employe updated successfully',
        updatedClient,
      })
      
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
    }
  }

    @Get('/:id')
  async getEmployeById(@Res() response, @Param('id') employeId: string){
    try {
      const employeData = await this.employeService.getEmployeById(employeId);
      return response.status(HttpStatus.OK).json({
        message: 'Employe retrieved successfully',
        employeData,
      })
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
      
    }
  }

    @Get()
  async getAllEmployes(@Res() response) {
    try {
      const employesData = await this.employeService.getAllEmployes();
      return response.status(HttpStatus.OK).json({
        message: 'Employes retrieved successfully',
        employesData
      });
    } catch (err) {
      return response.status(err.status).json(err.response)
      
    }
  }

    @Delete('/:id')
  async deleteEmploye(@Res() response, @Param('id') employeId: string) {
    try {
      const deletedEmploye = await this.employeService.deleteEmploye(employeId);
      return response.status(HttpStatus.OK).json({
        message: 'Employe deleted successfully',
        deletedEmploye,  
        })
      
    } catch (err) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err.response)
      
    }
  }

}
