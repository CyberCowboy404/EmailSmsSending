const messages = {
  error: {
    name: 'You should specify a name',
    contactNotFound: 'Contact not found'
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
    phoneUser: 'User sucessfully unsubcribed from sms',
    emailUser: 'User sucessfully unsubcribed from email',
    emailCRM: 'User sucessfully from email crm',
    phoneCRM: 'User sucessfully from phone crm'
  },
  resubscribe: 'Contact resubscribed'
};

export default messages;
