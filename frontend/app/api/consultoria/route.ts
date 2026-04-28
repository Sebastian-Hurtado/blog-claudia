import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { API_BASE_URL } from "@/lib/constants";

const CONSULTATION_PROXY_SECRET =
  process.env.CONSULTATION_PROXY_SECRET ?? "dev-consultation-secret";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Debes iniciar sesion con Google para ver tus solicitudes." },
      { status: 401 }
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/consultation-requests/?email=${encodeURIComponent(session.user.email)}`,
    {
      method: "GET",
      headers: {
        "X-Consultation-Proxy-Secret": CONSULTATION_PROXY_SECRET,
      },
      cache: "no-store",
    }
  );

  const payload = await response.json().catch(() => ([]));
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email || !session.user.name) {
    return NextResponse.json(
      { error: "Debes iniciar sesion con Google para solicitar consultoria." },
      { status: 401 }
    );
  }

  const incomingForm = await request.formData();
  const backendForm = new FormData();

  backendForm.append("full_name", session.user.name);
  backendForm.append("email", session.user.email);
  backendForm.append("phone", String(incomingForm.get("phone") ?? ""));
  backendForm.append("subject", String(incomingForm.get("subject") ?? ""));
  backendForm.append("message", String(incomingForm.get("message") ?? ""));

  for (const attachment of incomingForm.getAll("attachments")) {
    if (attachment instanceof File && attachment.size > 0) {
      backendForm.append("attachments", attachment, attachment.name);
    }
  }

  const response = await fetch(`${API_BASE_URL}/api/consultation-requests/`, {
    method: "POST",
    headers: {
      "X-Consultation-Proxy-Secret": CONSULTATION_PROXY_SECRET,
    },
    body: backendForm,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  return NextResponse.json(payload, { status: response.status });
}
