//@ts-nocheck

import { Application } from '../Application';
import { Admin } from '../Admin';
import { Account } from '../Account'
import messages from '../helpers/messages'
import { cloneDeep } from 'lodash'
import { Sms } from '../Sender/Sms';
import { Letter } from '../Sender/Letter';

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

  describe('Sender tests. Creation of sms and letters', () => {
    it('should create sms and letter ', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contentSms = 'I will not spam you email';
      const contentLetter = 'I will not spam you email';
      const contact1 = {
        name: 'George',
        phoneNumber: '+123456789',
        email: 'order@gmail.com'
      };

      app.createContact({ accountId, adminId, contact: contact1 });

      const sms = app.createSms({ adminId, accountId, content: contentSms }).info;
      const letter = app.createLetter({ adminId, accountId, content: contentLetter }).info;

      expect(sms instanceof Sms).toBeTruthy();
      expect(sms.contacts).toBeDefined();
      expect(sms.content === contentSms).toBeTruthy();
      expect(app.sms.length > 0).toBeTruthy();

      expect(letter instanceof Letter).toBeTruthy();
      expect(letter.contacts).toBeDefined();
      expect(letter.content === contentLetter).toBeTruthy();
      expect(app.letters.length > 0).toBeTruthy();
    });

    it('should not create sms and letter if no contacts', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contentSms = 'I will not spam you email';
      const contentLetter = 'I will not spam you email';

      const sms = app.createSms({ adminId, accountId, content: contentSms }).info;
      const letter = app.createLetter({ adminId, accountId, content: contentLetter }).info;

      expect(sms instanceof Sms).toBeFalsy();
      expect(sms.contacts).toBeUndefined();
      expect(sms.content === contentSms).toBeFalsy();
      expect(app.sms.length > 0).toBeFalsy();

      expect(letter instanceof Letter).toBeFalsy();
      expect(letter.contacts).toBeUndefined();
      expect(letter.content === contentLetter).toBeFalsy();
      expect(app.letters.length > 0).toBeFalsy();
    });

    it('should not create letter and sms', () => {
      const app = new Application();
      const adminInfo = { email: 'den@gmail.com', name: 'Alex' };
      const adminId = app.createAdmin(adminInfo).info.id;
      const accountId = app.createAccount({ adminId, name: 'My account 1' }).info.id;
      const contentSms = 'I will not spam you email';
      const contentLetter = 'I will not spam you email';
      const contact1 = {
        name: 'George',
        phoneNumber: '+123456789',
        email: 'order@gmail.com'
      };

      app.createContact({ accountId, adminId, contact: contact1 });

      let sms = app.createSms({ adminId, accountId, content: '' }).info;
      let letter = app.createLetter({ adminId, accountId, content: '' }).info;

      expect(sms instanceof Sms).toBeFalsy();
      expect(sms.contacts).not.toBeDefined();
      expect(sms.content === contentLetter).toBeFalsy();
      expect(app.sms.length > 0).toBeFalsy();

      expect(letter instanceof Letter).toBeFalsy();
      expect(letter.contacts).not.toBeDefined();
      expect(letter.content === contentSms).toBeFalsy();
      expect(app.letters.length > 0).toBeFalsy();

      let sms = app.createSms({ adminId, accountId: '123', content: contentSms }).info;
      let letter = app.createLetter({ adminId, accountId: '281', content: contentLetter }).info;

      expect(sms instanceof Sms).toBeFalsy();
      expect(sms.contacts).not.toBeDefined();
      expect(sms.content === contentLetter).toBeFalsy();
      expect(app.sms.length > 0).toBeFalsy();

      expect(letter instanceof Letter).toBeFalsy();
      expect(letter.contacts).not.toBeDefined();
      expect(letter.content === contentSms).toBeFalsy();
      expect(app.letters.length > 0).toBeFalsy();
    });

  });

});