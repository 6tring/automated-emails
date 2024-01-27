if(process.env.NODE_ENV === "development") {
  require('dotenv').config();
};

const Agenda = require("agenda");
const mongoose = require("mongoose");

const url = process.env.DATABASEURL || "<local database URL>";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => {
	const agenda = new Agenda({ mongo: mongoose.connection });
	const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(",") : [];
  console.log("Job types: " + jobTypes)
	jobTypes.forEach(type => {
	  require("./jobs/" + type)(agenda);
	});
	if (jobTypes.length) {
		agenda.start().then(() => {
			agenda.every("0 9 * * *", "sendEmails").then(() => {
				console.log("sendEmails running");
			})
			.catch(err => {
				console.log("Agenda sendEmails Error:", err.message);
			});
		}).catch(err => {
			console.log("Agenda Start Error:", err.message);
		})
	}
	module.exports = agenda;
})
.catch(err => {
	console.log("DB Error", err);
})
