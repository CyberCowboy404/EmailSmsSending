import { AccountInterface } from './interfaces/Account.interface';
import { ContactInterface, UnsubscribeSource, ContactData } from './interfaces/Contact.interface';
import { MessageInterface } from './interfaces/Messages.iterface';
import tools from './helpers/tools';
import messages from './helpers/messages';
import { isEmpty, clone } from 'lodash';
import { generateToken } from './helpers/encryption';
import { UserInformation } from './interfaces/Application.interface';

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
  createContact(contactInfo: ContactData): MessageInterface {
    // todo
    // provide validation
    let isContactExists;

    if (contactInfo.phoneNumber) {
      isContactExists = tools.findByPhone(this.contacts, contactInfo.phoneNumber)
    } else if (contactInfo.email) {
      isContactExists = tools.findByEmail(this.contacts, contactInfo.email)
    }

    //update
    if (isContactExists) {
      const { id, email, phoneNumber } = isContactExists;
      Object.assign(isContactExists, contactInfo, { updateTime: tools.generateUnixTimeStamp() });
      return tools.statusMessage(true, messages.contact.updated({ id, email, phoneNumber }), isContactExists);
    } else {
      //create
      const contact: ContactInterface = {
        id: tools.generateUniqId(),
        accountId: contactInfo.accountId,
        name: contactInfo.name,
        createTime: tools.generateUnixTimeStamp(),
        updateTime: tools.generateUnixTimeStamp(),
        token: generateToken(),
        emailEnabled: true,
        phoneNumberEnabled: true,
        email: contactInfo.email,
        phoneNumber: contactInfo.phoneNumber
      }
      this.contacts.push(contact);
      return tools.statusMessage(true, messages.contact.created, contact);
    }
  }

  get getContacts() {
    return this.contacts;
  }

  unsubscribeEmailLink(email: string, previousToken: string) {
    // If I want find in all collections probably I should do it from application
    const contact: ContactInterface = tools.findByEmail(this.contacts, email);
    return this.unsubscribeLink({
      contact,
      previousToken,
      unsubscribeSource: 'EMAIL_LINK',
      message: messages.unsubscribe.emailUser
    });
  }

  unsubscribeEmailCrm(email: string): MessageInterface {
    const contact: ContactInterface = tools.findByEmail(this.contacts, email);
    return this.unsubscribeCRM(contact, messages.unsubscribe.emailCRM);
  }

  unsubscribePhoneLink(phoneNumber: string, previousToken: string): MessageInterface {
    // should I do this logic here?
    const contact: ContactInterface = tools.findByPhone(this.contacts, phoneNumber);
    return this.unsubscribeLink({
      contact,
      previousToken,
      unsubscribeSource: 'SMS_LINK',
      message: messages.unsubscribe.phoneUser
    });
  }

  unsubscribePhoneCrm(phoneNumber: string): MessageInterface {
    const contact: ContactInterface = tools.findByPhone(this.contacts, phoneNumber);
    return this.unsubscribeCRM(contact, messages.unsubscribe.phoneCRM);
  }

  resubscribeContact({ email = '', phoneNumber = '' }: UserInformation): MessageInterface {
    const contact = tools.findByEmail(this.contacts, email) || tools.findByPhone(this.contacts, phoneNumber);
    if (contact && contact.unsubscribeSource === 'CRM') {
      contact.phoneNumberEnabled = !!phoneNumber;
      contact.emailEnabled = !!email;
      return tools.statusMessage(true, messages.resubscribe);
    } else {
      return tools.statusMessage(false, messages.error.cantResubscribe);
    }
  }

  private unsubscribeCRM(contact: ContactInterface, message: string) {
    if (contact) {
      contact.phoneNumberEnabled = false;
      contact.emailEnabled = false;
      contact.unsubscribeSource = 'CRM';
      return tools.statusMessage(true, message);
    } else {
      return tools.statusMessage(true, messages.error.contactNotFound);
    }
  }
  private unsubscribeLink({ contact, message, unsubscribeSource, previousToken }: {
    contact: ContactInterface, message: string, unsubscribeSource: UnsubscribeSource, previousToken: string
  }): MessageInterface {
    if (isEmpty(contact)) {
      return tools.statusMessage(false, messages.error.contactNotFound);
    }
    if (contact.token === previousToken) {
      contact.phoneNumberEnabled = false;
      contact.emailEnabled = false;
      contact.unsubscribeSource = unsubscribeSource;
      contact.token = generateToken();
      return tools.statusMessage(true, message);
    } else {
      return tools.statusMessage(false, messages.unsubscribe.token);
    }
  }

}
