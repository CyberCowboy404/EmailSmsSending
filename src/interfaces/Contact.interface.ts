export interface ContactInterface {
  id: string;
  name: string;
  email: string;
  emailEnabled: boolean;
  // Better number or string?
  phoneNumber?: number;
  phoneNumberEnabled?: boolean;
  accountId: string;
  createTime: number;
  updateTime: number;
  unsubscribeSource?: UnsubscribeSource
}
export interface CreateContactInterface {
  adminId: string;
  accountId: string;
  contact: ContactInterface;
}
type UnsubscribeSource = 'EMAIL_LINK' | 'CRM' | 'SMS_LINK';
