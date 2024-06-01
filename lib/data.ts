const ITEMS_PER_PAGE = 20;
import { sql } from '@vercel/postgres';

export async function fetchFilteredInvoices(
    query: string,
    currentPage: number,
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const invoices = await sql<any>`SELECT
        campaign_templates.*
        FROM campaign_templates
        ORDER BY invoices.date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`
        
        return invoices.rows;
    } catch (error) {

        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}