import { Module } from '@nestjs/common';
import { AESService } from './aes.service';

@Module({
  providers: [AESService],
  exports: [AESService],
})
export class AESModule {}
