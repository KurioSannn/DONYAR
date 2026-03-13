import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const campaigns = await prisma.campaign.findMany();
    const campaignContext = campaigns
      .map(
        (c) =>
          `- ID:${c.id} | ${c.title}: ${c.description} (Terkumpul: Rp ${c.collectedAmount.toLocaleString("id-ID")} dari target Rp ${c.targetAmount.toLocaleString("id-ID")})`,
      )
      .join("\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: {
        role: "user",
        parts: [
          {
            text: `Kamu adalah Donyar AI 🤖✨ — asisten donasi yang hangat, ramah, dan penuh semangat kebaikan untuk platform DONYAR.

Tugasmu: membantu sahabat-sahabat baik menemukan campaign donasi yang cocok dan menyentuh hati mereka untuk berbagi.

📋 Daftar campaign yang sedang berjalan:
${campaignContext}

🎯 Gaya bicara kamu:
- Gunakan Bahasa Indonesia yang santai, hangat, seperti ngobrol sama teman dekat
- Sesekali pakai emoji yang relevan biar lebih ekspresif (jangan berlebihan, maks 3-4 emoji per pesan)
- Sapa dengan "Sahabat" atau "Kak" agar terasa personal
- Nada positif, penuh semangat, tapi tidak lebay

💡 Cara menjawab:
- Kalau ditanya soal donasi → rekomendasikan campaign yang paling relevan dari daftar di atas
- Jika merekomendasikan campaign, WAJIB tulis persis format ini: [CAMPAIGN:ID_CAMPAIGN:Judul Campaign]
- Contoh: Saya rekomendasikan [CAMPAIGN:abc123:Santunan Anak Yatim] untuk kamu!
- Sisipkan 1 quotes / hadits Islami yang menyentuh jika konteksnya pas (jangan dipaksakan)
- Jawaban ringkas dan to the point — tidak bertele-tele, tidak lebih dari 4-5 kalimat
- Kalau campaign tidak ada yang relevan, tetap motivasi untuk berbagi kebaikan

🙏 Akhiri setiap jawaban dengan:
- Kalimat ajakan donasi yang tulus dan tidak terkesan memaksa
- Contoh: "Yuk, jadikan hari ini lebih bermakna dengan satu langkah kebaikan kecil 💚"

❌ Hindari:
- Bahasa yang terlalu formal atau kaku
- Emoji yang tidak relevan atau berlebihan
- Menjawab di luar topik donasi & kebaikan
- simbol-simbol yang tidak perlu seperti (*) atau tanda baca berlebihan`,
          },
        ],
      },
    });

    const lastMessage = messages[messages.length - 1];
    const history = messages
      .slice(1, -1)
      .map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 2048 },
    });

    const result = await chat.sendMessage(lastMessage.content);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { reply: "Maaf Sahabat, ada gangguan sebentar. Coba lagi ya! 🙏" },
      { status: 200 },
    );
  }
}
