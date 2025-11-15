import { NextResponse } from "next/server"
import { updateUserCredits } from "@/services/supabase/SupabaseService"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const ADMIN_EMAILS = ['admin@exemplo.com', 'kontempler@gmail.com'];

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ADMIN_EMAILS.includes(session.user.email!)) {
      return NextResponse.json(
        {
          error: "Permissão negada: Apenas administradores podem atualizar créditos",
        },
        { status: 403 },
      )
    }

    const { email, credits } = await request.json()

    if (!email || credits === undefined) {
      return NextResponse.json(
        {
          error: "Dados incompletos. email e credits são obrigatórios",
        },
        { status: 400 },
      )
    }

    await updateUserCredits(email, credits)

    return NextResponse.json({
      success: true,
      message: "Créditos do usuário atualizados com sucesso",
      email,
      credits,
    })
  } catch (error) {
    console.error("Erro ao atualizar créditos do usuário:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Falha ao atualizar créditos do usuário",
      },
      { status: 500 },
    )
  }
}