const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://m001-student:m001-mongodb-basics@taskapp.cz2wz.mongodb.net/FarmersDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);
