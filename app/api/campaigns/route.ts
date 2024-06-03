import { SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers';
import { sql } from '@vercel/postgres';
import * as XLSX from 'xlsx';
const fs = require('fs');
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, res) {
    try {
        const slug = request.nextUrl.searchParams.get("slug");
        const body = await request.json();

        if (!slug) {
            return NextResponse.json({ success: false, message: 'Invalid request params' }, { status: 500 });
        }
        if (!body.data) {
            return NextResponse.json({ success: false, message: 'Invalid request data' }, { status: 500 });
        }

        var query = `SELECT
        campaign_templates.campaign_templates_id
        FROM campaign_templates
        WHERE campaign_templates.slug = '${slug}' ;`;

        const template = await sql.query(query, []);
        if (template.rows.length == 0) {
            return NextResponse.json({ success: false, message: 'Invalid template id' }, { status: 500 });
        }

        query = `SELECT
        campaign_templates_data.*
        FROM campaign_templates_data
        WHERE template_id = ${template.rows[0].campaign_templates_id}
        ORDER BY campaign_templates_data.campaign_templates_data_id ASC ;`;

        const template_data = await sql.query(query, []);


        const updatedTemplateData = [];

        body.data.forEach(dataObj => {
          template_data.rows.forEach(templateObj => {
            const replacedObj = { ...templateObj };
        
            delete replacedObj.campaign_templates_data_id;
            delete replacedObj.template_id;
        
            for (const key in replacedObj) {
              if (replacedObj[key] === '%campaign_id%') {
                replacedObj[key] = dataObj.campaign_id;
              }
            }
        
            updatedTemplateData.push(replacedObj);
          });
        });

        // const excelBuffer = generateExcel(updatedTemplateData);

        // const newHeaders = new Headers();
        // newHeaders.set('Content-Disposition', 'attachment; filename=campaigns.xlsx');
        // newHeaders.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Convert the buffer to ArrayBuffer
        // const excelArrayBuffer = excelBuffer.buffer.slice(excelBuffer.byteOffset, excelBuffer.byteOffset + excelBuffer.byteLength);

        // Create a new response with the Excel file and headers
        // const response = new Response(excelBuffer, {
        //     status: 200,
        //     headers: newHeaders,
        // });

        // Return the response
        return NextResponse.json({ success: true, message: 'Success', data: updatedTemplateData }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error:', error }, { status: 500 })
    }

}

// function generateExcel(data) {
//     // Create a new workbook
//     const wb = XLSX.utils.book_new();

//     // Define column headers based on SPONSORED_PRODUCTS_CAMPAIGNS
//     const headers = Object.values(SPONSORED_PRODUCTS_CAMPAIGNS);

//     // Create the worksheet data starting with headers
//     const wsData = [headers];

//     // Populate rows
//     data.forEach(item => {
//         const row = Object.keys(SPONSORED_PRODUCTS_CAMPAIGNS).map(key => item[key] || '');
//         wsData.push(row);
//     });

//     // Create a worksheet
//     const ws = XLSX.utils.aoa_to_sheet(wsData);

//     // Append worksheet to workbook
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

//     // Write the workbook to binary
//     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

//     // Convert binary string to array buffer
//     const buf = new ArrayBuffer(wbout.length);
//     const view = new Uint8Array(buf);
//     for (let i = 0; i < wbout.length; ++i) view[i] = wbout.charCodeAt(i) & 0xFF;

//     return buf;
//     fs.writeFileSync('example1.xlsx', wbout);
// };