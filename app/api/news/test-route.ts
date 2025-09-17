import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: "Simulated error" }, { status: 500 });
}
