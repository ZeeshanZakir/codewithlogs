const bcrypt = require("bcryptjs");

const password = "Admin@123";
const hash = "$2b$10$Za4HnImIChkrr.M8OxWUS.j71jw3h4CJ59k6atSv1Iq01iM13tbPe";

bcrypt.compare(password, hash).then((result) => {
  console.log("Password Match:", result);
});