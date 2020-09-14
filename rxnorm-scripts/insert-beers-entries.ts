import * as mysql from 'mysql';
import { writeFileSync } from 'fs';

const conn = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'davicks',
  password: 'burrito7',
  database: 'geridb',
});
conn.connect(function (err) {
  if (err) console.log(err);
  let sql = `select * from all_guidance ag`;
  queryBeersEntries(sql);
});
function queryBeersEntries(sql) {
  conn.query(sql, (err, data) => {
    writeFileSync('./beers-entries.json', JSON.stringify(data));
  });
}
