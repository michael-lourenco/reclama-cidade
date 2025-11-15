import { NextResponse } from "next/server";
import { addMarker, getMarkers, ProblemStatus, addStatusChange } from "@/services/supabase/SupabaseService";
import type { Marker } from "@/components/marker/types/marker";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const markers = await getMarkers();
    return NextResponse.json(markers);
  } catch (error) {
    console.error("Erro ao obter marcadores:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao obter marcadores" 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const markerData = await request.json() as Marker;
    
    if (!markerData.id || !markerData.lat || !markerData.lng || !markerData.type) {
      return NextResponse.json({ 
        error: 'Dados incompletos. id, lat, lng e type são obrigatórios' 
      }, { status: 400 });
    }
    
    markerData.userEmail = session.user.email!;
    
    markerData.createdAt = new Date();
    
    markerData.likedBy = [];
    markerData.resolvedBy = [];
    
    markerData.currentStatus = ProblemStatus.REPORTED;
    
    await addMarker(markerData);
    
    await addStatusChange(
      markerData.id,
      ProblemStatus.REPORTED,
      "Problema reportado inicialmente",
      session.user.email!
    );
    
    return NextResponse.json({
      success: true,
      message: 'Marcador adicionado com sucesso',
      marker: markerData
    });
  } catch (error) {
    console.error("Erro ao adicionar marcador:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao adicionar marcador" 
    }, { status: 500 });
  }
}