import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { API_BASE_URL } from "@/lib/constants";

const INTERNAL_API_SECRET =
  process.env.INTERNAL_API_SECRET ||
  process.env.CONSULTATION_PROXY_SECRET ||
  "dev-consultation-secret";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Debes iniciar sesion con Google para ver tus articulos." },
      { status: 401 }
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/guest-post-submissions/?email=${encodeURIComponent(
      session.user.email
    )}`,
    {
      method: "GET",
      headers: {
        "X-Internal-Api-Secret": INTERNAL_API_SECRET,
      },
      cache: "no-store",
    }
  );

  const payload = await response.json().catch(() => []);
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email || !session.user.name) {
    return NextResponse.json(
      { error: "Debes iniciar sesion con Google para enviar un articulo." },
      { status: 401 }
    );
  }

  const incomingForm = await request.formData();
  const backendForm = new FormData();

  backendForm.append("full_name", session.user.name);
  backendForm.append("email", session.user.email);
  backendForm.append("author_image", session.user.image ?? "");
  backendForm.append("title", String(incomingForm.get("title") ?? ""));
  backendForm.append("summary", String(incomingForm.get("summary") ?? ""));
  backendForm.append("content", String(incomingForm.get("content") ?? ""));
  backendForm.append(
    "suggested_tags",
    String(incomingForm.get("suggested_tags") ?? "")
  );
  backendForm.append(
    "publish_anonymously",
    String(incomingForm.get("publish_anonymously") === "true")
  );
  backendForm.append(
    "author_confirmed",
    String(incomingForm.get("author_confirmed") === "true")
  );

  for (const attachment of incomingForm.getAll("attachments")) {
    if (attachment instanceof File && attachment.size > 0) {
      backendForm.append("attachments", attachment, attachment.name);
    }
  }

  const response = await fetch(`${API_BASE_URL}/api/guest-post-submissions/`, {
    method: "POST",
    headers: {
      "X-Internal-Api-Secret": INTERNAL_API_SECRET,
    },
    body: backendForm,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  return NextResponse.json(payload, { status: response.status });
}
