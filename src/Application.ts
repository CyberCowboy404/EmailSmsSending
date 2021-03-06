import tools from './helpers/tools';
import messages from './helpers/messages';
import { Admin } from './Admin';
import { AdminConstructor } from './interfaces/Admin.interface';
import { Account, AccountInfo } from './Account';
import { Sms } from './Sender/Sms';
import { EncryptedDataStructure, type } from './Sender/Sender';
import { Letter } from './Sender/Letter';
import { CreateContactInterface, ContactInterface } from './interfaces/Contact.interface';
import { MessageInterface } from './interfaces/Messages.iterface';
import { isEmpty, flatten } from 'lodash';
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
  isContactsExists,
  isEncryptedString,
  isUnsubscribeLinkStructureValid,
  isAccountContactTokensMatch,
} from './validation/Rules';
import { contactEmail1 } from './data/contacts';
import { AccountInterface } from './interfaces/Account.interface';

export class Application {
  private admins: Admin[] = [];
  // todo: try to store account using closures to get access only from this class and by admin related account
  private accounts: Account[] = [];
  private sms: Sms[] = [];
  private letters: Letter[] = [];
  public blacklist: BlackList[] = [];
  createAdmin({ name, email }: AdminConstructor): MessageInterface {
    const validation: MessageInterface = pipe(
      isParamsEmpty,
      isValidEmail,
      isUniqAdminEmail.bind(this.admins),
      errorHandler
    )({ validateData: { name, email } });

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
    )({ validateData: { name, adminId } });

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

  // todo: phone number and email validation
  createContact({ accountId, adminId, contact }: CreateContactInterface) {
    const validation: MessageInterface = pipe(
      isParamsEmpty,
      isAdminExists.bind(this.admins),
      isAccountExists.bind(this.accounts),
      isAdminOwnerOfAccount.bind(this.getAdminById(adminId)),
      isContactsProvided.bind(contact),
      isContactInBlackList.bind(this.blacklist),
      errorHandler
    )({ validateData: { accountId, adminId, contact } });


    if (!validation.ok) {
      return this.failedValidation(validation.info);
    }

    const account = this.getAccountByAdmin({ adminId, accountId });

    if (account) {
      contact.accountId = accountId;
      return account.createContact(contact);
    }
  }

  send(type: string, { adminId, accountId, content }: CreateSenderObjectInterface) {
    const beforeSend = this.senderCheck({ adminId, accountId, content });
    let contacts;

    if (!beforeSend.ok) {
      return this.failedValidation(beforeSend.info);
    }

    if (type === 'sms') {
      const contactsWithPhones = contacts = beforeSend.info.filter((elem: ContactInterface) => !!elem.phoneNumber);
      contacts = contactsWithPhones.filter((elem: any) => this.cleanFromBlack(elem, 'sms'));
      const sms = new Sms({ type: 'sms', contacts, content });
      this.sms.push(sms);
      return sms.send();
    } else if (type === 'letter') {
      const contactsWithEmail = beforeSend.info.filter((elem: ContactInterface) => !!elem.email);
      contacts = contactsWithEmail.filter((elem: any) => this.cleanFromBlack(elem, 'letter'));
      const letter = new Letter({ type: 'letter', contacts, content });
      this.letters.push(letter);
      return letter.send();
    }

  }

  // Should accept only encrypted strings, all other strings will be ignored.
  // Should accept only object with all required fileds. see EncryptedDataStructure interface
  // Account should have contact and contact should have token.
  // todo: Refactor method. Split to small pieces.
  unsubsribeLink(link: string) {
    const encryption = pipe(
      isEncryptedString,
      errorHandler
    )({ validateData: { link } });

    if (!encryption.ok) {
      return this.failedValidation(encryption.info);
    }

    const linkString = decrypt(link);
    const decryptedLink = linkString.replace(/\s+/g, '');

    const validStructure = pipe(
      isUnsubscribeLinkStructureValid,
      errorHandler
    )({ validateData: { decryptedLink } });

    if (!validStructure.ok) {
      return this.failedValidation(validStructure.info);
    }

    const linkObject: EncryptedDataStructure = JSON.parse(decryptedLink);
    const { accountId, contactId, token } = linkObject;
    // console.log('linkObject: ', linkObject);

    const checkSecurityInfo = pipe(
      isAccountExists.bind(this.accounts),
      isAccountContactTokensMatch.bind(this.getAccount(accountId)),
      errorHandler
    )({ validateData: { accountId, contactId, token } });

    if (!checkSecurityInfo.ok) {
      return this.failedValidation(validStructure.info);
    }

    let result;

    // refactor this validation
    const account = this.getAccount(linkObject.accountId);

    if (linkObject.unsubscribeSource == 'SMS_LINK' && linkObject.phoneNumber) {
      result = account.unsubscribePhoneLink(linkObject.phoneNumber, linkObject.token);
    } else if (linkObject.unsubscribeSource == 'EMAIL_LINK' && linkObject.email) {
      result = account.unsubscribeEmailLink(linkObject.email, linkObject.token);
    }

    this.blacklist.push({
      email: result?.info.email,
      phoneNumber: result?.info.phoneNumber,
      unsubscribeSource: 'EMAIL_LINK'
    });

    const { email, phoneNumber } = result?.info;
    const emails = [email];
    const phoneNumbers = [phoneNumber];

    this.accounts.forEach((account: AccountInterface) => {
      const accountContact = account.contacts;

      accountContact.forEach((contact: ContactInterface) => {
        if (emails.includes(contact.email)) {
          contact.phoneNumber && phoneNumbers.push(contact.phoneNumber);
          contact.emailEnabled = false;
          contact.phoneNumberEnabled = false;
        }

        if (phoneNumbers.includes(contact.phoneNumber)) {
          contact.email && emails.push(contact.email);

          contact.phoneNumberEnabled = false;
          contact.emailEnabled = false;
        }
      });
    });

    // const newContacts = this.accounts.map(account => account.contacts);
    // console.log('newContacts: ', newContacts);

    return result;
  }

  unsubscribeCRM(type: type, { adminId, data }: UnsubscribeCRM): MessageInterface | undefined {
    // Validate all inputs
    const account = this.getAccountByAdmin({ adminId, accountId: data.accountId });
    let result;
    if (type === 'letter' && data.email) {
      result = account?.unsubscribeEmailCrm(data.email);
    } else if (type === 'sms' && data.phoneNumber) {
      result = account?.unsubscribePhoneCrm(data.phoneNumber);
    }
    return result;
  }

  resubscribe(type: type, { accountId, adminId, email, phoneNumber }: ResubscribeData) {
    // todo validate parametrs
    const account = this.getAccountByAdmin({ adminId, accountId });
    let result;

    if (type === 'sms') {
      result = account?.resubscribePhone({ phoneNumber });
    } else if (type === 'letter') {
      result = account?.resubscribeEmail({ email });
    }
    return
  }

  private cleanFromBlack(elem: any, key: type) {
    let phone = tools.findByPhone(this.blacklist, elem.phoneNumber);
    let email = tools.findByEmail(this.blacklist, elem.email);

    return isEmpty(phone) && isEmpty(email);
  }

  private senderCheck({ adminId, accountId, content }: CreateSenderObjectInterface): MessageInterface {
    // function isParamsEmpty will handle if content will be empty
    // todo: need additional validation if content structure will become more complex
    const validation: MessageInterface = pipe(
      isParamsEmpty,
      isAdminExists.bind(this.admins),
      isAccountExists.bind(this.accounts),
      isAdminOwnerOfAccount.bind(this.getAdminById(adminId)),
      isContactsExists.bind(this.getContacts({ adminId, accountId })),
      errorHandler
    )({ validateData: { accountId, adminId, content } });

    if (!validation.ok) {
      return this.failedValidation(validation.info);
    }

    return tools.statusMessage(true, '', this.getContacts({ adminId, accountId }));
  }

  private getContacts({ adminId, accountId }: AccessArguments) {
    const account = this.getAccountByAdmin({ adminId, accountId });
    const contacts = account?.getContacts || [];
    const cleanContacts = contacts.filter(this.removeUnsubscribed);

    return cleanContacts;
  }

  private getAccountByAdmin({ adminId, accountId }: AccessArguments): Account | undefined {
    const validation = pipe(
      isAdminExists.bind(this.admins),
      isAccountExists.bind(this.accounts),
      errorHandler
    )({ validateData: { adminId, accountId } });

    if (!validation.ok) return;

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
  // todo: write pipe function for basic access check validation
  private accessCheck() {

  }
}