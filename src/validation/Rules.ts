import { some, isEmpty } from 'lodash';
import messages from '../helpers/messages';
import tools from '../helpers/tools';
import { MessageInterface } from '../interfaces/Messages.iterface';
import { AdminInterface } from '../interfaces/Admin.interface';
import { Admin } from '../Admin';

export type ValidationData = {
  validateData: {
    params: any
  };
  errorArray: string[];
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

export function isAdminIdRight(this: Admin[], { validateData, errorArray }: ValidationData): ValidationData {
  const admins: Admin[] = this;
  const admin = tools.findById(admins, validateData.params.adminId);
  
  if (!isEmpty(admin)) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.admin.adminNotExist(validateData.params.adminId), { validateData, errorArray });
  }
}

export function isAccountAlreadyLinked(this: Admin[], { validateData, errorArray }: ValidationData): ValidationData {
  const admins: Admin[] = this;
  const admin = tools.findById(admins, validateData.params.adminId);
  if (admin && admin?.length) {
    return nextData({ validateData, errorArray });
  } else {
    return errorMessage(messages.admin.adminExists, { validateData, errorArray });
  }
}

export function errorHandler({ errorArray = [] }: ValidationData): MessageInterface {
  if (errorArray.length) {
    return tools.statusMessage(false, messages.validation.failed, errorArray);
  } else {
    return tools.statusMessage(true, messages.validation.passed);
  }
}
export function errorMessage(message: string, { validateData, errorArray = [], admins }: ValidationData) {
  return {
    admins,
    validateData,
    'errorArray': [
      ...errorArray,
      message
    ]
  }
}
export function nextData({ validateData, errorArray = [], admins = [] }: ValidationData) {
  return {
    admins,
    validateData,
    errorArray,
  }
}
