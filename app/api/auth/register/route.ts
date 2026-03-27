import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/shared/lib/db";
import { createToken, AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/shared/lib/auth";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody;
    const { name, email, password, birthDate } = body;

    if (!name || !email || !password || !birthDate) {
      return NextResponse.json(
        { error: "Все поля обязательны для заполнения" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 6 символов" },
        { status: 400 }
      );
    }

    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime()) || birthDateObj > new Date()) {
      return NextResponse.json(
        { error: "Некорректная дата рождения" },
        { status: 400 }
      );
    }

    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email) as { id: number } | undefined;

    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = db
      .prepare(
        "INSERT INTO users (name, email, password_hash, birth_date) VALUES (?, ?, ?, ?)"
      )
      .run(name, email, passwordHash, birthDate);

    const userId = result.lastInsertRowid as number;
    const token = await createToken(userId);

    const response = NextResponse.json({
      id: userId,
      name,
      email,
      birthDate,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
