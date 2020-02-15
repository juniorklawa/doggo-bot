var cron = require('node-schedule');

var j = cron.scheduleJob('*/5 * * * *', function (fireDate) {
  console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
});
j