const User = require("./User");

async function seedDatabase() {
  try {
    // Dummy data to initialize the database
    const initialData = [
      { username: "user1", password: "password1" },
      { username: "user2", password: "password2" },
    ];

    await User.deleteMany({});
    await User.create(initialData);

    console.log("Database initialized with dummy data.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

module.exports = { seedDatabase };
