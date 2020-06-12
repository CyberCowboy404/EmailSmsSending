import { ContactInterface } from '../interfaces/Contact.interface';
import { MessageInterface } from '../interfaces/Messages.iterface';
import tools from '../helpers/tools';
import messages from '../helpers/messages';
import { cloneDeep } from 'lodash';
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
  type: type;
  user: boolean;
  token: string;
  phoneNumber?: string;
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
    // this.contacts
    const contacts = cloneDeep(this.contacts);
    console.log('contacts: ', contacts);
    const sent = contacts.map(contact => {
      //make string like key:value:key:value in order to easely convert it to object
      const stringToEncrypt: string = `{
        "accountId":"${contact.accountId}",
        "contactId":"${contact.id}",
        "type":"${this.type}",
        "phoneNumber": "${contact.phoneNumber || false}",
        "email": "${contact.email || false}",
        "user":"true",
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

    return tools.statusMessage(true, messages.sender.sent, sent);

    // return tools.statusMessage(false, messages.sender.notSent);
  }
}