export default interface Account {
  id: string;
  name: string;
  // Which type of references?
  adminId: string;
  createTime: number;
  updateTime: number;
}