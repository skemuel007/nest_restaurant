import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import ApiFeatures from '../utils/api-features.util';
import { JwtService } from '@nestjs/jwt';
import { UserDisplayDto } from './dto/user-display.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private jwtService: JwtService
    ) {

    }

    async signUp(signupDto: SignupDto): Promise<User> {
        const { name, email, password } = signupDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {

            const user = await this.userModel.create({
                name,
                email,
                password: hashedPassword
            });

            return this.sanitizeUser(user);

        } catch (error) {
            console.log(error);
            if (error.code === 11000) {
                throw new ConflictException('Duplicate email entered');
            }
        }
    }

    sanitizeUser(user: User) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
    }

    async login(loginDto: LoginDto): Promise<{ token: string, user: UserDisplayDto }> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email }).select('password email name');

        if (!user) {
            throw new UnauthorizedException('Invalid email address or password.');
        }

        // check if password is correct
        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email address or password');
        }

        const token = await ApiFeatures.assignJwtToken(user._id, this.jwtService);
        const userDisplay: UserDisplayDto = {
            _id: user._id,
            name: user.name,
            email: user.email
        };

        return { token, user: userDisplay }
    };
}
