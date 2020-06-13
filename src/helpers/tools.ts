import { MessageInterface } from '../interfaces/Messages.iterface';

const tools = {
  generateUniqId() {
    return Math.random().toString(36).substr(2, 9);
  },
  generateUnixTimeStamp() {
    return Math.round((new Date()).getTime() / 1000);
  },
  isEmptyArray(arr: any[]): boolean {
    return Array.isArray(arr) && !!arr.length;
  },
  findByEmail(collection: any[], email: string) {
    return collection.find(elem => elem.email == email);
  },
  findById(collection: any[], id: string) {
    return collection.find(elem => elem.id == id);
  },
  findByPhone(collection: any[], phoneNumber: string) {
    return collection.find(elem => elem.phoneNumber == phoneNumber);
  },
  statusMessage(ok: boolean, message: string, info: any = {}): MessageInterface {
    return { ok, message, info }
  }
}

export default tools;