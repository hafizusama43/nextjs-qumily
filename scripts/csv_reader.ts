const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const str = '';

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
        fs.createReadStream('./data_new.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log('\x1b[34mtotal rows : ' + results.length + '\x1b[0m');
                results.forEach((element, index) => {


                    if (index === 0) {
                        const obj = Object.values(element)
                        obj.forEach((ele) => {
                            // Last index
                            if (index === obj.length - 1) {

                            }
                        })
                    }
                });
            });
    }
});

console.log('\x1b[34mProcess complete.' + '\x1b[0m');

