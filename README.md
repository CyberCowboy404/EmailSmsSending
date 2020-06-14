## TypeScript application to send sms/email to contact lists

## Description
You can create different Applications and create Admin and Accounts inside.
Each account has own contact list which can be used to send sms and email with unsubscription mechanism.
Application can get unsubscribe events and add users to blacklist if they don't want to receive any information using email/sms

## To start app

Install necassary node modules
```sh
  npm i
```

Compile typescript
```sh
  npm run compile
```

Start nodejs application
```sh
  npm start
```

## Development mode
Install required modules `npm i` and run typescript in watch mode
```sh
  npm run watch
```
Application will be recompiled all time when you change files in `src` dir

Start nodejs application
```sh
  npm start
```

Nodemon will rerun server when new build files will be available

## To run tests
```sh
  npm tests
```
`Jest` is using as test runner.

Look at `coverage` folder to check code test coverage

## How to use application

You can use `src/index.ts` file to check how app works.

### To create application

```js
import { Application } from './Application';

const app = new Application();
```
Now `app` in instance which you can use to fully control application and create models.

- admins
- accounts
- contacts
- letters
- sms

To see visually all logic and relations you can use this minmup.
During development some relations has been changed, but still there are project flow
[How it works](https://mindmup-export.s3.amazonaws.com/map.png/out/7140efa0ad8811eaae16172d734f0ef9.map.png?AWSAccessKeyId=ASIASNCK5ADR2VE342HX&Expires=1592154811&Signature=5lDEUM1OTNa5P83n1smmrYIdC6g%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEP7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDXSHRW72upWyrYllm0LHtPncI4Oo0teIVGuhKKOwYuwgIhAKXOT23nkZeQ1tG4U6TsRfnaz9idM9uQ5%2BfsH36stQC9Ks8BCHcQABoMMTY1NTEzMzMwOTE1IgzjPchOnr1lzN3aphEqrAHtD4iT%2F3DndB71DJdxQknxdfr5sO28lMyb%2F0q53Csd2u8K%2BTgC1w6SUYL%2BFfo60TiI4qaWQAHaboTT0a85Nltxr0vvmC3MhZp8%2FlNlz3hyBK3yIVzjKO9BtH3FIvNEM%2F0VNPVh7408gMLNAFuYT%2FhXGIMEwZFIMQ7kWKOHUpHK%2F%2BPAogIF%2FqBI%2Beyv%2BfjlhTuO%2F%2FYunhtrBqgy4vuCAO7LdJ2DWbHpbcEj5iKtMOi2k%2FcFOt8BSTuSfwF0LwEgZOT00baTGKxINH8CFiAg60uIHFEjW6IIeTNBQq%2Bz4rqv0ufwZaWxJZvN5RaQdNOFx9wDlaS1IjnwSiAPDrAqbL0ACNYWnnXR4B3RATjI5oDCtNU34jSP04RWWK%2Bza1gr8YYB43sBTIBHy7bxY6W1ZHrXouwbugtjUPFrB4L%2FnMWZsCMADirIvKEJJQaelaE68uRfX6yhOHH0pjWtOkknENMRsU8imRUvyfdjrEp7dj7GHWeVkJVXhGW40y327YrfEyfv2ifJSTdXaFzQsN6Jw6xk94gTIA%3D%3D)

### To create admin and account

```js
const adminId = app.createAdmin({ name: 'John', email: 'john@gmail.com' }).info.id;
const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
```

Every method returns `MessageInterface` with operation status, message, and additional information.
Use `info` object to get additional information and id's

### To send messages

In order to send message you have to create contact first.
If email address or phone number are in blacklist, those contacts will not be added to the account.

```js
const app = new Application();

const adminId = app.createAdmin({ name: 'John', email: 'john@gmail.com' }).info.id;
const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;

const contact = {
  name: 'George',
  phoneNumber: '+123456789',
  email: 'george@gmail.com'
};

app.createContact({ accountId, adminId, contact });

const contentSms = 'I will not spam you sms';
const contentLetter = 'I will not spam you email';

const resultSms = app.send('sms', { adminId, accountId, content: contentSms });
const resultLetter = app.send('letter', { adminId, accountId, content: contentLetter });

```

If some user unsubscribe, application will add his number/email to the global blacklist.

After sucessfull message you'll get something like this

```sh
 message: 'I will not spam you email in order to unsubscribe follow this link https://www.someDummySite.com/?token=5ac6b64d177083563ff1abf5dcd01c3534a5d0dcf95ff88200c56084d4e6bfafa66f2c51f2bdffdf4455f4f99790cca00d805714ee9abfacaad94354261d0eb17e660fff4170383a034a93db9f240b7419d1b1a9b46986b3b4f05a7a1f8c0007ca3534320d6f7d561039b9971723ceeaab58ce63cfd8a934d11298202e0a7a751d3f41cf083e49a21e314d15748359994c168125b35800335b925f27edcbe4af95dad072de0464cebdad639ed459ba1a181c51f9876acff5b7d317cb2683721950463894003682458d45c3c0861587e44c747c83b3d75d4e361b364d346be728dfa9a88daabf8fd4c4e9423c66dc2b9425396200a197ee8826517d2e9e8d9a7466ea4b8afebe75215a43d365661f0c1295f9f1c1f55f41f6ae04e9a0425f876add1037580488787d31ddd0b6eb379419'
```

Where `/?token=` value is encrypted user data in such format

```js
`{
  "accountId":"${contact.accountId}",
  "contactId":"${contact.id}",
  "phoneNumber": "${contact.phoneNumber || false}",
  "email": "${contact.email || false}",
  "unsubscribeSource": "${unsubscribeSource}",
  "token":"${contact.token}"
}`
```

Each contact has uniq token which have to match with account contact in order to unsubscribe.


### To unsubscribe

```js
app.unsubsribeLink(link);
```
Pass encrypted link from previous step and app securely add the user to the blacklist;

Depending on different `UNSUBSCRIBE_STATUS` app will handle type of unsubscription.

### To unsubscribe from CRM

```js
app.unsubsribeCRM({adminId, data: {
  email: 'user@email.com',
  phoneNumber: '+712345678',
  accountId,
  type: 'sms' || 'letter',
  unsubscribeSource: 'EMAIL_LINK' | 'CRM' | 'SMS_LINK'
}});
```
### Resubscribe user
```js
app.resubscribe({ accountId, adminId, email, phoneNumber });
```

You should pass at least one contact detail, phoneNumber or email
