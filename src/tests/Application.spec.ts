//@ts-nocheck

import { Application } from '../Application';
import { Admin } from '../Admin';
import { Account } from '../Account'
import messages from '../helpers/messages'

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
      expect(statusMessage).toEqual({ ok: true, message: successMessage, info: {} });
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
      // console.log('app: admin: 3', app);
      expect(admin2Status.ok).toBeFalsy();
    });
  });

  describe('Account creation', () => {
    it("should not create account if creating with not existed Admin", () => {
      const app = new Application();
      // Create admin
      const email = 'test@i.ua';
      const name = 'John';
      const statusMessage = app.createAdmin({ email, name });
      const admin = app.getAdminByEmail(email);

      expect(statusMessage.ok).toBeTruthy();
      expect(admin instanceof Admin).toBeTruthy();

      const accountStatus = app.createAccount({ adminId: '123', name: 'My Account' });
      expect(app.accounts.length === 0).toBeTruthy();
      expect(accountStatus.ok).toBeFalsy();
    });
  });

});