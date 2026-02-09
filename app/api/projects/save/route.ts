import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/src/lib/auth"; 
import { prisma } from "@/src/lib/prisma"; 

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        // CORREÇÃO 1: Fallback de Segurança
        // Se não houver sessão (usuário não logado), permitimos um ID vindo do corpo da requisição (para testes/convidados)
        const { project, userId: bodyUserId } = await req.json();
        
        let targetUserId = bodyUserId;

        // Se houver sessão, a prioridade é do usuário logado
        if (session?.user?.email) {
            // CORREÇÃO 2: Busca pelo EMAIL
            // Como session.user.id pode não existir, buscamos o ID real no banco usando o email
            const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true }
            });

            if (dbUser) {
                targetUserId = dbUser.id;
            }
        }

        // Se após tudo isso não tivermos um ID, bloqueamos
        if (!targetUserId) {
            return NextResponse.json({ error: "Unauthorized: No User ID found via Session or Body." }, { status: 401 });
        }

        console.log("💾 Saving Project for User ID:", targetUserId);

        // CORREÇÃO 3: Cast 'as any' mantido
        // Isso é necessário até que você rode 'npx prisma generate' no terminal para atualizar os tipos
        await prisma.userSpaceData.upsert({
            where: { userId: targetUserId }, 
            update: { 
                activeProject: project 
            } as any, 
            create: { 
                userId: targetUserId, 
                activeProject: project 
            } as any 
        });

        return NextResponse.json({ success: true, savedFor: targetUserId });

    } catch (error: any) {
        console.error("Project Save Error:", error);
        // Retorna o erro detalhado para facilitar o debug no console do navegador
        return NextResponse.json({ error: "Failed to save project", details: error.message }, { status: 500 });
    }
}