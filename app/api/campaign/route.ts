import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const campaigns = await prisma.campaign.findMany()

  return NextResponse.json(campaigns)
}