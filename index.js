const { program } = require("commander");
const contactsPath = require("./db/contacts.json");
// console.log(contactsPath);

const contacts = require("./contacts");

program
  .option(
    "-a, --action <string>",
    "choose action: list, get -i, add -n -e -p, remove -i"
  ) // Додавання опції -a або --action з описом, яка дозволяє вибрати дію (list, get, add, remove) та передати додаткові параметри
  .option("-i, --id <string>", "user id") // Додавання опції -i або --id з описом, яка дозволяє передати ідентифікатор користувача
  .option("-n, --name <string>", "user name")
  .option("-e, --email <string>", "user email")
  .option("-p, --phone <string>", "user phone");

program.parse(process.argv); // Розбір аргументів командного рядка

const argv = program.opts(); // Отримання об'єкта з опціями та їх значеннями

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case "list":
      const contactList = await contacts.listContacts();
      return console.table(contactList);

    case "get":
      const oneContact = await contacts.getContactById(id);
      return console.table(oneContact);

    case "remove":
      const deleteContact = await contacts.removeContact(id);
      return console.table(deleteContact);

    case "add":
      const newContact = await contacts.addContact({ name, email, phone });
      return console.table(newContact);

    default: // Якщо немає відповідності
      console.warn("\x1B[31m Unknown action type!"); // Вивести повідомлення про невідому дію червоним кольором
  }
};

// invokeAction({ action: "list" });
// invokeAction({ action: "get", id: "qdggE76Jtbfd9eWJHrssH" });
// invokeAction({
//   action: "add",
//   name: "Gnom Petya",
//   email: "gnom@petya.com",
//   phone: "067-111-22-03",
// });
// invokeAction({ action: "remove", id: "uqQxRpR-VMf9CgcnKikRe" });

invokeAction(argv); // Виклик функції invokeAction(argv), передаючи об'єкт з опціями та їх значеннями
