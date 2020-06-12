export interface ContactInterface {
  id: string;
  name: string;
  email: string;
  emailEnabled: boolean;
  // Better number or string?
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
  contact: ContactInterface;
}
type UnsubscribeSource = 'EMAIL_LINK' | 'CRM' | 'SMS_LINK';
