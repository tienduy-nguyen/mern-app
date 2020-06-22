const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const db = process.env.MONGO_URI;

mongoose
  .connect(db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB has been connected.');
  });

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB has been connected');
  } catch (err) {
    console.log(err.message);

    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
