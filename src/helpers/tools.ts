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
  statusMessage(ok: boolean, message: string, data: any = {}): MessageInterface {
    return { ok, message, data }
  }
}

export default tools;