export default interface Contact {
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
type UnsubscribeSource = 'EMAIL_LINK' | 'CRM' | 'SMS_LINK';
