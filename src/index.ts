import { Application } from './Application';
import data from './data/contacts';
import { generateToken } from './helpers/encryption';

const app = new Application();

app.createAdmin({ name: 'John', email: 'john@gmail.com' });
const admin = app.getAdminByEmail('john@gmail.com');

if (admin) {
  // create account and bound it to admin by admin id
  const account = app.createAccount({ name: 'My Account', adminId: admin.id });
  const account2 = app.createAccount({ name: 'My Account2 ', adminId: admin.id });
  if (account && account2) {
    const accountId = account.data.id;
    const account2Id = account2.data.id;
    const adminId = admin.id;

    app.createContact({ adminId, accountId, contact: data.contacts1(accountId) });
    app.createContact({ adminId, accountId, contact: data.contacts2(accountId) });
    app.createContact({ adminId, accountId: account2Id, contact: data.contacts2(accountId) });
    app.createContact({ adminId, accountId: account2Id, contact: data.contacts2(accountId) });

    const smsContent: string = 'I\'am sms';
    const letterContent: string = 'I\'am letter';

    const letter = app.createLetter({ accountId, adminId, content: letterContent });
    const sms = app.createSms({ accountId, adminId, content: smsContent });

    const smsId = sms.data.id;
    const letterId = letter.data.id;

    const sentLetter = app.sendLetter(letterId);
    // const sentSms = app.sendSms(smsId);

    // console.log('sentSms: ', sentSms);
    // const unsubcribe = sentSms?.data[0].message;
    const unsubcribeLetter = sentLetter?.data[0].message;
    // const unsubcribeLink = unsubcribe.replace(/.*token=/,'');
    const unsubcribeLinkLetter = unsubcribeLetter.replace(/.*token=/, '');
    const unsubscribeDataEmailCRM: any = {
      email: 'jenifer@gmail.com',
      type: 'letter',
      accountId,
      unsubscribeSource: 'CRM',
    };
    const unsubscribeDataPhoneCRM: any = {
      phoneNumber: '+7808080808080',
      type: 'sms',
      accountId,
      unsubscribeSource: 'CRM',
    };
    // const unsubResLet = app.unsubsribeLink(unsubcribeLinkLetter);
    const unsibscribeCRMStatusLetter = app.unsubscribeCRM({ adminId, data: unsubscribeDataEmailCRM });
    const unsibscribeCRMStatusSms = app.unsubscribeCRM({ adminId, data: unsubscribeDataPhoneCRM });
    console.log('unsibscribeCRMStatusSms: ', unsibscribeCRMStatusSms);
    // console.log('unsubcribe: ', unsubcribe);
    // console.log('sentLetter: ', sentLetter);

  }
}