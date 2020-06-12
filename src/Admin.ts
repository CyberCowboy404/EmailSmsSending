import { AdminInterface } from './interfaces/Admin.interface';
import { AccountInterface } from './interfaces/Account.interface';
import tools from './helpers/tools';
import messages from './helpers/messages';
import * as _ from 'lodash';
import { Account } from './Account';
import { ContactInterface } from './interfaces/Contact.interface';

export type userInfo = {
  name: string;
  email: string;
}
export class Admin implements AdminInterface {
  id: string;
  name: string;
  email: string;
  createTime: number;
  updateTime: number;
  accounts: Account[] = [];
  constructor({ name, email }: userInfo) {
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
