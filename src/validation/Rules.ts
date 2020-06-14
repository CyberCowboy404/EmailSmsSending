import { some, isEmpty, keys } from 'lodash';
import messages from '../helpers/messages';
import tools from '../helpers/tools';
import { MessageInterface } from '../interfaces/Messages.iterface';
import { AdminInterface } from '../interfaces/Admin.interface';
import { Admin } from '../Admin';
import { BlackList } from '../interfaces/Application.interface';
import { Account } from '../Account';
import { ContactInterface, ContactData } from '../interfaces/Contact.interface';
import { decrypt } from '../helpers/encryption';

export type ValidationData = {
  validateData: {
    email?: string;
    adminId?: string;
    accountId?: string;
    smsId?: string;
    letterId?: string;
    phoneNumber?: string;
    name?: string;
    link?: string;
    contactId?: string;
    contact?: {
      email: string;
      phoneNumber: string;
    };
    decryptedLink?: string,
    content?: string;
    token?: string;
  };
  errorArray?: string[];
  admins?: AdminInterface[]
}

export function isParamsEmpty({ validateData, errorArray = [] }: ValidationData): ValidationData {
  if (!some(validateData, isEmpty)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.validation.emptyParams, { validateData, errorArray });
  }
}

export function isValidEmail({ validateData, errorArray = [] }: ValidationData): ValidationData {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  if (re.test(validateData.email || '')) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.validation.notValidEmail, { validateData, errorArray });
  }
}

export function isUniqAdminEmail(this: Admin[], { validateData, errorArray = [] }: ValidationData): ValidationData {
  // directly send arguments via this
  const admins: Admin[] = this;
  const admin = tools.findByEmail(admins, validateData.email || '') || [];

  if (isEmpty(admin)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.admin.adminExists, { validateData, errorArray });
  }
}

export function isAdminExists(this: Admin[], { validateData, errorArray = [] }: ValidationData): ValidationData {
  const admins: Admin[] = this;
  const admin = tools.findById(admins, validateData.adminId || '');

  if (!isEmpty(admin)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.admin.adminNotExist(validateData.adminId || ''), { validateData, errorArray });
  }
}

export function isAdminOwnerOfAccount(this: Admin, { validateData, errorArray = [] }: ValidationData): ValidationData {
  const admin: Admin = this;
  const account = admin?.getAccount(validateData.accountId || '');
  const { accountId = '', adminId = '' } = validateData;

  if (!isEmpty(admin) && !isEmpty(account)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.admin.accessError({ accountId, adminId }), { validateData, errorArray });
  }
}

export function isContactsProvided(this: ContactData, { validateData, errorArray = [] }: ValidationData): ValidationData {
  const contact: ContactData = this;
  if (!isEmpty(contact) && (contact.email || contact.phoneNumber)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.contact.noContactsProvided, { validateData, errorArray });
  }
}

export function isContactsExists(this: ContactInterface[], { validateData, errorArray = [] }: ValidationData): ValidationData {
  const contact: ContactInterface[] = this;
  if (!isEmpty(contact)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.sender.contactsNotExists, { validateData, errorArray });
  }
}

export function isUnsubscribeLinkStructureValid({ validateData, errorArray = [] }: ValidationData): ValidationData {
  try {
    const unsubscribeData = JSON.parse(validateData.decryptedLink || '');

    const isRequiredFiledExists = unsubscribeData.hasOwnProperty('token')
      && unsubscribeData.hasOwnProperty('unsubscribeSource')
      && unsubscribeData.hasOwnProperty('accountId')
      && unsubscribeData.hasOwnProperty('contactId')
      && (unsubscribeData.hasOwnProperty('email') || unsubscribeData.hasOwnProperty('phoneNumber'));

    const rightSource = unsubscribeData.unsubscribeSource === 'SMS_LINK' || unsubscribeData.unsubscribeSource === 'EMAIL_LINK';

    if (isRequiredFiledExists && rightSource) {
      return nextData({ validateData, errorArray });
    } else {
      return errorMessage(messages.unsubscribe.missingRequiredData, { validateData, errorArray });
    }

  } catch (err) {
    return errorMessage(messages.unsubscribe.badLink, { validateData, errorArray });
  }
}

export function isEncryptedString({ validateData, errorArray = [] }: ValidationData): ValidationData {
  try {
    decrypt(validateData.link || '');
    return nextData({ validateData, errorArray });
  } catch (err) {
    return errorMessage(messages.unsubscribe.notEncrypted, { validateData, errorArray });
  }
}

export function isContactInBlackList(this: BlackList[], { validateData, errorArray = [] }: ValidationData): ValidationData {
  const blacklist = this;
  const contactEmail = tools.findByEmail(blacklist, validateData.contact?.email || '');
  const contactPhone = tools.findByPhone(blacklist, validateData.contact?.phoneNumber || '');

  if (isEmpty(blacklist) || (isEmpty(contactEmail) && isEmpty(contactPhone))) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.contact.blackList, { validateData, errorArray });
  }
}

export function isAccountExists(this: Account[], { validateData, errorArray = [] }: ValidationData): ValidationData {
  const accounts = this;
  const account = tools.findById(accounts, validateData.accountId || '');

  if (!isEmpty(accounts) && !isEmpty(account)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.account.accountNotExists, { validateData, errorArray });
  }
}

export function isAccountContactTokensMatch(this: Account, { validateData, errorArray = [] }: ValidationData): ValidationData {
  const account = this;
  if (!account) {
    return errorMessage(messages.account.accountNotExists, { validateData, errorArray });
  }
  const contactId = validateData.contactId || '';
  const contact = tools.findById(account.contacts, contactId);
  if (!contact) {
    return errorMessage(messages.contact.notExists, { validateData, errorArray });
  }
  const tokensMatch = contact.token === validateData.token;

  if (!isEmpty(account) && !isEmpty(contact) && tokensMatch) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.unsubscribe.badAccess, { validateData, errorArray });
  }
}

export function errorHandler({ errorArray = [] }: ValidationData): MessageInterface {
  if (errorArray.length) {
    return tools.statusMessage(false, messages.validation.failed, errorArray);
  } else {
    return tools.statusMessage(true, messages.validation.passed);
  }
}

export function errorMessage(message: string, { validateData, errorArray = [] }: ValidationData) {
  return {
    validateData,
    'errorArray': [
      ...errorArray,
      message
    ]
  }
}

export function nextData({ validateData, errorArray = [] }: ValidationData) {
  return {
    validateData,
    errorArray,
  }
}
