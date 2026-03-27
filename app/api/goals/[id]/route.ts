import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, AUTH_COOKIE_NAME } from "@/shared/lib/auth";
import { db } from "@/shared/lib/db";

interface GoalRow {
  id: number;
  user_id: number;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Недействительный токен" }, { status: 401 });
    }

    const { id } = await params;
    const goalId = parseInt(id, 10);
    if (isNaN(goalId)) {
      return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
    }

    const goal = db
      .prepare("SELECT id, user_id FROM goals WHERE id = ?")
      .get(goalId) as GoalRow | undefined;

    if (!goal) {
      return NextResponse.json({ error: "Цель не найдена" }, { status: 404 });
    }

    if (goal.user_id !== payload.userId) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    db.prepare("DELETE FROM goals WHERE id = ?").run(goalId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete goal error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
