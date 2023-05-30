import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          /**
           * There are two ways to access env file now.
           *  1. process.env.DATABASE_URL
           *  2. By using ConfigService from '@nestjs/config'
           * Let's try second way
           */
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}
