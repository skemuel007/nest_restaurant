import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { UserDisplayDto } from './dto/user-display.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post('/signup')
    async signUp(@Body() signupDto: SignupDto): Promise<User> {
        return this.authService.signUp(signupDto);
    }

    @Post('/login')
    async login(@Body() LoginDto: LoginDto): Promise<{ token: string, user: UserDisplayDto }> {
        return this.authService.login(LoginDto);
    }
}
