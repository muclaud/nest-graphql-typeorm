import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';
import { LogInput } from '../dto/login.input';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(LogInput: LogInput): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(LogInput);
  }
}
