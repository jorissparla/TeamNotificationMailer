const sql = require('mssql');
const myQuery = `select acc_navid+'.'+acc_lastname name, pic_base64 image from v_accounts A JOIN t_accounts_picture P on acc_UIC=accountId where acc_firstname='Sue'`;

const { USER, PASSWORD, SERVER, DB } = process.env;

const config = {
  user: USER,
  password: PASSWORD,
  server: SERVER,
  database: DB,
  options: {
    encrypt: false
  }
};

const startgetdata = async ({ team, region, shift, date }) => {
  let shift0 = shift;
  let shift2 = shift;

  if (shift === 'Q1') {
    if (team === 'TLS') {
      shift0 = 'Q2';
    }
  }
  if (shift === 'Q1' || shift === 'Q2') {
    shift2 = 'Q';
  }

  const QUERY_STRING = `
  SELECT DISTINCT
    acc_fullname name,
    acc_email email,
    cpl_code,
    cpl_date,
    cpl_desc
  FROM t_cappln CAP(NOLOCK)
       JOIN v_accounts ACC(NOLOCK) ON CAP.cpl_navid = ACC.acc_navid
  WHERE CONVERT(VARCHAR(12), cpl_date, 104) = CONVERT(VARCHAR(12), GETDATE(), 104)
        AND (cpl_code ='${shift}'
             OR cpl_code = '${shift0}'
             OR cpl_code = '${shift2}')
        AND acc_team = '${team}' AND cpl_code <>'' AND acc_region = '${region}'
  
  
  `;

  const pool = await sql.connect(config);
  //console.log({ pool });
  try {
    const result = await sql.query(QUERY_STRING);
    //console.log(result);
    const { recordset } = result;
    const data = await recordset.map(({ name, email }) => ({ name, email }));
    sql.close();
    return data;
  } catch (e) {
    console.log(e);
  }
  sql.close();
};

exports.startgetdata = startgetdata;
