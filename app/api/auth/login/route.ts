import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/shared/lib/db";
import { createToken, AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/shared/lib/auth";

interface LoginBody {
  email: string;
  password: string;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  birth_date: string;
  created_at: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as UserRow | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const token = await createToken(user.id);

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birth_date,
      createdAt: user.created_at,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
