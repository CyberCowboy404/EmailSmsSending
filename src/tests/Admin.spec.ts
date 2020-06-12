//@ts-nocheck
import { Admin } from '../Admin'
import messages from '../helpers/messages';

describe("Test Admin Class", () => {
  it("should init default properties", () => {
    const userInfo = { name: 'John', email: 'john@email.com' }
    const admin = new Admin(userInfo);
    expect(admin.id.length == 9).toBeTruthy();
    expect(admin.createTime > 1).toBeTruthy();
    expect(admin.name == userInfo.name).toBeTruthy();
    expect(admin.email == userInfo.email).toBeTruthy();
  });
});