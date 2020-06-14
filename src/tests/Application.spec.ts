//@ts-nocheck

import { Application } from '../Application';
import { Admin } from '../Admin';
import messages from '../helpers/messages'
import { cloneDeep } from 'lodash'
import { decrypt, encrypt } from '../helpers/encryption';

const contact1 = {
  name: 'George',
  phoneNumber: '+1323456789',
};

const contact2 = {
  name: 'George',
  phoneNumber: '+123456789',
};

const contact3 = {
  name: 'George',
  phoneNumber: '+2123456789',
  email: 'order@gmail.com'
};

const contact4 = {
  name: 'George',
  phoneNumber: '+3123456789',
  email: '4order@gmail.com'
};

describe("Application class", () => {
  it("should init Application class properly", () => {
    const app = new Application();

    expect(app).toBeDefined();
    expect(app instanceof Application).toBeTruthy();
  });

  describe('Admin creation', () => {
    it("should create application admin properly", () => {
      const app = new Application();
      const email = 'test@i.ua';
      const name = 'John';
      const statusMessage = app.createAdmin({ email, name });
      const successMessage = messages.admin.created({ name, email });
      const admin = app.getAdminByEmail(email);
      expect(statusMessage).toEqual({ ok: true, message: successMessage, info: { id: statusMessage.info.id } });
      expect(admin instanceof Admin).toBeTruthy();
      expect(admin.id.length == 9).toBeTruthy();
      expect(admin.createTime > 1).toBeTruthy();
      expect(admin.name == name).toBeTruthy();
      expect(admin.email == email).toBeTruthy();
    });

    it("should not create admin because fail of validation", () => {
      const app = new Application();

      let statusMessage = app.createAdmin({ name: 'John', email: '' });
      expect(statusMessage.ok).toBeFalsy();
      expect(app.admins.length === 0).toBeTruthy();

      let statusMessage = app.createAdmin({ name: '', email: 'John' });
      expect(statusMessage.ok).toBeFalsy();
      expect(app.admins.length === 0).toBeTruthy();

      let statusMessage = app.createAdmin({ name: 'john', email: 'john' });
      expect(statusMessage.ok).toBeFalsy();
      expect(app.admins.length === 0).toBeTruthy();

      let statusMessage = app.createAdmin({ name: 'john', email: 'john@i' });
      expect(statusMessage.ok).toBeFalsy();
      expect(app.admins.length === 0).toBeTruthy();
    });

    it("should not create admin if another admin already has such email", () => {
      const app = new Application();

      const admin1Status = app.createAdmin({ name: 'John', email: 'john@gmail.com' });
      expect(admin1Status.ok).toBeTruthy();

      const admin2Status = app.createAdmin({ name: 'Valera', email: 'john@gmail.com' });
      expect(admin2Status.ok).toBeFalsy();
    });
  });

  describe('Account creation', () => {
    it("should create account", () => {
      const app = new Application();
      // Create admin
      const email = 'test@i.ua';
      const name = 'John';
      const adminId = app.createAdmin({ email, name }).info.id;
      const accountStatus = app.createAccount({ adminId, name: 'My Account' });
      expect(app.accounts.length === 1).toBeTruthy();
      expect(accountStatus.ok).toBeTruthy();
    });

    it("should not create account if creating with not existed Admin", () => {
      const app = new Application();
      // Create admin
      const email = 'test@i.ua';
      const name = 'John';
      const statusMessage = app.createAdmin({ email, name });
      const admin = app.getAdminByEmail(email);

      expect(statusMessage.ok).toBeTruthy();
      expect(admin instanceof Admin).toBeTruthy();

      let accountStatus = app.createAccount({ adminId: admin.id, name: '' });
      expect(app.accounts.length === 0).toBeTruthy();
      expect(accountStatus.ok).toBeFalsy();

      let accountStatus = app.createAccount({ adminId: '123', name: 'My Account' });
      expect(app.accounts.length === 0).toBeTruthy();
      expect(accountStatus.ok).toBeFalsy();
    });
  });
  //todo: find out how to create phoneNumber validation
  //todo: phone number don't validating now
  describe('Contact creations', () => {
    it("should sucesfully create contact with email", () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contact1 = {
        name: 'George',
        email: 'gorge@gmail.com'
      };
      const status = app.createContact({ accountId, adminId, contact: contact1 });

      expect(app.getAccount(accountId).contacts.length > 0).toBeTruthy();
      expect(status.info.email === contact1.email).toBeTruthy();
      expect(status.info.token).toBeDefined();
    });

    it("should sucesfully create contact with phoneNumber", () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contact1 = {
        name: 'George',
        phoneNumber: '+123456789'
      };
      const status = app.createContact({ accountId, adminId, contact: contact1 });

      expect(app.getAccount(accountId).contacts.length > 0).toBeTruthy();
      expect(status.info.phone === contact1.phone).toBeTruthy();
      expect(status.info.token).toBeDefined();
    });

    it("should sucesfully create contact with both phone and email", () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contact1 = {
        name: 'George',
        phoneNumber: '+123456789',
        email: 'george@gmail.com'
      };
      const status = app.createContact({ accountId, adminId, contact: contact1 });

      expect(app.getAccount(accountId).contacts.length > 0).toBeTruthy();
      expect(status.info.phone === contact1.phone).toBeTruthy();
      expect(status.info.email === contact1.email).toBeTruthy();
      expect(status.info.token).toBeDefined();
    });

    it("should not create contact because of validation", () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contact1 = {
        name: 'George',
        email: 'gorge@gmail.com'
      };
      // Bad account Id
      let status = app.createContact({ accountId: '123', adminId, contact: contact1 });
      expect(status.ok).toBeFalsy();
      // Bad admin Id
      let status = app.createContact({ accountId, adminId: '123', contact: contact1 });
      expect(status.ok).toBeFalsy();
      // bad email
      const badEmail = {
        name: 'George',
        email: 'gorge@gmail.'
      };
      let status = app.createContact({ accountId, adminId: '123', contact: badEmail });
      expect(status.ok).toBeFalsy();
      // no contact details
      const badEmail = {
        name: 'George',
      };
      let status = app.createContact({ accountId, adminId, contact: badEmail });
      expect(status.ok).toBeFalsy();
    });

    it("should not create contact if it is in blacklist", () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const email = 'gorge@gmail.com';
      const phoneNumber = '+71234562'

      app.blacklist.push({ email });

      let contact1 = { email };
      //email in black
      let status = app.createContact({ accountId, adminId, contact: contact1 });
      // console.log('status: ', status);
      expect(status.ok).toBeFalsy();
      // phone in black
      app.blacklist = [];
      app.blacklist.push({ phoneNumber });
      let contact1 = { phoneNumber };

      let status = app.createContact({ accountId, adminId, contact: contact1 });
      expect(status.ok).toBeFalsy();

    });

    it("should update contact if it is already in contacts", (done) => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;

      const contact1 = {
        name: 'George',
        phoneNumber: '+123456789',
        email: 'order@gmail.com'
      };
      const temp = app.createContact({ accountId, adminId, contact: contact1 });
      const previousContact = cloneDeep(temp);
      expect(app.getAccount(accountId).contacts[0].email === contact1.email).toBeTruthy();

      const contact1_1 = {
        name: 'George',
        phoneNumber: '+123456789',
        email: 'george@gmail.com'
      };
      // js to fast. we need to wait some time in order to check if update time has been changed
      setTimeout(() => {
        const newContact = app.createContact({ accountId, adminId, contact: contact1_1 }).info;
        const ac = app.getAccount(accountId);
        expect(ac.contacts.length === 1).toBeTruthy();
        expect(ac.contacts[0].email === contact1_1.email).toBeTruthy();
        expect(newContact.email !== previousContact.email).toBeTruthy();
        expect(newContact.updateTime !== previousContact.updateTime);
        done();
      }, 1000);
    });
  });

  describe('Sender tests. Create and Send sms/letters', () => {
    it('should send sms/letter', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contentSms = 'I will not spam you sms';
      const contentLetter = 'I will not spam you email';
      const contact1 = {
        name: 'George',
        phoneNumber: '+123456789',
        email: 'order@gmail.com'
      };

      app.createContact({ accountId, adminId, contact: contact1 });

      const resSms = app.send('sms', { adminId, accountId, content: contentSms });
      expect(resSms.ok).toBeTruthy();
      expect(app.sms[0].status === 'DELIVERED').toBeTruthy();

      const resLetter = app.send('letter', { adminId, accountId, content: contentLetter });
      expect(resLetter.ok).toBeTruthy();
      expect(app.letters[0].status === 'DELIVERED').toBeTruthy();
    });

    it('should not send sms/letter if bad admin or account id', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contentSms = 'I will not spam you sms';
      const contact1 = {
        name: 'George',
        phoneNumber: '+123456789',
        email: 'order@gmail.com'
      };

      app.createContact({ accountId, adminId, contact: contact1 });

      const resSms = app.send('sms', { adminId: '123', accountId, content: contentSms });
      expect(resSms.ok).toBeFalsy();

    });

    // todo: test more cases, more data.
    // create dynamic data generation function
    it('should not send sms/letter to contacts in black list', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contentSms = 'I will not spam you sms';
      const contentLetter = 'I will not spam you email';

      app.createContact({ accountId, adminId, contact: contact1 });
      app.createContact({ accountId, adminId, contact: contact2 });
      app.createContact({ accountId, adminId, contact: contact3 });
      app.createContact({ accountId, adminId, contact: contact4 });

      app.blacklist = [{
        email: 'order@gmail.com'
      },
      {
        phoneNumber: '+123456789'
      },
      {
        phoneNumber: '+2123456789'
      }];
      console.log(app.accounts[0].contacts);
      const resSms = app.send('sms', { adminId, accountId, content: contentSms });
      console.log('resSms: ', resSms);

      expect(resSms.info.sent.length == 2).toBeTruthy();
      expect(resSms.ok).toBeTruthy();

      const resLetter = app.send('letter', { adminId, accountId, content: contentLetter });
      expect(resLetter.info.sent.length == 3).toBeTruthy();
      expect(resLetter.ok).toBeTruthy();
    });

    it('should generate encrypted messages and properly decrypt with right data', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contentSms = 'I will not spam you sms';

      const contact1Token = app.createContact({ accountId, adminId, contact: contact1 });
      const contact2Token = app.createContact({ accountId, adminId, contact: contact3 });

      const resSms = app.send('sms', { adminId, accountId, content: contentSms });
      const resLet = app.send('letter', { adminId, accountId, content: contentSms });

      expect(resSms.info.sent.length === 2).toBeTruthy();
      expect(resLet.info.sent.length === 1).toBeTruthy();

      const message1 = resSms.info.sent[0];

      const token1 = message1.message.replace(/.*token=/, '');
      const decrypt1 = decrypt(token1);
      expect(typeof decrypt1 === 'string').toBeTruthy();
      const jsonObj1 = JSON.parse(decrypt1);

      expect(typeof jsonObj1 === 'object').toBeTruthy();
      expect(jsonObj1.accountId === accountId).toBeTruthy();
      expect(jsonObj1.contactId === contact1Token.info.id).toBeTruthy();
      expect(jsonObj1.unsubscribeSource === 'SMS_LINK').toBeTruthy();
      expect(jsonObj1.phoneNumber === contact1.phoneNumber).toBeTruthy();
      expect(jsonObj1.token === contact1Token.info.token).toBeTruthy();

      const message2 = resLet.info.sent[0];
      const token2 = message2.message.replace(/.*token=/, '');
      const decrypt2 = decrypt(token2);
      expect(typeof decrypt2 === 'string').toBeTruthy();
      const jsonObj2 = JSON.parse(decrypt2);

      expect(typeof jsonObj2 === 'object').toBeTruthy();
      expect(jsonObj2.accountId === accountId).toBeTruthy();
      expect(jsonObj2.contactId === contact2Token.info.id).toBeTruthy();
      expect(jsonObj2.unsubscribeSource === 'EMAIL_LINK').toBeTruthy();
      expect(jsonObj2.email === contact3.email).toBeTruthy();
      expect(jsonObj2.token === contact2Token.info.token).toBeTruthy();
    });

    it('should not unsubscribe if not encrypted link provided', () => {
      const app = new Application();
      const badUnsubscription = app.unsubsribeLink('');
      expect(badUnsubscription.ok).toBeFalsy();
    });

    it('should not unsubscribe if encrypted string not json', () => {
      const app = new Application();
      const string = 'Dummy string';
      const encryptedString = encrypt(string);
      const badUnsubscription = app.unsubsribeLink(encryptedString);
      expect(badUnsubscription.ok).toBeFalsy();
    });

    // todo check account and contact id
    it('should not unsubscribe if encrypted json don\'t have required fields', () => {
      const app = new Application();

      // Missing phone and email
      let notAllRequiredFileds: string = `{
        "unsubscribeSource": "EMAIL_LINK",
        "token":"1234567880"
      }`;

      const encryptedString = encrypt(notAllRequiredFileds);
      let unsubscription = app.unsubsribeLink(encryptedString);
      expect(unsubscription.ok).toBeFalsy();

      // Missing token
      let notAllRequiredFileds: string = `{
        "unsubscribeSource": "EMAIL_LINK",
        "email":"ololo@gmail.com"
      }`;

      const encryptedString = encrypt(notAllRequiredFileds);
      let unsubscription = app.unsubsribeLink(encryptedString);
      expect(unsubscription.ok).toBeFalsy();

      // Missing unsubscribeSource
      let notAllRequiredFileds: string = `{
        "token":"1234567880",
        "phoneNumber": "123123123"
      }`;

      const encryptedString = encrypt(notAllRequiredFileds);
      let unsubscription = app.unsubsribeLink(encryptedString);

      expect(unsubscription.ok).toBeFalsy();

      // UnsubscribeSource wrong value
      const encryptedString = encrypt(notAllRequiredFileds);
      let unsubscription = app.unsubsribeLink(encryptedString);
      expect(unsubscription.ok).toBeFalsy();

      let notAllRequiredFileds: string = `{
        "token":"1234567880",
        "unsubscribeSource": "dummy_Source",
        "phoneNumber": "123123123"
      }`;

      const encryptedString = encrypt(notAllRequiredFileds);
      let unsubscription = app.unsubsribeLink(encryptedString);

      expect(unsubscription.ok).toBeFalsy();
    });

    it('should not pass unsubscribe validation if bad accountId, contactId and token provided', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };

      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;

      const contactData = app.createContact({ accountId, adminId, contact: contact1 }).info;
      // bad account id
      let datatoEncrypt: string = `{
        "token":"${contactData.token}",
        "accountId": "12",
        "contactId": "${contactData.id}",
        "unsubscribeSource": "SMS_LINK",
        "phoneNumber": "${contactData.phoneNumber}"
      }`;

      let link = encrypt(datatoEncrypt);
      const unsubcription = app.unsubsribeLink(link);
      expect(unsubcription.ok).toBeFalsy();
      expect(app.blacklist.length === 0).toBeTruthy();

      //bad Token
      let datatoEncrypt: string = `{
        "token":"123",
        "accountId": "${accountId}",
        "contactId": "${contactData.id}",
        "unsubscribeSource": "SMS_LINK",
        "phoneNumber": "${contactData.phoneNumber}"
      }`;

      let link = encrypt(datatoEncrypt);
      const unsubcription = app.unsubsribeLink(link);
      expect(unsubcription.ok).toBeFalsy();
      expect(app.blacklist.length === 0).toBeTruthy();

      //bad contactid
      let datatoEncrypt: string = `{
        "token":"${contactData.token}",
        "accountId": "${accountId}",
        "contactId": "123",
        "unsubscribeSource": "SMS_LINK",
        "phoneNumber": "${contactData.phoneNumber}"
      }`;

      let link = encrypt(datatoEncrypt);
      const unsubcription = app.unsubsribeLink(link);
      expect(unsubcription.ok).toBeFalsy();
      expect(app.blacklist.length === 0).toBeTruthy();
    });

    it('should pass unsubscribe validation and contact should appear in black list', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };

      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;

      const contactData = app.createContact({ accountId, adminId, contact: contact1 }).info;
      app.send('sms', { adminId, accountId, content: 'Dummy text' })

      let datatoEncrypt: string = `{
        "token":"${contactData.token}",
        "accountId": "${accountId}",
        "contactId": "${contactData.id}",
        "unsubscribeSource": "SMS_LINK",
        "phoneNumber": "${contactData.phoneNumber}"
      }`;

      let link = encrypt(datatoEncrypt);
      const unsubcription = app.unsubsribeLink(link);
      expect(unsubcription.ok).toBeTruthy();
      expect(app.blacklist[0].phoneNumber === contact1.phoneNumber).toBeTruthy();
    });

    it('should succesfully send sms, unsubcribe by provided link, and not send again', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };

      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      // create contact and send sms
      app.createContact({ accountId, adminId, contact: contact1 }).info;
      app.createContact({ accountId, adminId, contact: contact2 }).info;
      const messageInfo = app.send('sms', { adminId, accountId, content: 'Dummy text' });
      // should be sent successfully
      expect(messageInfo.ok).toBeTruthy();
      // should send 2 messages
      expect(messageInfo.info.sent.length === 2).toBeTruthy();

      const link = messageInfo.info.sent[0].message.replace(/.*token=/, '');
      // unsubcribe
      const unsubcription = app.unsubsribeLink(link);
      expect(unsubcription.ok).toBeTruthy();
      // Add new contact in order to send sms again
      app.createContact({ accountId, adminId, contact: contact4 }).info;
      // send again
      const newMessageInfo = app.send('sms', { adminId, accountId, content: 'Dummy text' });
      expect(newMessageInfo.info.sent.length === 1).toBeTruthy();
      expect(app.blacklist.length === 1).toBeTruthy();
    });

    it('should succesfully send Letter, unsubcribe by provided link, and not send again', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };

      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      // create contact and send sms
      app.createContact({ accountId, adminId, contact: contact3 }).info;
      app.createContact({ accountId, adminId, contact: contact4 }).info;
      const messageInfo = app.send('letter', { adminId, accountId, content: 'Dummy text' });
      // should be sent successfully
      expect(messageInfo.ok).toBeTruthy();
      // should send 2 messages
      expect(messageInfo.info.sent.length === 2).toBeTruthy();

      const link = messageInfo.info.sent[0].message.replace(/.*token=/, '');
      // unsubcribe
      const unsubcription = app.unsubsribeLink(link);
      expect(unsubcription.ok).toBeTruthy();
      // Add new contact in order to send sms again
      app.createContact({ accountId, adminId, contact: contact4 }).info;
      // send again
      const newMessageInfo = app.send('letter', { adminId, accountId, content: 'Dummy text' });
      expect(newMessageInfo.info.sent.length === 1).toBeTruthy();
      expect(app.blacklist.length === 1).toBeTruthy();
    });

  });

  describe('Unsubscribe CRM', () => {
    it('should send sms/letter than unsubcribe this user from crm and not allow send him again', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };

      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;

      const data = {
        email: contact3.email,
        accountId,
        type: 'letter',
        unsubscribeSource: 'CRM'
      };

      app.createContact({ accountId, adminId, contact: contact3 }).info;

      let statusL = app.send('letter', { adminId, accountId, content: 'Test' });

      expect(statusL.ok).toBeTruthy();

      app.unsubscribeCRM('letter', { adminId, data });

      let statusL = app.send('letter', { adminId, accountId, content: 'Test' });

      expect(statusL.ok).toBeFalsy();

    });

    it('should send letter than unsubcribe this user from crm and not allow send him again', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };

      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;

      const data = {
        phoneNumber: contact3.phoneNumber,
        accountId,
        type: 'sms',
        unsubscribeSource: 'CRM'
      };

      app.createContact({ accountId, adminId, contact: contact3 }).info;

      let statusL = app.send('sms', { adminId, accountId, content: 'Test' });

      expect(statusL.ok).toBeTruthy();

      app.unsubscribeCRM('sms', { adminId, data });

      let statusL = app.send('sms', { adminId, accountId, content: 'Test' });

      expect(statusL.ok).toBeFalsy();
    })
  });
  describe('Resubscribe', () => {
    it('should resubscribe user', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };

      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;

      const data = {
        phoneNumber: contact3.phoneNumber,
        accountId,
        type: 'sms',
        unsubscribeSource: 'CRM'
      };

      app.createContact({ accountId, adminId, contact: contact3 }).info;

      let statusL = app.send('sms', { adminId, accountId, content: 'Test' });

      expect(statusL.ok).toBeTruthy();

      app.unsubscribeCRM('sms', { adminId, data });

      let statusL = app.send('sms', { adminId, accountId, content: 'Test' });

      expect(statusL.ok).toBeFalsy();

      app.resubscribe('sms', { accountId, adminId, phoneNumber: contact3.phoneNumber });

      let statusL = app.send('sms', { adminId, accountId, content: 'Test' });
      console.log('statusL: ', statusL);

      expect(statusL.ok).toBeTruthy();
      

    });
  })
});