const seed = require("./seed");
const db = require("../connection");
const data = require("../data");

seed(data)
  .then(() => {
    console.log("Database seeded successfully!");
    db.end();
  })
  .catch((err) => {
    console.error("Error seeding database:", err);
    db.end();
  });
