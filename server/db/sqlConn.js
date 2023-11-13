import pkg from 'pg';

//Connect to pgSQL
const { Pool } = pkg;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projectEX',
    password: 'stinky50',
    port: 5432,
});
export default pool;