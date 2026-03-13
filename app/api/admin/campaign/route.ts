import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - ambil semua campaign
export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    include: { donations: true },
    orderBy: { title: "asc" },
  });
  return NextResponse.json(campaigns);
}

// POST - tambah campaign baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, targetAmount } = await req.json();
  if (!title || !description || !targetAmount) {
    return NextResponse.json(
      { error: "Semua field harus diisi" },
      { status: 400 },
    );
  }

  const campaign = await prisma.campaign.create({
    data: { title, description, targetAmount: Number(targetAmount) },
  });

  return NextResponse.json(campaign);
}

// DELETE - hapus campaign
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await prisma.campaign.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
