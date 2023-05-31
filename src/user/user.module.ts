import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthGaurd } from 'src/auth/guard';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGaurd
    }
  ]
})
export class UserModule {}
