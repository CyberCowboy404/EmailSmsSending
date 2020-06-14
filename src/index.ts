// Use this file in order to test how application working
// todo: run linter and check lint errors

import { Application } from './Application';
import * as data from './data/contacts';

const app = new Application();

// - Admin sends emails to all his subscribed contacts via his Account 
// - Admin sends sms to all his subscribed contacts via his Account
// - Contact is unsubscribed by email with EMAIL_LINK
// - Contact is unsubscribed by email with CRM
// - Contact is unsubscribed by phone number with SMS_LINK
// - Contact is unsubscribed by phone with CRM
// - Admin is trying to add a new contact with email that is blocked
// - Admin is trying to add a new contact with phone number that is blocked 
// - Show the list of all blocked emails
// - Show the list of all blocked phone numbers
// - Update the list of blocked emails by array of emails
// - Update the list of blocked phone numbers by array of phone numbers
// - Admin resubscribes the contact and tries to send him email / sms

const adminId = app.createAdmin({ email: 'admin@gmail.com', name: 'name' }).info.id;
const accountId = app.createAccount({ adminId, name: 'Account 1' }).info.id;

// generate Account contacts
data.contactEmail1.accountId = accountId;
app.createContact({ accountId, adminId, contact: data.contactEmail1 });

data.contactEmail2.accountId = accountId;
app.createContact({ accountId, adminId, contact: data.contactEmail2 });

data.contactEmail3.accountId = accountId;
const contactEmail3 = app.createContact({ accountId, adminId, contact: data.contactEmail3 })?.info;

data.contactPhone1.accountId = accountId;
app.createContact({ accountId, adminId, contact: data.contactPhone1 });

data.contactPhone2.accountId = accountId;
app.createContact({ accountId, adminId, contact: data.contactPhone2 });

data.contactPhone3.accountId = accountId;
const contactPhone3 = app.createContact({ accountId, adminId, contact: data.contactPhone3 })?.info;


data.contactEmail1Same.accountId = accountId;
app.createContact({ accountId, adminId, contact: data.contactEmail1Same });

data.contactEmail3Same.accountId = accountId;
app.createContact({ accountId, adminId, contact: data.contactEmail3Same });

data.contactPhone1.accountId = accountId;
app.createContact({ accountId, adminId, contact: data.contactPhone1Same });

data.contactPhone3Same.accountId = accountId;
app.createContact({ accountId, adminId, contact: data.contactPhone3Same });

// - Admin sends emails to all his subscribed contacts via his Account 
const lettersStatus = app.send('letter', { adminId, accountId, content: 'Email content latter' });

// - Admin sends sms to all his subscribed contacts via his Account
const smsStatus = app.send('sms', { adminId, accountId, content: 'SMS content latter' });

// Extract message unsubcribe link
const unsubcribeBySmsLink = smsStatus?.info.sent[0].message.replace(/.*token=/, '');
const unsubcribeByEmailLink = lettersStatus?.info.sent[0].message.replace(/.*token=/, '');

// - Contact is unsubscribed by phone number with SMS_LINK
app.unsubsribeLink(unsubcribeBySmsLink);
// - Contact is unsubscribed by email with EMAIL_LINK
app.unsubsribeLink(unsubcribeByEmailLink);

// Pick users which should be unsubcribed
const unsubcribeByCrmEmail = contactEmail3;
const unsubcribeByCrmSms = contactPhone3;

// - Contact is unsubscribed by email with CRM
app.unsubscribeCRM('letter', { adminId, data: unsubcribeByCrmEmail });
// - Contact is unsubscribed by phone with CRM
app.unsubscribeCRM('sms', { adminId, data: unsubcribeByCrmSms });

// - Admin is trying to add a new contact with email that is blocked
app.createContact({ adminId, accountId, contact: data.contactEmail1 });
// - Admin is trying to add a new contact with phone number that is blocked 
app.createContact({ adminId, accountId, contact: data.contactPhone1 });

// In case we adding user banned by crm we should update contact
// Js is to fast so we need to create a timeout in order to check if update time changed
setTimeout(function () {
  // - Admin is trying to add a new contact with email that is blocked
  app.createContact({ adminId, accountId, contact: contactEmail3 });
  // - Admin is trying to add a new contact with phone number that is blocked 
  app.createContact({ adminId, accountId, contact: contactPhone3 });

  // - Show the list of all blocked emails
  // - Show the list of all blocked phone numbers
  app.blacklist;
  
  app.resubscribe('sms', { accountId, adminId, phoneNumber: contactPhone3.phoneNumber });
  app.resubscribe('letter', { accountId, adminId, email: contactEmail3.email });
  
  app.send('sms', { adminId, accountId, content: 'content' });
  app.send('letter', { adminId, accountId, content: 'content' });

}, 2000);


