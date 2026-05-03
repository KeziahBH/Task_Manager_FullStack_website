const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_MH7XL9ACfxvc@ep-fancy-lake-ao1jk27x-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});
client.connect().then(() => {
  console.log("Connected Successfully!");
  client.end();
}).catch(e => console.error("Connection Failed:", e.message));
