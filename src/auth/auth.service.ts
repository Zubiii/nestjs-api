import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

import * as argon from 'argon2'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signin(dto: AuthDto) {
    // Get user from db
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    // send error to user
    if (!user) throw new NotFoundException('User name or password is wrong, please try again!')

    // if user exist compare his password
    const passMatch = await argon.verify(user.hash, dto.password)

    // Send back the user
    if (!passMatch) throw new NotFoundException('User name or password is wrong, please try again!')

    delete user.hash
    return user
  }

  async signup(dto: AuthDto) {
   try{
     // Generating the password Hash
     const hash = await argon.hash(dto.password)

     // Save the new User in DB
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
}
