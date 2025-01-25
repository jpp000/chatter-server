import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User, res: Response) {
    const payload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    res.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  logout(res: Response) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
