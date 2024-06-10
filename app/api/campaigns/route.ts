import queryDatabase from "@/lib/queryHelper";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get all templates
export async function GET() {
  const ITEMS_PER_PAGE = 20;
  try {
    let campaigns;

    campaigns = await queryDatabase(`SELECT
      campaigns.*
      FROM campaigns
      ORDER BY campaigns.campaign_id DESC
      LIMIT ${ITEMS_PER_PAGE}`, [])

    const createdByArray = campaigns.rows.map(item => item.created_by);

    // Get all users from clerk
    const { data } = await clerkClient.users.getUserList({ userId: createdByArray });
    const userMap = data.reduce((acc, user) => {
      acc[user.id] = user.fullName;
      return acc;
    }, {});
    const templatesData = campaigns.rows.map(item => {
      return { ...item, username: userMap[item.created_by] };
    });

    return NextResponse.json({ success: true, message: 'Campaigns fetched successfully.', data: templatesData }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: 'Database Error: Failed to fetch campaigns', error }, { status: 500 })
  }

}
