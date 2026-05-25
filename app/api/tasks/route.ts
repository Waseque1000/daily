import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mapTask } from "@/lib/supabase/mappers";
import type { DbTask } from "@/types/database";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data as DbTask[]).map(mapTask));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: body.title,
      priority: body.priority ?? "medium",
      due_time: body.dueTime ?? null,
      duration: body.duration ?? null,
      tags: body.tags ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapTask(data as DbTask), { status: 201 });
}
