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
    const result = AES.encrypt(message, passphrase).toString();
    const encodedData = enc.Base64.stringify(enc.Utf8.parse(result));

    return encodedData;
  }

  /**
   * decrypt message with passphrase
   * @param ciphertext The ciphertext to be decrypted, which is a stringify CipherParams object.
   * @param passphrase The passphrase used to generate a 256-bit decryption key. A decryption passphrase should be same of the encryption passphrase.
   * @return The plaintext string. An empty string will be returned if fail to decrypt ciphertext
   */
  decrypt(ciphertext: string, passphrase: string) {
    const decData = enc.Base64.parse(ciphertext).toString(enc.Utf8);
    const result = AES.decrypt(decData, passphrase).toString(enc.Utf8);

    return result;
  }
}
