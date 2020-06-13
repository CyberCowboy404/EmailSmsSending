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

Create contact first in order to send a message
```js
const app = new Application();

const adminId = app.createAdmin({ name: 'John', email: 'john@gmail.com' }).info.id;
const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
const contact = {
  name: 'George',
  phoneNumber: '+123456789',
  email: 'george@gmail.com'
};

const status = app.createContact({ accountId, adminId, contact });

const contentSms = 'I will not spam you sms';
const contentLetter = 'I will not spam you email';

const sms = app.createSms({ adminId, accountId, content: contentSms }).info;
const letter = app.createLetter({ adminId, accountId, content: contentLetter }).info;
```

Also if some users were unsubscribed, application will add their in to global blacklist.
If some email address or phone number are in blacklist, those contacts will not be added to any account.

During sms/letter creation app automatically import all your contacts. That contacts will be using for sending.





