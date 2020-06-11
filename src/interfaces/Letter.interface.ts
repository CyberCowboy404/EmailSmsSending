export default interface Letter {
  id: string;
  content: string;
  contacts: string;
  sentTime: string;
  status: status;
  updateTime: number;
  createTime: number;
}

type status = 'DELIVERED' | 'FAILED';