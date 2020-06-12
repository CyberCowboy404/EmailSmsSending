const messages = {
  error: {
    name: 'You should specify a name',
  },
  admin: {
    // todo: create this like a function in order to log more detailed message
    created: 'Admin created',
    accountExists: 'Admin already has this account',
    accountLinked: 'Account succesfully linked to admin'
  },
  account: {
    // todo: create this like a function in order to log more detailed message
    created: 'Account created',
  },
  contact: {
    created: 'Contact created'
  },
  sender: {
    created(type: string) {
      return `${type} is created`
    },
    sent: 'Data has been sent',
    notSent: 'Data not sent'
  },
  unsubscribe: {
    token: 'Tokens mismatch',
    phoneUser: 'User sucessfully unsubcribed'
  }
};

export default messages;
