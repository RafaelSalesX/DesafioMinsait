// cypress/support/fakerData.js
import { faker } from '@faker-js/faker';

export const generateFakeData = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  let phoneNumber = faker.phone.number();
  phoneNumber = phoneNumber.replace(/[^\d]/g, '');  // Remove qualquer caractere não numérico
  const city = faker.address.city();
  const message = faker.lorem.sentence();
  const country = faker.address.country();

  return {
    firstName,
    lastName,
    email,
    phoneNumber,
    city,
    message,
    country,  
  };
};
