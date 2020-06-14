import { UnsubscribeSource } from './Contact.interface';
import { type } from '../Sender/Sender';
export interface AccessArguments {
  adminId: string;
  accountId: string;
}

export interface UserInformation {
  email?: string;
  phoneNumber?: string;
}

export interface ResubscribeData extends UserInformation, AccessArguments {

}

export type UnsubScribeCrmData = {
  email?: string;
  phoneNumber?: string;
  accountId: string;
  unsubscribeSource?: UnsubscribeSource;
}
export type UnsubscribeCRM = {
  adminId: string;
  data: UnsubScribeCrmData
}

export interface CreateSenderObjectInterface extends AccessArguments {
  content: string;
}

export type BlackList = {
  unsubscribeSource: UnsubscribeSource;
  email?: string;
  phoneNumber?: string;
};