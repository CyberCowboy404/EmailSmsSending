import { LetterInterface } from '../interfaces/Letter.interface';
import { SmsInterface } from '../interfaces/Sms.interface';
import { ContactInterface } from '../interfaces/Contact.interface';
import { MessageInterface } from '../interfaces/Messages.iterface';
import tools from '../helpers/tools';
import messages from '../helpers/messages';
import * as _ from 'lodash';

export type type = 'sms' | 'letter';
export class Sender {
  public type: string;
  public data: SmsInterface[] | LetterInterface[] = [];
  contacts: ContactInterface[];
  constructor(type: type, contacts: ContactInterface[]) {
    this.type = type;
    this.contacts = contacts;
  }
  create(content: string): MessageInterface {
    // todo:
    // - add validations
    // - return message that data is created or no
    // - show error if contacts not exists
    const id = tools.generateUniqId();
    const ts = tools.generateUnixTimeStamp();
    const cleanContacts = _.remove(this.contacts, this.removeUnsubscribed);
    const data = {
      id,
      content,
      contacts: cleanContacts,
      updateTime: ts,
      createTime: ts,
      sentTime: 0
    };

    this.data.push(data);

    return tools.statusMessage(true, messages.sender.created(this.type), data);
  }

  send(id: string): MessageInterface {
    // todo:
    // check if we get everything right
    const sender: SmsInterface | LetterInterface = tools.findById(this.data, id);

    if (sender) {
      const ts = tools.generateUnixTimeStamp();
      sender.sentTime = ts;
      sender.updateTime = ts;
      sender.status = 'DELIVERED';
      return tools.statusMessage(true, messages.sender.sent);
    }

    return tools.statusMessage(false, messages.sender.notSent);
  }

  private removeUnsubscribed(elem: ContactInterface): boolean {
    return !elem.emailEnabled || !elem.phoneNumberEnabled;
  }
}