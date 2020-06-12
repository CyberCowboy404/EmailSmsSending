import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16;
// todo:
// Get key from env var
// Dont use it in production
// Use randomstring module in order to generate new key and add it to environment
const KEY = 'XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT';

export const encrypt = (data: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY), iv);
  return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(ENCODING);
}

export const decrypt = (data: string) => {
  const binaryData = Buffer.from(data, ENCODING);
  const iv = binaryData.slice(-IV_LENGTH);
  const encryptedData = binaryData.slice(0, binaryData.length - IV_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY), iv);

  return Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();
}

export const generateToken = (): string => {
  let buf: Buffer = crypto.randomBytes(32);
  let token: string = buf.toString('hex');

  return token;
}