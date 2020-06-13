import { AdminInterface, AdminConstructor } from './interfaces/Admin.interface';
import tools from './helpers/tools';
import messages from './helpers/messages';
import { Account } from './Account';

export class Admin implements AdminInterface {
  id: string;
  name: string;
  email: string;
  createTime: number;
  updateTime: number;
  accounts: Account[] = [];
  constructor({ name, email }: AdminConstructor) {
    const ts = tools.generateUnixTimeStamp();
    this.id = tools.generateUniqId();
    this.name = name;
    this.email = email;
    this.createTime = ts;
    this.updateTime = ts;
  }

  getAccount(accountId: string): Account | undefined {
    // todo:
    // - check if account id exists amount linked accounts
    // - if account didn't find return message with bad status
    return this.accounts.find(account => account.id == accountId);
  }

  linkAccount(account: Account) {
    // todo:
    // check if account already exists
    // if account exists ignore and return null with messages that account exists
    this.accounts.push(account);
    return tools.statusMessage(true, messages.admin.accountLinked)
  }

}
