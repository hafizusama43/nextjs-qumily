import DbConnect from "@/config/db";
import { sql } from "@vercel/postgres";


const queryDatabase = async (query: string, params: any[], keepAlive = false) => {
    let result;

    try {
        console.log('\x1b[33m%s\x1b[0m', query);

        if (process.env.NEXT_ENV === 'development') {
            // Using local db for dev env and vercel posgres for prod
            const client = await DbConnect();
            result = await client.query(query, params);
        }
        else {
            result = await sql.query(query, params);
        }

        return result;

    } catch (err) {
        // console.error('Error executing query:', err);
        throw err;
    }


};

export default queryDatabase;