import { Injectable } from '@nestjs/common';
import { AES, enc } from 'crypto-js';

@Injectable()
export class AESService {
  encrypt(message: string, passphrase: string) {
    return AES.encrypt(message, passphrase).toString();
  }

  decrypt(ciphertext: string, passphrase: string) {
    return AES.decrypt(ciphertext, passphrase).toString(enc.Utf8);
  }
}
