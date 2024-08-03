import DbConnect from "@/config/db";
import { sql } from "@vercel/postgres";


const queryDatabase = async (query: string, params: any[], keepAlive = false) => {
    let result;

    try {
        const debugQuery = params.reduce((acc, param, index) => {
            return acc.replace(`$${index + 1}`, `'${param}'`);
        }, query);

        console.log('\x1b[33m%s\x1b[0m', debugQuery);

        if (process.env.NEXT_ENV === 'development') {
            // TODO : Implement pooling for local postgres
            // Using local db for dev env and vercel postgres for prod
            const client = await DbConnect();
            result = await client.query(query, params);
            if (!keepAlive) {
                await client.end();
            }
        }
        else {
            // 'sql' already uses vercel pool no need to production environment
            result = await sql.query(query, params);
        }
        return result;

    } catch (err) {
        // console.error('Error executing query:', err);
        throw err;
    }
};

export default queryDatabase;