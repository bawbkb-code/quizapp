// db.js
const { Pool } = require('pg');

//เป็น Database ที่ผมทำขึ้นมาเพื่อ test
const pool = new Pool({
  user: 'xxxx',
  host: 'xxxx',
  database: 'xxxx',
  password: 'xxxx',
  port: 5432,
});

module.exports = pool;
