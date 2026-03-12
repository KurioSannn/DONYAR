import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id },
  })

  if (!campaign) {
    return NextResponse.json({ error: "Campaign tidak ditemukan" }, { status: 404 })
  }

  return NextResponse.json(campaign)
}