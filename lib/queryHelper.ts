import DbConnect from "@/config/db";


const queryDatabase = async (query: string, params: any[], keepAlive = false) => {
    const client = await DbConnect();
    let result;

    try {
        result = await client.query(query, params);
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    } finally {
        if (!keepAlive) {
            await client.end();
        }
    }

    return result;
};

export default queryDatabase;