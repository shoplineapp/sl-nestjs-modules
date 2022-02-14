import { Test } from '@nestjs/testing';
import { AES, enc } from 'crypto-js';
import { AESService } from './aes.service';

describe('AwsLambdaService', () => {
  let service: AESService;
  const message = 'test-message';
  const passphrase = 'test-passphrase';
  const incorrectPassphrase = 'incorrect-passpharse';
  const cipherParams = AES.encrypt(message, passphrase);
  const ciphertext = enc.Base64.stringify(enc.Utf8.parse(cipherParams.toString()));

  const fakeCipherParams = AES.encrypt(message, incorrectPassphrase);
  const fakeCipherText = enc.Base64.stringify(enc.Utf8.parse(fakeCipherParams.toString()));

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AESService],
    }).compile();

    service = module.get(AESService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('#encrypt', () => {
    test('should return ciphertext', async () => {
      const aesSpy = jest.spyOn(AES, 'encrypt').mockReturnValue(cipherParams);
      expect(service.encrypt(message, passphrase)).toBe(ciphertext);
      expect(aesSpy).toBeCalledWith(message, passphrase);
    });
  });

  describe('#decrypt', () => {
    test('should return plaintext', async () => {
      const aesSpy = jest.spyOn(AES, 'decrypt');
      expect(service.decrypt(ciphertext, passphrase)).toBe(message);
      expect(aesSpy).toBeCalledWith(cipherParams.toString(), passphrase);
    });

    test('should return empty string', async () => {
      const aesSpy = jest.spyOn(AES, 'decrypt');
      expect(service.decrypt(fakeCipherText, passphrase)).toBe('');
      expect(aesSpy).toBeCalledWith(fakeCipherParams.toString(), passphrase);
    });
  });
});
