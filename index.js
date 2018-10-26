const dotenv = require('dotenv');
const mailer = require('./mailer');
const { format } = require('date-fns');
const pug = require('pug');
const { startgetdata } = require('./getdata');

const [program, source, team = 'TLS', shift = 'Q1', region = 'EMEA'] = process.argv;
const nicedate = format(Date.now(), 'dddd, DD-MMM-YYYY');
const getCC = ({ team, region }) => {
  if (team === 'LOG') return 'joris.sparla@infor.com; Ron.Bleser@infor.com';
  if (team === 'BI-dEPM')
    return 'Geert.DeCeuster@infor.com; patrick.blume@infor.com;johan.demuynck@infor.com; joris.sparla@infor.com';
  return 'piet.schipper@infor.com; joris.sparla@infor.com';
};
console.log(nicedate);
const start = async () => {
  const data = await startgetdata({ team, region, shift });

  const recipients = data.map(item => item.email).join(';');
  console.log(recipients);
  const content = await pug.renderFile('mail.pug', {
    team,
    shift,
    region,
    data,
    nicedate
  });

  await mailer({
    to: recipients,
    subject: `${team}    Team schedule reminder for ${nicedate} (${shift})`,
    cc: getCC({ team, region }),
    content
  });
};

start();
