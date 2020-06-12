import { Account } from '../Account'

describe("Test Account Class", () => {
  it("should init default properties", () => {
    const data = { adminId: '123456789', name: 'Account' };
    const account = new Account(data);
    expect(account.id.length == 9).toBeTruthy();
    expect(account.createTime > 1).toBeTruthy();
    expect(account.name).toBeTruthy();
  });
});