import tools from './helpers/tools';
import messages from './helpers/messages';
import { Admin } from './Admin';
import { AdminConstructor } from './interfaces/Admin.interface';
import { Account, AccountInfo } from './Account';
import { Sms } from './Sender/Sms';
import { EncryptedDataStructure } from './Sender/Sender';
import { Letter } from './Sender/Letter';
import { CreateContactInterface, ContactInterface } from './interfaces/Contact.interface';
import { MessageInterface } from './interfaces/Messages.iterface';
import { flatten } from 'lodash';
import { pipe } from 'lodash/fp';
import { decrypt } from './helpers/encryption';
import {
  BlackList,
  CreateSenderObjectInterface,
  UnsubscribeCRM,
  ResubscribeData,
  AccessArguments
} from './interfaces/Application.interface'
import {
  isParamsEmpty,
  errorHandler,
  isValidEmail,
  isUniqAdminEmail,
  isAdminExists,
  isContactInBlackList,
  isAccountExists,
  isAdminOwnerOfAccount,
  isContactsProvided,
} from './validation/Rules';


export class Application {
  private admins: Admin[] = [];
  // todo: try to store account using closures to get access only from this class and by admin related account
  private accounts: Account[] = [];
  private sms: Sms[] = [];
  private letters: Letter[] = [];
  private blacklist: BlackList[] = [];
  createAdmin({ name, email }: AdminConstructor): MessageInterface {
    const validation: MessageInterface = pipe(
      isParamsEmpty,
      isValidEmail,
      isUniqAdminEmail.bind(this.admins),
      errorHandler
    )({
      validateData: {
        params: {
          name,
          email
        },
      },
      errorArray: []
    });

    if (!validation.ok) {
      return this.failedValidation(validation.info);
    }

    const admin = new Admin({ name, email });
    this.admins.push(admin);
    const message = messages.admin.created({ name, email });
    // console.log('Admin Created: ', message);
    return tools.statusMessage(true, message, { id: admin.id });
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
  createAccount({ adminId, name }: AccountInfo): MessageInterface {
    const validation: MessageInterface = pipe(
      isParamsEmpty,
      isAdminExists.bind(this.admins),
      errorHandler
    )({
      validateData: {
        params: {
          name,
          adminId
        }
      },
      errorArray: []
    });

    if (!validation.ok) {
      return this.failedValidation(validation.info);
    }
    const account = new Account({ adminId, name });
    const admin = this.getAdminById(adminId);
    admin.linkAccount(account);
    this.accounts.push(account);
    return tools.statusMessage(true, messages.account.created, { id: account.id });
  }

  getAccount(accountId: string): Account {
    // todo
    // validation
    return tools.findById(this.accounts, accountId);
  }

  getAllAccountsContacts(): any {
    // todo validate if found or no
    const contacts = this.accounts.map(account => account.getContacts);
    return flatten(contacts);
  }

  createContact({ accountId, adminId, contact }: CreateContactInterface) {
    const validation: MessageInterface = pipe(
      isParamsEmpty,
      isAdminExists.bind(this.admins),
      isAccountExists.bind(this.accounts),
      isAdminOwnerOfAccount.bind(this.getAdminById(adminId)),
      isContactsProvided.bind(contact),
      isContactInBlackList.bind(this.blacklist),
      errorHandler
    )({
      validateData: {
        params: {
          accountId,
          adminId,
          contact
        }
      },
      errorArray: []
    });

    if (!validation.ok) {
      return this.failedValidation(validation.info);
    }
    
    const account = this.getAccountByAdmin({ adminId, accountId });
    
    if (account) {
      contact.accountId = accountId;
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
  // todo:
  // check if id exist and show message like: you should create before
  createLetter({ adminId, accountId, content }: CreateSenderObjectInterface): MessageInterface {
    // todo:
    // - do all validations relative parameters
    const contacts = this.getContacts({ adminId, accountId });
    const letter = new Letter({ type: 'letter', contacts, content });
    this.letters.push(letter);
    return tools.statusMessage(true, messages.sender.created('Letter'), { id: letter.id });
  }
  // todo:
  // check if id exist and show message like: you should create before
  sendLetter(letterId: string) {
    const letter = this.letters.find(elem => elem.id == letterId);
    if (letter) {
      return letter.send();
    }
  }
  unsubsribeLink(link: string) {
    // todo:
    // check link 
    // check decryption
    // check after parsing
    const decryptedLink = decrypt(link);
    const linkData = decryptedLink.replace(/\s+/g, '');
    const linkObject: EncryptedDataStructure = JSON.parse(linkData);
    let result
    // todo
    // create validation structure for this type
    if (linkObject) {
    }
    // refactor this validation
    if (linkObject.unsubscribeSource == 'SMS_LINK' && linkObject.phoneNumber) {
      this.blacklist.push({
        phoneNumber: linkObject.phoneNumber,
        unsubscribeSource: 'SMS_LINK'
      });
      const account = this.getAccount(linkObject.accountId);
      result = account.unsubscribePhoneLink(linkObject.phoneNumber, linkObject.token);
      // I should pass not one account but all who has same email and phone
    } else if (linkObject.unsubscribeSource == 'EMAIL_LINK' && linkObject.email) {
      this.blacklist.push({
        email: linkObject.email,
        unsubscribeSource: 'EMAIL_LINK'
      });
      const account = this.getAccount(linkObject.accountId);
      result = account.unsubscribeEmailLink(linkObject.email, linkObject.token);
    }
    return result;
  }
  unsubscribeCRM({ adminId, data }: UnsubscribeCRM): MessageInterface | undefined {
    // Validate all inputs
    const account = this.getAccountByAdmin({ adminId, accountId: data.accountId });
    let result;
    if (data.type === 'letter' && data.email) {
      result = account?.unsubscribeEmailCrm(data.email);
    } else if (data.type === 'sms' && data.phoneNumber) {
      result = account?.unsubscribePhoneCrm(data.phoneNumber);
    }
    return result;
  }
  resubscribe({ accountId, adminId, email, phoneNumber }: ResubscribeData) {
    // todo: validate all parameters
    const account = this.getAccountByAdmin({ adminId, accountId });
    return account?.resubscribeContact({ email, phoneNumber });
  }
  // todo:
  // - also check all contacts with same email or phone number and disable they too.
  // - check if it sends if user has disabledphone or disabled email
  private getContacts({ adminId, accountId }: AccessArguments) {
    // todo
    // parametr validation
    const account = this.getAccountByAdmin({ adminId, accountId });
    const contacts = account?.getContacts || [];
    const cleanContacts = contacts.map(this.removeUnsubscribed);

    return cleanContacts;
  }
  private getAccountByAdmin({ adminId, accountId }: AccessArguments): Account | undefined {
    const admin = this.getAdminById(adminId);
    const account = admin.getAccount(accountId);
    return account;
  }
  private removeUnsubscribed(elem: ContactInterface): any {
    if (elem.emailEnabled && elem.phoneNumberEnabled) {
      return elem;
    }
  }
  private failedValidation(info: string[]) {
    return tools.statusMessage(false, messages.validation.failed, info);
  }
}