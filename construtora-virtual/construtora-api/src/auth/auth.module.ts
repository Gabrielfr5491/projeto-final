import { Module } from '@nestjs/common';

import { JwtModule }
from '@nestjs/jwt';

import { AuthService }
from './auth.service';

import { AuthController }
from './auth.controller';

import { UsuariosModule }
from '../usuarios/usuarios.module';

@Module({

  imports: [

    UsuariosModule,

    JwtModule.register({

      secret:
      'CONSTRUTORA_SECRET',

      signOptions: {
        expiresIn: '1d'
      }

    })

  ],

  controllers: [
    AuthController
  ],

  providers: [
    AuthService
  ]

})
export class AuthModule {}