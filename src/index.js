/* Requiring App of express */
const app = require("./app");

/* Requiring Database */
require("../db/mongoose");

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server is up ");
});
