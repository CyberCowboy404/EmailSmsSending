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

  get getContacts() {
    return this.contacts;
  }

  // todo:
  // I'm looking object by email, but I should disable it not only in one
  // but in all objects
  unsubscribeEmailLink(email: string, previousToken: string) {
    // If I want find in all collections probably I should do it from application
    const contact: ContactInterface = tools.findByEmail(this.contacts, email);

    if (contact.token === previousToken) {
      contact.emailEnabled = false;
      contact.token = generateToken();
      contact.unsubscribeSource = 'EMAIL_LINK';
      return tools.statusMessage(true, messages.unsubscribe.emailUser);
    } else {
      return tools.statusMessage(false, messages.unsubscribe.token);
    }
  }

  unsubscribeEmailCrm(email: string) {
    const contact: ContactInterface = tools.findByEmail(this.contacts, email);
    if (contact) {
      contact.emailEnabled = false;
      contact.unsubscribeSource = 'CRM';
      return tools.statusMessage(true, messages.unsubscribe.emailCRM);
    } else {
      return tools.statusMessage(true, messages.unsubscribe.contactNotFound);
    }
  }

  // todo:
  // Unsubscribe by email not only from one object but in all collections
  unsubscribePhoneLink(phoneNumber: string, previousToken: string): MessageInterface {
    // should I do this logic here?
    const contact: ContactInterface = tools.findByPhone(this.contacts, phoneNumber);
    if (contact.token === previousToken) {
      contact.phoneNumberEnabled = false;
      contact.unsubscribeSource = 'SMS_LINK';
      contact.token = generateToken();
      return tools.statusMessage(true, messages.unsubscribe.phoneUser);
    } else {
      return tools.statusMessage(false, messages.unsubscribe.token);
    }
  }

  unsubscribePhoneCrm(phoneNumber: string) {
    const contact: ContactInterface = tools.findByPhone(this.contacts, phoneNumber);
    if (contact) {
      contact.phoneNumberEnabled = false;
      contact.unsubscribeSource = 'CRM';
      return tools.statusMessage(true, messages.unsubscribe.phoneCRM);
    } else {
      return tools.statusMessage(true, messages.unsubscribe.contactNotFound);
    }
  }

  resubscribeContact(email: string, phoneNumber: string) {

  }

}
