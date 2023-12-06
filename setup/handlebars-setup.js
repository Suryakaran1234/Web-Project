const handlebars = require("express-handlebars");

function setup(app) {
  app.engine(
    ".hbs",
    handlebars.engine({ defaultLayout: "main", extname: ".hbs" })
  );
  app.set("view engine", "hbs");
}

module.exports = { setup };
