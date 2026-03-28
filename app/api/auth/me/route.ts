import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, AUTH_COOKIE_NAME } from "@/shared/lib/auth";
import { db } from "@/shared/lib/db";

export const dynamic = "force-dynamic";

interface UserRow {
  id: number;
  name: string;
  email: string;
  birth_date: string;
  created_at: string;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Недействительный токен" },
        { status: 401 }
      );
    }

    const user = db
      .prepare("SELECT id, name, email, birth_date, created_at FROM users WHERE id = ?")
      .get(payload.userId) as UserRow | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birth_date,
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error("Auth check error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
