import { NextRequest, NextResponse } from "next/server";
import { queryOne, initDb } from "@/lib/db";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    console.log("LOGIN: USE_PG =", !!process.env.SUPABASE_URL);
    console.log("LOGIN: SUPABASE_URL =", process.env.SUPABASE_URL ? "set" : "not set");
    console.log("LOGIN: SUPABASE_KEY =", process.env.SUPABASE_KEY ? "set" : "not set");

    await initDb();
    console.log("LOGIN: initDb OK");

    const { email, password } = await request.json();
    console.log("LOGIN: email=" + email);

    if (!email || !password) {
      console.log("LOGIN: missing credentials");
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const user = await queryOne<{ id: number; email: string; password_hash: string; name: string }>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    console.log("LOGIN: user found =", !!user);

    if (!user) {
      console.log("LOGIN: user not found");
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    console.log("LOGIN: hash length =", user.password_hash?.length);
    const isValid = await verifyPassword(password, user.password_hash);
    console.log("LOGIN: password valid =", isValid);

    if (!isValid) {
      console.log("LOGIN: password mismatch");
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = await createToken({ id: user.id, email: user.email });
    console.log("LOGIN: token created, len=" + token.length);

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60,
      path: "/",
    });

    console.log("LOGIN: success");
    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
