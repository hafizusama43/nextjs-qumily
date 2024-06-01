import { NextResponse } from "next/server";

// Get all templates
export async function GET() {
    // const data = await res.json()
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 400 })
}

// Get all templates
export async function POST(request) {
    // const data = await res.json()
    return NextResponse.json({ success: true, message: 'Template created successfully.' }, { status: 200 })
}