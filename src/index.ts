import { Application } from './Application';
import { ContactInterface } from './interfaces/Contact.interface';
import data from './data/contacts';
import tools from './helpers/tools';

const app = new Application();

app.createAdmin({ name: 'John', email: 'john@gmail.com' });
const admin = app.getAdminByEmail('john@gmail.com');

// todo: create something like active user
if (admin) {
  // create account and bound it to admin by admin id
  const account = app.createAccount({ name: 'My Account', adminId: admin.id });
  if (account) {
    const accountId = account.data.id;
    
    app.createContact({ adminId: admin.id, accountId, contact: data.contacts1(accountId) });
    app.createContact({ adminId: admin.id, accountId, contact: data.contacts2(accountId) });
    app.createContact({ adminId: admin.id, accountId, contact: data.contacts3(accountId) });
    app.createContact({ adminId: admin.id, accountId, contact: data.contacts4(accountId) });
  }
}