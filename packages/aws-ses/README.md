# @sl-nest-module/aws-ses

AWS SES NestJS Module

## Installation

```sh
yarn add @sl-nest-module/aws-ses
```

### Registering Module

```ts
import { AwsSesModule } from '@sl-nest-module/aws-ses';

@Module({
  imports: [
    /* Other Modules */
    AwsSesModule.registerSync(),
  ]
})
export class SomeModule {}
```

### Sending Email

```ts

@Injectable()
export class SomeService {
  constructor(private readonly ses: AwsSesService) {}

  async actionToSendEmail(req: EmailServiceSendRequest) {
    const {
      sender,
      body,
      subject,
      toAddresses,
    } = res;

    try {
      await this.ses.sendEmail({
      sender,
      body,
      subject,
      toAddresses,
    });
    } catch (error) {
      console.error('Encounter error on send email', error);
    }
  }
}
```