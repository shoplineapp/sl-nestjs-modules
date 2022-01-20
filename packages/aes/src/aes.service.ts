import { Injectable } from '@nestjs/common';
import { AES, enc } from 'crypto-js';

/** Service class providing interface to Crypto JS */
@Injectable()
export class AESService {
  /**
   * encrypt message with passphrase
   * @param message The message to be encrypted
   * @param passphrase The passphrase used to generate a 256-bit encryption key
   * @return The ciphertext, which is a stringify CipherParams object
   */
  encrypt(message: string, passphrase: string) {
    return AES.encrypt(message, passphrase).toString();
  }

  /**
   * decrypt message with passphrase
   * @param ciphertext The ciphertext to be decrypted, which is a stringify CipherParams object.
   * @param passphrase The passphrase used to generate a 256-bit decryption key. A decryption passphrase should be same of the encryption passphrase.
   * @return The plaintext string. An empty string will be returned if fail to decrypt ciphertext
   */
  decrypt(ciphertext: string, passphrase: string) {
    return AES.decrypt(ciphertext, passphrase).toString(enc.Utf8);
  }
}
