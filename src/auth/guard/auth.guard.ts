import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGaurd implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if(!token) console.log('token not found')
        if(!token) throw new UnauthorizedException()
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.config.get('JWT_SECRET'),
                }
            )

            request["user"] = payload
        } catch (error) {
            throw new UnauthorizedException()
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorizationHeader = request.headers['authorization'];
        if (typeof authorizationHeader === 'string') {
            const [type, token] = authorizationHeader.split(' ');
            return type === 'Bearer' ? token : undefined;
        }
        return undefined;
    }
}