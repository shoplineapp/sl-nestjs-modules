# @sl-nest-module/aes

[Crypto JS](https://github.com/brix/crypto-js) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nest-module/aes
```

## Usage

For the detail of the encryption default setting, see [here](https://cryptojs.gitbook.io/docs/#ciphers).

### Registering Module

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { AESModule } from '@sl-nest-module/aes';

@Module({
  imports: [AESModule],
  providers: [FooService],
})
export class FooModule {}
```

### Encrypt Message

`AESService.encrypt`

| Parameter  | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| message    | The message to be encrypted. A message can be any string.                                 |
| passphrase | The passphrase used to generate a 256-bit encryption key. A passphrase can be any string. |

### Decrypt Message

`AESService.decrypt`

| Parameter  | Description                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ciphertext | The ciphertext to be decrypted. A ciphertext is a stringify CipherParams object created by the encrypt function.               |
| passphrase | The passphrase used to generate a 256-bit decryption key. A decryption passphrase should be same of the encryption passphrase. |

An empty string will be returned if fail to decrypt ciphertext.

```typescript
// foo.service.ts

import { Injectable } from '@nestjs/common';
import { AESService } from '@sl-nest-module/aes';

@Injectable()
export class FooService {
  constructor(private readonly aesService: AESService) {}

  foo() {
    try {
      const message = '<message to be encrypted>';
      const passphrase = '<passphrase>';
      const cipherText = aesService.encrypt(message, passphrase);
      const plainText = aesService.decrypt(cipherText, passphrase);
      console.log(message === plainText); // true
      //...
    } catch (error) {
      // Handle error
    }
  }
}
```
