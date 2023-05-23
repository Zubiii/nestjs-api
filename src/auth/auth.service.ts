import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signin() {
    return {
      message: "I'm in signin.",
    };
  }

  signup() {
    return {
      message: "I'm in signup.",
    };
  }
}
