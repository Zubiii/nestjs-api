import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2'

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if (!user) throw new NotFoundException('User name or password is wrong, please try again!')

    const passMatch = await argon.verify(user.hash, dto.password)

    if (!passMatch) throw new NotFoundException('User name or password is wrong, please try again!')

    const {id, email, firstName, lastName} = user

    return {
      access_token: await this.siginToken(id, email, firstName, lastName) 
    }
  }

  async signup(dto: AuthDto) {
   try{
     const hash = await argon.hash(dto.password)

     const newUser = await this.prisma.user.create({
       data: {
         email: dto.email,
         hash
       },
       select: {
         id: true,
         firstName: true,
         lastName: true,
         email: true,
         createdAt: true
       }
     })
 
     return newUser;
   } catch (error) {
    if (error.code === 'P2002') {
      throw new ForbiddenException('Email is already register, please signin!')
    }
    throw error
   }
  }

  siginToken(id: Number, email: String, firstName: String, lastName: String): Promise<String> {
    const payload = { 
      sub: id,
      email,
      firstName,
      lastName
    }

    return this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m'
    })
  }
}
