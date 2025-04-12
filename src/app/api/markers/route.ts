// app/api/markers/route.ts

import { NextResponse } from "next/server";
import { dbFirestore, addMarker, getMarkers } from "@/services/firebase/FirebaseService";
import { verify } from "jsonwebtoken";
import type { Marker } from "@/components/marker/types/marker";
import { validateAuth, isAdmin } from "@/lib/auth/api-auth"


// GET - Obter todos os marcadores
export async function GET() {
  try {
    const markers = await getMarkers(dbFirestore);
    return NextResponse.json(markers);
  } catch (error) {
    console.error("Erro ao obter marcadores:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao obter marcadores" 
    }, { status: 500 });
  }
}

// POST - Adicionar um novo marcador
export async function POST(request: Request) {
  try {
    // Validar autenticação
    const auth = await validateAuth(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Obter dados do corpo da requisição
    const markerData = await request.json() as Marker;
    
    // Verificar se os dados necessários foram fornecidos
    if (!markerData.id || !markerData.lat || !markerData.lng || !markerData.type) {
      return NextResponse.json({ 
        error: 'Dados incompletos. id, lat, lng e type são obrigatórios' 
      }, { status: 400 });
    }
    
    // Definir o email do usuário a partir do token JWT
    markerData.userEmail = auth.user.email;
    
    // Definir a data de criação
    markerData.createdAt = new Date();
    
    // Adicionar marcador
    await addMarker(dbFirestore, markerData);
    
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