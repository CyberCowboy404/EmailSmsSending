import { AccountInterface } from './interfaces/Account.interface';
import { ContactInterface } from './interfaces/Contact.interface';
import { MessageInterface } from './interfaces/Messages.iterface';
import tools from './helpers/tools';
import messages from './helpers/messages';
import { cloneDeep } from 'lodash';
import { generateToken } from './helpers/encryption';

export type AccountInfo = {
  adminId: string;
  name: string;
}
export class Account implements AccountInterface {
  id: string;
  name: string;
  adminId: string;
  createTime: number;
  updateTime: number;
  contacts: ContactInterface[] = [];
  constructor({ adminId, name }: AccountInfo) {
    const ts = tools.generateUnixTimeStamp();
    this.id = tools.generateUniqId();
    this.adminId = adminId;
    this.name = name;
    this.createTime = ts;
    this.updateTime = ts;
  }

  // do additional validation before inserting
  // Return message about status of creating
  createContact(contact: ContactInterface): MessageInterface {
    // todo
    const formatContact = cloneDeep(contact);
    formatContact.token = generateToken();
    this.contacts.push(formatContact);
    return tools.statusMessage(true, messages.contact.created, contact);
  }

  getContacts(): ContactInterface[] {
    return this.contacts;
  }

}
