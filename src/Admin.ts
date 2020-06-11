import { AdminInterface } from './interfaces/Admin.interface';
import { AccountInterface } from './interfaces/Account.interface';
import { ErrorMessageInterface } from './interfaces/Error.iterface';
import tools from './tools';
import messages from './messages';
import * as _ from 'lodash';
import Account from './Account';

type userInfo = {
  name: string;
  email: string;
}
export default class Admin implements AdminInterface {
  id: string;
  name: string;
  email: string;
  createTime: number;
  updateTime: number;
  account?: AccountInterface;
  constructor({ name, email }: userInfo) {
    const ts = tools.generateUnixTimeStamp();
    this.id = tools.generateUniqId();
    this.name = name;
    this.email = email;
    this.createTime = ts;
    this.updateTime = ts;
  }

  createAccount(name: string): Account | ErrorMessageInterface {
    if (_.isNil(name)) return messages.error.name;
    return this.account = this.account instanceof Account ? this.account : new Account({ name, adminId: this.id })
  }
}
