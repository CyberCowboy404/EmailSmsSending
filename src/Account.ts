import { AccountInterface } from './interfaces/Account.interface';
import tools from './tools';

type AccountInfo = {
  adminId: string;
  name: string;
}
export default class Account implements AccountInterface {
  id: string;
  name: string;
  adminId: string;
  createTime: number;
  updateTime: number;
  constructor({ adminId, name }: AccountInfo) {
    const ts = tools.generateUnixTimeStamp();
    this.id = tools.generateUniqId();
    this.adminId = adminId;
    this.name = name;
    this.createTime = ts;
    this.updateTime = ts;
  }
}
