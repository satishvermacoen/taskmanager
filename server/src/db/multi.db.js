// This is a test file for multi DB CONNECTION in application.

// import mongoose from 'mongoose';

// // Connection URI's from your environment variables
// const mainDbUri = process.env.MAIN_DB_URI; // e.g., mongodb://localhost/main_app_db
// const logsDbUri = process.env.LOGS_DB_URI; // e.g., mongodb://localhost/logging_db

// // Create the connections
// const mainConnection = mongoose.createConnection(mainDbUri);
// const logsConnection = mongoose.createConnection(logsDbUri);

// // --- Define and register models on their specific connections ---

// // A User model for the main database
// const userSchema = new mongoose.Schema({ name: String, email: String });
// const User = mainConnection.model('User', userSchema);

// // A Log model for the logging database
// const logSchema = new mongoose.Schema({ level: String, message: String, timestamp: Date });
// const Log = logsConnection.model('Log', logSchema);


// // --- Now you can use the models to interact with the correct database ---

// // Example: Creating a new user in the main database
// async function createUser(userData) {
//   const newUser = new User(userData);
//   await newUser.save();
//   console.log('User saved to main database!');
// }

// // Example: Creating a new log entry in the logging database
// async function createLog(logData) {
//   const newLog = new Log(logData);
//   await newLog.save();
//   console.log('Log entry saved to logging database!');
// }

// // Handle connection events for each database
// mainConnection.on('connected', () => {
//   console.log('Connected to the main database.');
// });

// logsConnection.on('connected', () => {
//   console.log('Connected to the logging database.');
// });