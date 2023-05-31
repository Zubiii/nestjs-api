import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGaurd implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        // if route is decorate with the '@Pulic()' decorator then authguard will automatically returns true and validates the req
        const IS_PUBLIC_KEY = 'isPublic'
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        console.log('isPublic => ', isPublic)

        if(isPublic) return true

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