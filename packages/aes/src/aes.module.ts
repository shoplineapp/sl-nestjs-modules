import { Module } from '@nestjs/common';
import { AESService } from './aes.service';

/**
 * [Crypto JS](https://github.com/brix/crypto-js) module for [NestJS](https://docs.nestjs.com/) project
 */
@Module({
  providers: [AESService],
  exports: [AESService],
})
export class AESModule {}
