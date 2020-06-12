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

  get getContacts(): ContactInterface[] {
    return this.contacts;
  }

  unsubscribeEmailLink(email: string, previousToken: string) {
    const contact: ContactInterface = tools.findByEmail(this.contacts, email);
    
    if (contact.token === previousToken) {
      contact.emailEnabled = false;
      contact.token = generateToken();
      contact.unsubscribeSource = 'EMAIL_LINK'
      console.log('contact: ', this.contacts);
      return tools.statusMessage(true, messages.unsubscribe.emailUser);
    } else {
      return tools.statusMessage(false, messages.unsubscribe.token);
    }
  }

  unsubscribeEmailCrm(email: string) {

  }

  unsubscribePhoneLink(phoneNumber: string, previousToken: string): MessageInterface {
    const contact: ContactInterface = tools.findByPhone(this.contacts, phoneNumber);
    console.log('contact: ', contact);
    if (contact.token === previousToken) {
      contact.phoneNumberEnabled = false;
      contact.unsubscribeSource = 'SMS_LINK'
      contact.token = generateToken();
      return tools.statusMessage(true, messages.unsubscribe.phoneUser);
    } else {
      return tools.statusMessage(false, messages.unsubscribe.token);
    }
  }

  unsubscribePhoneCrm(phoneNumber: string) {

  }

  resubscribeContact(email: string, phoneNumber: string) {

  }

}
