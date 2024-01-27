if(process.env.NODE_ENV === "development") {
  require('dotenv').config();
};

const moment = require("moment");
const UserJob = require("../models/userJob");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = function(agenda) {
	agenda.define('sendEmails', async function(job) {
		try {
			let today = moment(new Date).format("MM/DD/YYYY");
      			let userJobs = await UserJob.find().where("jobDate").equals(today);
			for(let userJob of userJobs) {
       				// Specify job logic here
			}
		} catch(err) {
			console.log("Error encountered during sendEmails: ", err.message);
		}
	});
};
