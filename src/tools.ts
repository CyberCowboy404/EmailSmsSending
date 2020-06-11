const tools = {
  generateUniqId() {
    return Math.random().toString(36).substr(2, 9);
  },
  generateUnixTimeStamp() {
    return Math.round((new Date()).getTime() / 1000);
  }
}

export default tools;