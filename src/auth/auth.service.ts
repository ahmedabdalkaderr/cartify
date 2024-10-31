import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class AuthService {
  usersService: any;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!user || !isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.name,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return { user, token };
  }
}
