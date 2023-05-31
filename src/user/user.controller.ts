import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/decorator';

@Controller('user')
export class UserController {

    // @Public()
    @Get('me')
    getMe() {
        return "User Info"
    }
}
