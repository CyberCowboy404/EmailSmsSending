// Use this file in order to test how application working
// todo: run linter and check lint errors

import { Application } from './Application';
import data from './data/contacts';

const app = new Application();

app.createAdmin({ name: 'John', email: 'john@gmail.com' });
app.createAdmin({ name: 'Valera', email: 'john@gmail.com' });
app.createAdmin({ name: 'Valera', email: 'john@gmail.com' });
const account = app.createAccount({ adminId: '123', name: 'My Account' });
console.log('account: ', account);
// const admin = app.getAdminByEmail('john@gmail.com');
// console.log('admin: ', admin);

// if (admin) {
//   // create account and bound it to admin by admin id
//   const account = app.createAccount({ name: 'My Account', adminId: admin.id });

// }