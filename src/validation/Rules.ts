import { some, isEmpty } from 'lodash';
import messages from '../helpers/messages';
import tools from '../helpers/tools';
import { MessageInterface } from '../interfaces/Messages.iterface';
import { AdminInterface } from '../interfaces/Admin.interface';
import { Admin } from '../Admin';
import { BlackList } from '../interfaces/Application.interface';
import { Account } from '../Account';
import { ContactInterface } from '../interfaces/Contact.interface';
import { pipe } from 'lodash/fp';
export type ValidationData = {
  validateData: {
    params: any
  };
  errorArray?: string[];
  admins?: AdminInterface[]
}

export function isParamsEmpty({ validateData, errorArray = [] }: ValidationData): ValidationData {
  if (!some(validateData.params, isEmpty)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.validation.emptyParams, { validateData, errorArray });
  }
}
export function isValidEmail({ validateData, errorArray = [] }: ValidationData): ValidationData {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  if (re.test(validateData.params.email)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.validation.notValidEmail, { validateData, errorArray });
  }
}

export function isUniqAdminEmail(this: Admin[], { validateData, errorArray }: ValidationData): ValidationData {
  // directly send arguments via this
  const admins: Admin[] = this;
  const admin = tools.findByEmail(admins, validateData.params.email) || [];

  if (isEmpty(admin)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.admin.adminExists, { validateData, errorArray });
  }
}

export function isAdminExists(this: Admin[], { validateData, errorArray }: ValidationData): ValidationData {
  const admins: Admin[] = this;
  const admin = tools.findById(admins, validateData.params.adminId);

  if (!isEmpty(admin)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.admin.adminNotExist(validateData.params.adminId), { validateData, errorArray });
  }
}

export function isAdminOwnerOfAccount(this: Admin, { validateData, errorArray }: ValidationData): ValidationData {
  const admin: Admin = this;
  const account = admin?.getAccount(validateData.params.accountId);
  const { accountId, adminId } = validateData.params;
  if (!isEmpty(admin) && !isEmpty(account)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.admin.accessError({ accountId, adminId }), { validateData, errorArray });
  }
}

export function isContactsProvided(this: ContactInterface, { validateData, errorArray }: ValidationData): ValidationData {
  const contact: ContactInterface = this;
  if (!isEmpty(contact) && (contact.email || contact.phoneNumber)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.contact.noContactsProvided, { validateData, errorArray });
  }
}

export function isContactInBlackList(this: BlackList[], { validateData, errorArray }: ValidationData): ValidationData {
  const blacklist = this;
  const contactEmail = tools.findByEmail(blacklist, validateData.params.email);
  const contactPhone = tools.findByPhone(blacklist, validateData.params.phoneNumber);

  if (isEmpty(blacklist) || (isEmpty(contactEmail) && isEmpty(contactPhone))) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.contact.blackList, { validateData, errorArray });
  }
}

export function isAccountExists(this: Account[], { validateData, errorArray }: ValidationData): ValidationData {
  const accounts = this;
  const account = tools.findById(accounts, validateData.params.accountId);

  if (!isEmpty(accounts) && !isEmpty(account)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.account.accountNotExists, { validateData, errorArray });
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
