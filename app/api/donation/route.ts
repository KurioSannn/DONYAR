import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET - ambil semua donasi
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const donations = await prisma.donation.findMany({
    where: userId ? { userId } : {},
    include: {
      campaign: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(donations);
}

// POST - buat donasi baru
export async function POST(req: NextRequest) {
  const { amount, userId, campaignId } = await req.json();

  // Buat donasi
  const donation = await prisma.donation.create({
    data: {
      amount,
      userId,
      campaignId,
      status: "pending",
    },
  });

  // Update collectedAmount campaign
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      collectedAmount: {
        increment: amount,
      },
    },
  });

  return NextResponse.json(donation);
}
