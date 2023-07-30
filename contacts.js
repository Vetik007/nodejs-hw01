const fs = require("fs/promises"); // підключення пакету fs для роботи з файловою системою
const path = require("path"); // підключення пакету path для роботи з шляхами до файлів
const { nanoid } = require("nanoid");

const contactsPath = path.join("db", "contacts.json"); // шлях до файлу з контактами
// console.log(contactsPath);

// функція яка завантажує всі контакти
const listContacts = async () => {
  /**
   * fs повертає Buffer тобто набір символів з сиситеми Юнікод. Для того щоб повернути строку необхідно зазначити властивість utf-8 яка автоматично перетворює Buffer у строку
   * const data = await fs.readFile("./db/contacts.json", "utf-8");
   * const data = await fs.readFile(contactsPath, "utf-8");
   *
   */

  // коли прогоняємо data через JSON.parse властивість utf-8 можна не використовувати, так як Buffer який повертае fs - JSON.parse автоматично перетворює у строку.
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

//  функція яка повертає один контакт по id
const getContactById = async (contactId) => {
  const contacts = await listContacts(); // отримуємо список всіх контактів
  const result = contacts.find((item) => item.id === contactId); // отрумуємо контакт по id
  return result || null;
};

// функція яка повртає об'єкт доданого(створеного) контакту
const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts(); // отримуємо список всіх контактів
  const newContact = {
    id: nanoid(), // генеруємо унікальний id
    name,
    email,
    phone,
  };
  contacts.push(newContact); // пушимо новий контакт до списку контактів
  /**
   * stringify повертає одну строку, тобто до файлу contacts.json буде записано не масив об'єктів а всі контакти однією строкою. Для того щоб у contacts.json було записано масив об'єктів у властивості stringify додаємо додаткові властивості, а саме у третю властивість додаємо число 1,2 або більше - це буквально отступи
   */
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2)); // перезаписуємо файл з контактами

  return newContact;
};

//  функція яка повертає об'єкт видаленого контакту. Повртає null якщо контакт з таким id не знайдено
const removeContact = async (contactId) => {
  const contacts = await listContacts(); // отримуємо список всіх контактів
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null; // повертаємо null якщо контакт з таким id не знайдено
  }

  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2)); // перезаписуємо файл з контактами
  return result; // повертаємо видалений контакт

  //   // ...твой код. Возвращает объект удаленного контакта. Возвращает null, если объект с таким id не найден.
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
