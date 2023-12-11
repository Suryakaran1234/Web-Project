const handlebars = require("express-handlebars");
const path = require("path");

function setup(app) {
  app.engine(
    ".hbs",
    handlebars.engine({
      defaultLayout: "main",
      extname: ".hbs",
      helpers: {
        formatDate: function (dateString) {
          // Parse the date string
          const date = new Date(dateString);

          // Format the date as desired (example: YYYY-MM-DD)
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

          return formattedDate;
        },
      },
      partialsDir: path.join(__dirname, "../views/partials"), // If you're using partials
    })
  );
  app.set("view engine", "hbs");
}

module.exports = { setup };
