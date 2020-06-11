export default interface Sms {
  id: string;
  content: string;
  contacts: string;
  sendTime: string;
  status: status;
  updateTime: number;
  createTime: number;
}


type status = 'DELIVERED' | 'FAILED';