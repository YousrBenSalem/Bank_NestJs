/* eslint-disable prettier/prettier */

import { Controller, Body, Param, Put, Res, HttpStatus, Get, Delete, UseGuards, Query } from '@nestjs/common';
import { PersonneService } from './personne.service';

import { ApiTags } from '@nestjs/swagger';
import { HachagePasswordDto } from './dto/hachage-password.dto';
import { UpdatePersonneDto } from './dto/update-personne.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
@ApiTags('personne')
@Controller('personne')
export class PersonneController {
  constructor(private readonly personneService: PersonneService) {}
    
  @Put("personne/:id")
  async  updatePassword(@Res() response ,
    @Param("id") id: string, 
    @Body() hachagePasswordDto: HachagePasswordDto ){
      try {
        const hachedPassword = await  this.personneService.hachPassword( hachagePasswordDto , id);
        return response.status(HttpStatus.OK).json(hachedPassword);
        
      } catch (error) {
    return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'error , user password not updated'+error,
        })
        
      }
  }






  

@UseGuards(AccessTokenGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePersonneDto: UpdatePersonneDto) {
    return this.personneService.update(id, updatePersonneDto);
  }
@UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personneService.remove(id);
  }


    @Get('findOr')
  async findOneOr(
  @Query('email') email: string,
  @Query('nom') nom: string,
  @Res() res,
) {
  try {
    
    const user = await this.personneService.findUserByNameOrEmail({ email, nom });
    return res.status(HttpStatus.OK).send({
      success: true,
      message: "L'élément est affiché",
      data: user,
    });

  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      success: false,
      message: "L'élément n'est pas affiché: " + error.message,
      data: null,
    });
  }
}
    
  @Get('find-and')
  async findUserByNameAndEmail(
    @Query('name') name: string,
    @Query('email') email: string,
    @Res() res,

  ) {
      try {
    
    const user = await this.personneService.findUserByNameAndEmail({ email, name });
    return res.status(HttpStatus.OK).send({
      success: true,
      message: "L'élément est affiché",
      data: user,
    });

  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      success: false,
      message: "L'élément n'est pas affiché: " + error.message,
      data: null,
    });
  }
  }

    @Get("verify/:code")
  async verifyCode(@Param('code') code: string ,   @Res() res,
) {
    return this.personneService.VerificationCode(code , res );

  }
}
