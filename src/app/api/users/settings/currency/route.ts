
import { NextResponse } from "next/server";
import { updateUserCurrency } from "@/services/supabase/SupabaseService";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currency } = await request.json();
    
    if (!currency || !currency.value) {
      return NextResponse.json({ 
        error: 'Dados incompletos. Objeto currency com propriedade value é obrigatório' 
      }, { status: 400 });
    }
    
    await updateUserCurrency(session.user.email!, currency.value);
    
    return NextResponse.json({
      success: true,
      message: 'Moeda do usuário atualizada com sucesso',
      currency
    });
  } catch (error) {
    console.error("Erro ao atualizar moeda do usuário:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao atualizar moeda do usuário" 
    }, { status: 500 });
  }
}
