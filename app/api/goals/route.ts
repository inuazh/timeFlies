import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, AUTH_COOKIE_NAME } from "@/shared/lib/auth";
import { db } from "@/shared/lib/db";

interface GoalRow {
  id: number;
  user_id: number;
  title: string;
  target_year: number;
  target_week: number;
  color_index: number;
  created_at: string;
}

interface CreateGoalBody {
  title: string;
  targetYear: number;
  targetWeek: number;
}

async function getAuthUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.userId ?? null;
}

export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const rows = db
      .prepare("SELECT * FROM goals WHERE user_id = ? ORDER BY created_at ASC")
      .all(userId) as GoalRow[];

    const goals = rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      title: r.title,
      targetYear: r.target_year,
      targetWeek: r.target_week,
      colorIndex: r.color_index,
      createdAt: r.created_at,
    }));

    return NextResponse.json(goals);
  } catch (err) {
    console.error("Get goals error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = (await request.json()) as CreateGoalBody;
    const { title, targetYear, targetWeek } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Название цели обязательно" },
        { status: 400 }
      );
    }

    if (targetYear < 0 || targetYear > 74 || targetWeek < 0 || targetWeek > 51) {
      return NextResponse.json(
        { error: "Некорректная неделя" },
        { status: 400 }
      );
    }

    const existingGoals = db
      .prepare("SELECT color_index FROM goals WHERE user_id = ?")
      .all(userId) as Array<{ color_index: number }>;

    const usedColors = new Set(existingGoals.map((g) => g.color_index));
    let colorIndex = 0;
    for (let i = 0; i < 8; i++) {
      if (!usedColors.has(i)) {
        colorIndex = i;
        break;
      }
      if (i === 7) colorIndex = existingGoals.length % 8;
    }

    const result = db
      .prepare(
        "INSERT INTO goals (user_id, title, target_year, target_week, color_index) VALUES (?, ?, ?, ?, ?)"
      )
      .run(userId, title.trim(), targetYear, targetWeek, colorIndex);

    const goalId = result.lastInsertRowid as number;

    return NextResponse.json({
      id: goalId,
      userId,
      title: title.trim(),
      targetYear,
      targetWeek,
      colorIndex,
    });
  } catch (err) {
    console.error("Create goal error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
