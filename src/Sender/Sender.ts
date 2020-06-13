import { ContactInterface, UnsubscribeSource } from '../interfaces/Contact.interface';
import { MessageInterface } from '../interfaces/Messages.iterface';
import tools from '../helpers/tools';
import messages from '../helpers/messages';
import { isEmpty } from 'lodash';
import { config } from '../config/config';
import { encrypt } from '../helpers/encryption';
import { type } from 'os';

//todo move all types to separated file
export type SenderParams = {
  smsId: string;
  accountId: string;
};

export type EncryptedDataStructure = {
  accountId: string;
  contactId: string;
  unsubscribeSource: UnsubscribeSource;
  token: string;
  phoneNumber?: string;
  email?: string;
};

export type SenderConstructor = {
  type: type;
  contacts: ContactInterface[];
  content: string;
}
export type type = 'sms' | 'letter';
export class Sender {
  public type: string;
  private contacts: ContactInterface[];
  id: string;
  content: string;
  updateTime: number;
  createTime: number;
  sentTime: any;
  status?: string;
  constructor({ type, contacts, content }: SenderConstructor) {
    this.type = type;
    this.contacts = contacts;
    const id = tools.generateUniqId();
    const ts = tools.generateUnixTimeStamp();
    this.id = id;
    this.content = content;
    this.updateTime = ts;
    this.createTime = ts;
    this.sentTime = 0;
  }
  
  send(): MessageInterface {
    if (isEmpty(this.contacts)) {
      this.status = 'FAILED';
      return tools.statusMessage(false, messages.sender.contactsNotExists);
    }
    const notSent: ContactInterface[] = []
    
    const sent = this.contacts.map(contact => {
      if (!contact.phoneNumberEnabled || !contact.emailEnabled) {
        notSent.push(contact);
        return;
      }
      //make string like key:value:key:value in order to easely convert it to object
      let unsubscribeSource = this.type === 'sms' ? 'SMS_LINK' : 'EMAIL_LINK';
      const stringToEncrypt: string = `{
        "accountId":"${contact.accountId}",
        "contactId":"${contact.id}",
        "phoneNumber": "${contact.phoneNumber || false}",
        "email": "${contact.email || false}",
        "unsubscribeSource": "${unsubscribeSource}",
        "token":"${contact.token}"
      }`;
      const token = encrypt(stringToEncrypt);
      return {
        message: `${this.content} in order to unsubscribe follow this link ${config.website}/?token=${token}`
      };
    });

    // todo:
    // check if we get everything right
    const ts = tools.generateUnixTimeStamp();
    this.sentTime = ts;
    this.updateTime = ts;
    this.status = 'DELIVERED';

    return tools.statusMessage(true, messages.sender.sent, { sent, notSent });
  }
}