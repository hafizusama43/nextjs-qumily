const fs = require('fs');
const csv = require('csv-parser');
const { db } = require('@vercel/postgres');
// import { sql } from '@vercel/postgres';

const results = [];
var insert_str = '';

const file_name = './data_new.csv';
console.log('\x1b[32mExecuting csv reader.\x1b[0m'); // \x1b[32m sets color to green, \x1b[0m resets color
console.log("");
console.log('\x1b[34mFile name to read : ' + file_name + '\x1b[0m');
console.log('\x1b[34mChecking if file exists : ' + file_name + '\x1b[0m');
fs.access('./data_new.csv', fs.constants.F_OK, (err) => {
    if (err) {
        console.error('File does not exist');
        return;
    } else {
        console.log('\x1b[34mFile exists ' + '\x1b[0m');
        console.log('\x1b[34mReading file now.' + '\x1b[0m');

        getCols().then((res) => {
            // console.log(res)
            let value_str = '';
            insert_str = res;
            insert_str += ' VALUES ';
            fs.createReadStream('./data_new.csv')
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    console.log('\x1b[34mtotal rows : ' + results.length + '\x1b[0m');
                    results.forEach((element, index) => {
                            value_str = '(0,'
                            const obj = Object.values(element)
                            obj.forEach((ele,ele_inde) => {
                                // Last index
                                value_str += ele ? "'" + ele + "'" : null;
                                if (ele_inde !== obj.length - 1) {
                                    value_str += ', '
                                }
                            })

                            value_str += ')'
                            if (index !== results.length - 1) {
                                value_str += ', '
                            }
                            insert_str += value_str;
                    });
                    insertrecord(insert_str);

                });
        })
    }
});

async function getCols() {
    let query_str = 'INSERT INTO campaign_templates_data (';
    const client = await db.connect();
    const cols = await client.sql`SELECT *
    FROM information_schema.columns
    WHERE table_name = 'campaign_templates_data'
    ;`;

    cols.rows.forEach((element, index) => {
        if (element.column_name !== 'campaign_templates_data_id') {
            query_str += element.column_name;
            if (index !== cols.rows.length - 1) {
                query_str += ', ';
            }
        }
    });

    query_str += ')';


    await client.end();

    return query_str;
}
async function insertrecord(query_str) {
    const client = await db.connect();
    try {
        const cols = await client.query(query_str,[]);
    } catch (error) {
        console.log(error)
    }
    await client.end();
}




console.log('\x1b[34mProcess complete.' + '\x1b[0m');

