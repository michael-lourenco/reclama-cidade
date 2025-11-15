
import { NextResponse } from "next/server";
import { fetchUserData } from "@/services/supabase/SupabaseService";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await fetchUserData(session.user.email!);
    
    if (!userData) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao obter dados do usuário" 
    }, { status: 500 });
  }
}
