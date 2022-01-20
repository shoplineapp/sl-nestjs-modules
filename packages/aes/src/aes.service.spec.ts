import { Test } from '@nestjs/testing';
import { AES } from 'crypto-js';
import { AESService } from './aes.service';

describe('AwsLambdaService', () => {
  let service: AESService;
  const message = 'test-message';
  const passphrase = 'test-passphrase';
  const incorrectPassphrase = 'incorrect-passpharse';
  const cipherParams = AES.encrypt(message, passphrase);
  const ciphertext = cipherParams.toString();

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
      expect(aesSpy).toBeCalledWith(ciphertext, passphrase);
    });

    test('should return empty string', async () => {
      const aesSpy = jest.spyOn(AES, 'decrypt');
      expect(service.decrypt(ciphertext, incorrectPassphrase)).toBe('');
      expect(aesSpy).toBeCalledWith(ciphertext, incorrectPassphrase);
    });
  });
});
