import { Application } from './Application';
import data from './data/contacts';

const app = new Application();

app.createAdmin({ name: 'John', email: 'john@gmail.com' });
const admin = app.getAdminByEmail('john@gmail.com');

// todo: create something like active user
if (admin) {
  // create account and bound it to admin by admin id
  const account = app.createAccount({ name: 'My Account', adminId: admin.id });
  if (account) {
    const accountId = account.data.id;
    const adminId = admin.id;

    app.createContact({ adminId, accountId, contact: data.contacts1(accountId) });
    app.createContact({ adminId, accountId, contact: data.contacts2(accountId) });
    app.createContact({ adminId, accountId, contact: data.contacts3(accountId) });
    app.createContact({ adminId, accountId, contact: data.contacts4(accountId) });
    const smsContent: string = 'I\'am sms';
    const letterContent: string = 'I\'am letter';
    const sms = app.createSms({ accountId, adminId, content: smsContent });
    const letter = app.createLetter({ accountId, adminId, content: letterContent });
    console.log('sms: ', sms);
    console.log('letter: ', letter);
  }
}