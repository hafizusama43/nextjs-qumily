import { NextResponse } from "next/server";

export async function GET() {
    // const data = await res.json()

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 400 })
}