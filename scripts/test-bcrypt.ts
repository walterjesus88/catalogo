import bcrypt from "bcryptjs";

const hash = "$2a$12$3NhZdVvG37ECRan9ylA6AOTP45jy.9Lrq5LSuJYaTeUqhxvw0yViS";
console.log("match:", bcrypt.compareSync("admin123", hash));

// Also test: what happens when we hash admin123 fresh?
const newHash = bcrypt.hashSync("admin123", 12);
console.log("new hash:", newHash);
console.log("new hash matches:", bcrypt.compareSync("admin123", newHash));
