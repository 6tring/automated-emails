# automated-emails

### Scheduling automated email jobs with AgendaJS

Based on my experiences as a musician and performer, I created Gigpromoter - a Node/Express application that helps new artists learn how to plan, manage, and promote live events. 

Because Gigpromoter is currently in production, the repo is private - but I have created this public repo to share selected files.

One of the features of Gigpromoter is a task-management calendar that begins 8 weeks before scheduled events and helps users manage administrative & promotional tasks for each event.

Users have the option of receiving weekly reminder emails that outline associated tasks.

This functionality is built using AgendaJS to execute jobs scheduled with CRON expressions.

A second `worker` Node server is required in addition to a primary `web` server process to run AgendaJS as a background process – which on the Heroku platform can be specified in `Procfile`.

Agenda syntax expects `agenda.js` to connect by requiring Agenda in `worker.js` as `require("./agenda.js");`

Once Agenda is running it will look for `jobTypes` specified in `process.env.JOB_TYPES` [i.e. `emails`] then require and invoke the `jobs` module – which is where any corresponding job functionality is established  – while passing in the `agenda` object.

`agenda.every()` then executes the designated job at intervals specified using CRON – which here is set to run `sendEmails` every day at 9 AM.

`sendEmails` queries documents stored in the associated database for any jobs that match the current date.

When any jobs matching the current date are located, whatever functionality is specified in the coresponding job file is executed; in `sendEmails`, reminder emails are created and sent using the Sendgrid API.

Lastly, for every job successfully executed, the corresponding `jobDate` is deleted from the database, and Agenda continues running in the background on the `worker` process until the next CRON job is executed.
