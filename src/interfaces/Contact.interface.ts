export interface ContactInterface {
  id: string;
  name: string;
  email: string;
  emailEnabled?: boolean;
  phoneNumber?: string;
  phoneNumberEnabled?: boolean;
  accountId: string;
  createTime: number;
  updateTime: number;
  token?: string;
  unsubscribeSource?: UnsubscribeSource
}
export interface CreateContactInterface {
  adminId: string;
  accountId: string;
  contact: ContactData;
}
export type ContactData = {
  email?: string;
  name: string;
  phoneNumber?: string;
  accountId: string;
}
export type UnsubscribeSource = 'EMAIL_LINK' | 'CRM' | 'SMS_LINK';
