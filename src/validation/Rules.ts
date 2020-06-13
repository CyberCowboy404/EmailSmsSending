import { some, isEmpty } from 'lodash';
import messages from '../helpers/messages';
import tools from '../helpers/tools';
import { MessageInterface } from '../interfaces/Messages.iterface';

export type ValidationData = {
  validateData: any;
  errorArray: string[];
}

export function isParamsEmpty({ validateData, errorArray = [] }: ValidationData): ValidationData {
  if (!some(validateData, isEmpty)) {
    return {
      validateData,
      errorArray,
    }
  } else {
    return {
      validateData,
      errorArray: [
        ...errorArray,
        messages.validation.emptyParams
      ]
    }
  }
}
export function isValidEmail({ validateData, errorArray = [] }: ValidationData): ValidationData {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  if (re.test(validateData.email)) {
    return {
      validateData,
      errorArray,
    }
  } else {
    return {
      validateData,
      errorArray: [
        ...errorArray,
        messages.validation.notValidEmail
      ]
    }
  }
}
export function errorHandler({ validateData, errorArray = [] }: ValidationData): MessageInterface {
  if (errorArray.length) {
    return tools.statusMessage(false, messages.validation.failed, errorArray);
  } else {
    return tools.statusMessage(true, messages.validation.passed);
  }
}
