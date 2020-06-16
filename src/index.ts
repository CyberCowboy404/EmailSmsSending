// Use this file in order to test how application working
// todo: run linter and check lint errors

import { Application } from './Application';
import * as data from './data/contacts';

const app = new Application();

// ________________________________________________________________________________________
const admin1 = {
  email: 'admin1@gmail.com',
  name: 'admin1'
};

const adminId = app.createAdmin(admin1).info.id;
const accountId = app.createAccount({ adminId, name: 'Account 1' }).info.id;

const contact = {
  phoneNumber: '+1111111',
  email: 'contact1@gmail.com',
  name: 'Contact 1',
  accountId,
};

const status = app.createContact({ adminId, accountId, contact });

const smsStatus = app.send('sms', { adminId, accountId, content: 'sms1' });
// ________________________________________________________________________________________

const admin2 = {
  email: 'admin2@gmail.com',
  name: 'admin2'
};

const adminId2 = app.createAdmin(admin2).info.id;
const accountId2 = app.createAccount({ adminId: adminId2, name: 'Account 2' }).info.id;

const contact2 = {
  phoneNumber: '+222222',
  email: 'contact1@gmail.com',
  name: 'Contact 2',
  accountId: accountId2,
};

const status2 = app.createContact({ adminId: adminId2, accountId: accountId2, contact: contact2 });

// ________________________________________________________________________________________

const admin3 = {
  email: 'admin3@gmail.com',
  name: 'admin3'
};

const adminId3 = app.createAdmin(admin3).info.id;
const accountId3 = app.createAccount({ adminId: adminId3, name: 'Account 3' }).info.id;

const contact3 = {
  phoneNumber: '+222222',
  email: 'contact2@gmail.com',
  name: 'Contact 3',
  accountId: accountId3,
};

app.createContact({ adminId: adminId3, accountId: accountId3, contact: contact3 });
app.createContact({ adminId: adminId3, accountId: accountId3, contact: contact });

let emailStatus = app.send('letter', { accountId, adminId, content: 'Account 1 send email' });

const message = emailStatus?.info.sent[0].message.replace(/.*token=/, '');

const unsubcribestatus = app.unsubsribeLink(message);

let emailStatus2 = app.send('letter', { accountId: accountId2, adminId: adminId2, content: 'Account 2 send email' });
const smsStatus2 = app.send('sms', {accountId: accountId2, adminId: adminId2, content: 'Account 2 send sms'});

// console.log('smsStatus2: ', smsStatus2);
// console.log('emailStatus2: ', emailStatus2);

// console.log('blacklist', app.blacklist);
// console.log('unsubcribestatus: ', unsubcribestatus);

// console.log('message: ', message);

