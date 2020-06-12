import tools from './helpers/tools';
import messages from './helpers/messages';
import { Admin, userInfo } from './Admin';
import { Account, AccountInfo } from './Account';
import { Sms } from './Sender/Sms';
import { Letter } from './Sender/Letter';
import { CreateContactInterface, ContactInterface } from './interfaces/Contact.interface';
import { MessageInterface } from './interfaces/Messages.iterface';
import { every, isEmpty, remove, clone } from 'lodash';
import contact from './data/contacts';

type AccessArguments = {
  adminId: string;
  accountId: string;
}

interface CreateSenderObjectInterface extends AccessArguments {
  content: string;
}

export class Application {
  private admins: Admin[] = [];
  private accounts: Account[] = [];
  private sms: Sms[] = [];
  private letters: Letter[] = [];
  constructor() {

  }
  // Return message that admin created
  createAdmin({ name, email }: userInfo): MessageInterface {
    // todo:
    // - check if parameters valid
    // - check if email is uniq amount another admin
    const admin = new Admin({ name, email });
    this.admins.push(admin);
    return tools.statusMessage(true, messages.admin.created);
  }

  getAdminByEmail(email: string): Admin | null {
    // todo:
    // - check if email is valid
    // - if admin not found return null
    return tools.findByEmail(this.admins, email);
  }
  // todo: add Admin | null
  getAdminById(id: string): Admin {
    // todo:
    // - check if id is valid
    // - if admin not found return null
    return tools.findById(this.admins, id);
  }

  // Create account and ref it to admin
  createAccount({ adminId, name }: AccountInfo): MessageInterface | null {
    // todo:
    // - check if parameters valid
    // - check if admin id exist amoung other admins id
    // - check this account will linked to only one admin
    // - return null if bad validation
    const account = new Account({ adminId, name });
    const admin = this.getAdminById(adminId);
    // We can push it to admin but inside that method we shoudl check if account exists and etc...
    // if we succesfull linked account than we should push it to the app
    admin.linkAccount(account);
    this.accounts.push(account);
    return tools.statusMessage(true, messages.account.created, { id: account.id });
  }

  // adminId is like active user
  createContact({ accountId, adminId, contact }: CreateContactInterface) {
    //todo:
    // - check account id amoung all bound accounts if account exists
    // check if contacts are empty
    // - before contact will be created check if we have such contact and he can accept messages
    // phoneNumberEnabled === true || emailEnabled === true, both must be true else we don't allow to add such contact
    const contacts = this.accounts.map(account => account.contacts);

    if (!every(contacts, isEmpty)) {
      // check contacts if they available to receive messages
    }
    const admin = this.getAdminById(adminId);
    // if admin is owner of such account
    const account = admin.getAccount(accountId);
    if (account) {
      return account.createContact(contact);
    }

  }

  createSms({ adminId, accountId, content }: CreateSenderObjectInterface): MessageInterface {
    // todo:
    // - do all validations relative parameters
    const contacts = this.getContacts({ adminId, accountId });
    const sms = new Sms({ type: 'sms', contacts, content });
    this.sms.push(sms);
    return tools.statusMessage(true, messages.sender.created('Sms'), { id: sms.id });
  }

  sendSms(smsId: string) {
    const sms = this.sms.find(elem => elem.id == smsId);
    if (sms) {
      return sms.send();
    }
  }
  createLetter({ adminId, accountId, content }: CreateSenderObjectInterface): MessageInterface {
    // todo:
    // - do all validations relative parameters
    const contacts = this.getContacts({ adminId, accountId });
    const letter = new Letter({ type: 'letter', contacts, content });
    this.letters.push(letter);
    return tools.statusMessage(true, messages.sender.created('Letter'), { id: letter.id });
  }
  sendLetter(letterId: string) {
    const letter = this.letters.find(elem => elem.id == letterId);
    if (letter) {
      return letter.send();
    }
  }
  private getContacts({ adminId, accountId }: AccessArguments) {
    // todo
    // parametr validation
    const admin = this.getAdminById(adminId);
    const account = admin.getAccount(accountId);
    const contacts = account?.getContacts() || [];
    const cleanContacts = contacts.map(this.removeUnsubscribed);

    return cleanContacts;
  }
  private removeUnsubscribed(elem: ContactInterface): ContactInterface | undefined {
    if (elem.emailEnabled && elem.phoneNumberEnabled) {
      return elem;
    }
  }
}