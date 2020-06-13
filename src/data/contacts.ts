import tools from '../helpers/tools';

const contacts1 = (accountId: string) => {
  return {

    id: tools.generateUniqId(),
    name: 'Jenifer',
    email: 'jenifer@gmail.com',
    emailEnabled: true,
    phoneNumberEnabled: true,
    phoneNumber: '+7808080808080',
    accountId,
    createTime: tools.generateUnixTimeStamp(),
    updateTime: tools.generateUnixTimeStamp()
  }
};

const contacts2 = (accountId: string) => {
  return {

    id: tools.generateUniqId(),
    name: 'Garfield',
    email: 'garfield@gmail.com',
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
    name: 'Gan',
    email: 'geril@gmail.com',
    phoneNumber: '+3805050505050',
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
    name: 'Greddy',
    email: 'freddy@gmail.com',
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
