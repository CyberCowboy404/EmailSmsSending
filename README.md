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

Look at `coverage folder` to check code test coverage
