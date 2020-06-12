import tools from '../helpers/tools';

const contacts1 = (accountId: string) => {
  return {

    id: tools.generateUniqId(),
    name: 'Simon',
    email: 'simon@gmail.com',
    emailEnabled: true,
    phoneNumberEnabled: true,
    accountId,
    createTime: tools.generateUnixTimeStamp(),
    updateTime: tools.generateUnixTimeStamp()
  }
};

const contacts2 = (accountId: string) => {
  return {

    id: tools.generateUniqId(),
    name: 'Simon',
    email: 'simon@gmail.com',
    emailEnabled: true,
    phoneNumberEnabled: true,
    accountId,
    createTime: tools.generateUnixTimeStamp(),
    updateTime: tools.generateUnixTimeStamp()
  }
};

const contacts3 = (accountId: string) => {
  return {

    id: tools.generateUniqId(),
    name: 'Simon',
    email: 'simon@gmail.com',
    emailEnabled: true,
    phoneNumberEnabled: true,
    accountId,
    createTime: tools.generateUnixTimeStamp(),
    updateTime: tools.generateUnixTimeStamp()
  }
};

const contacts4 = (accountId: string) => {
  return {
    id: tools.generateUniqId(),
    name: 'Simon',
    email: 'simon@gmail.com',
    emailEnabled: true,
    phoneNumberEnabled: true,
    accountId,
    createTime: tools.generateUnixTimeStamp(),
    updateTime: tools.generateUnixTimeStamp()
  }
};

const contact = {
  contacts1,
  contacts2,
  contacts3,
  contacts4,
};

export default contact;
