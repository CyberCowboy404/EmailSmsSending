// import { UserInformation } from '../interfaces/Application.interface'
import { AdminConstructor } from '../interfaces/Admin.interface';
import { AccessArguments } from '../interfaces/Application.interface';
const messages = {
  error: {
    name: 'You should specify a name',
    contactNotFound: 'Contact not found',
    cantResubscribe: 'Resubscription failed'
  },
  validation: {
    emptyParams: 'Arguments should be defined',
    passed: 'Successfully validated',
    failed: 'Validation failed. Look additional info to find our more.',
    notValidEmail: 'Email is invalid'
  },
  admin: {
    // todo: create this like a function in order to log more detailed message
    created({ name, email }: AdminConstructor): string {
      return `Admin: ${name} created with email: ${email}`;
    },
    accountExists: 'Admin already has this account',
    adminExists: 'Admin with this email already exist',
    adminNotExist(id: string) { return `Admin with id: ${id} not exist` },
    accountLinked: 'Account succesfully linked to admin',
    accessError({ adminId, accountId }: AccessArguments) {
      return `Admin id: ${adminId} is not owner of account id: ${accountId}`
    }
  },
  account: {
    // todo: create this like a function in order to log more detailed message
    created: 'Account created',
    accountNotExists: 'Account not exists'
  },
  contact: {
    created: 'Contact created',
    blackList: 'Contact in blacklist',
    noContactsProvided: 'No contacts provided. You should specify email or phone number to proceed',
    notValid: 'Contact should have valid email or phone number',
    updated({ id, email, phoneNumber }: any) {
      return `Contact id:${id} has been updated with data email: ${email} phoneNumber: ${phoneNumber}`
    }
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
