import { VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/src/lib/auth"; 
import { prisma } from "@/src/lib/prisma"; 

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// --- 1. PROTOCOLO DE AGENDA ---
const SCHEDULE_PROTOCOL = `
[SYSTEM CAPABILITY: CLASS SCHEDULE MANAGEMENT]
You have read/write access to the user's Weekly Schedule.
1. If the user asks to ADD, REMOVE, MOVE, or CHANGE a class/event:
   - You must return ONLY a raw JSON array representing the new state of the schedule.
   - Do NOT wrap the JSON in markdown code blocks (no \`\`\`json). Just the raw array string.
   - Maintain the structure: { id, name, teacher, room, days: [1-5], hour: [8-16], color }.
   - Days mapping: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri.
   - Colors available: "from-cyan-400 to-blue-500", "from-purple-500 to-pink-500", "from-orange-400 to-red-500", "from-emerald-400 to-green-500".
2. If the user asks questions about the schedule without changing it, answer normally in text.
`;

// --- 2. LISTA DE ELENCO (Seus Agentes) ---
const AGENT_PERSONAS: Record<string, string> = {
    // LOUNGE / PERSONAL (Aura)
    aura: `
        You are "Aura", the Personal Concierge and Lounge Manager.
        Role: Help the user organize their life, manage the schedule, and reduce anxiety.
        Tone: Professional, warm, Apple-style aesthetic.
        Focus: You are the primary interface for the "Annual Flow" and "Weekly Agenda".
    `,

    // TECH TEAM (Ethernaut, Butter, Viper)
    ethernaut: `
        You are "Ethernaut", a Senior Full Stack Architect.
        Role: You oversee the entire tech stack. You are pragmatic and deep.
        Partners: "Butter" (Backend Expert) and "Viper" (Frontend/UI Expert).
        Directives: If the user asks about deep backend, quote Butter. If UI, quote Viper.
        Stack: Next.js, Rust, Solidity, AI Agents.
    `,
    
    // INNOVATION (Zenith)
    zenith: `
        You are "Zenith", the Innovation Strategist.
        Role: Guide the user on AI productivity, Flow State, and Disruptive Tech.
        Focus: New Era of AI, "Working Smarter", and futuristic trends.
    `,

    // BIOLOGY (Helix)
    helix: `
        You are "Helix", a Specialist in Biology and Medicine.
        Role: Advanced bio-research assistant.
        Focus: Anatomy, Neuroscience, CRISPR, Pharmacology.
        Tone: Academic, precise, clinical but clear.
    `,

    // MATH & PHYSICS (Vector)
    vector: `
        You are "Vector", a Computational Engine for Math & Physics.
        Role: Solve complex problems and explain theories.
        Focus: Calculus, Quantum Mechanics, Relativity, Linear Algebra.
        Tone: Logical, step-by-step, precise.
    `,

    // --- [NOVO] EXAM GENERATOR ---
    exam_generator: `
        ROLE: You are a strict JSON Generator for Academic Assessments.
        TASK: Read the provided [CURRENT LIVE SCHEDULE DATA], extract the subjects/topics, and generate exam questions based on them.
        
        CRITICAL RULES:
        1. Output MUST be a valid JSON Array.
        2. NO conversational text (No "Here is your exam", no "Good luck").
        3. NO markdown formatting (No \`\`\`json blocks).
        4. Structure: [{ "id": number, "type": "choice"|"input", "question": string, "options": string[], "correctAnswer": string, "difficulty": "easy"|"medium"|"hard" }]
        5. If the schedule is empty or topics are unclear, generate general logic/math questions.
    `
};

export async function POST(req: Request) {
    console.log("🚀 [API START] Iniciando Chat com Vertex AI...");

    try {
        const { prompt, agent, fileData, systemContext } = await req.json();

        // --- 0. RECALL MECHANISM (Busca Projeto Ativo no Mongo) ---
        let dbContext = "";
        try {
            const session = await getServerSession(authOptions);
            const user = session?.user as any; 

            if (user?.id) {
                // FIX: Usamos 'as any' aqui para evitar o erro de tipagem caso o Prisma Client 
                // ainda não tenha sido gerado com o novo campo 'activeProject'.
                const userData = await prisma.userSpaceData.findUnique({
                    where: { userId: user.id }
                }) as any;

                if (userData && userData.activeProject) {
                    dbContext = `
                    \n\n--- 🚀 ACTIVE PROJECT CONTEXT (FROM DATABASE) ---
                    The user has initiated a research project. 
                    You must act as a guide/research assistant for this specific topic:
                    ${JSON.stringify(userData.activeProject, null, 2)}
                    -----------------------------------
                    `;
                    console.log("✅ Project Context Injected from DB");
                }
            }
        } catch (dbError) {
            console.warn("⚠️ DB Context Recall falhou (continuando sem contexto):", dbError);
        }

        // --- AUTENTICAÇÃO GOOGLE (Mantida Intacta) ---
        let credentials;
        try {
            const keyFilePath = path.join(process.cwd(), 'service-account.json');
            
            if (fs.existsSync(keyFilePath)) {
                console.log("📂 Lendo credenciais de: service-account.json");
                const rawData = fs.readFileSync(keyFilePath, 'utf-8');
                credentials = JSON.parse(rawData);
            } else {
                console.log("⚠️ Arquivo não encontrado, tentando .env...");
                if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY_BASE64) {
                     throw new Error("Nenhuma credencial encontrada.");
                }
                credentials = {
                    client_email: process.env.GOOGLE_CLIENT_EMAIL,
                    private_key: Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8')
                };
            }
        } catch (fileError: any) {
            console.error("❌ Erro de Auth:", fileError.message);
            throw new Error("Falha na autenticação.");
        }

        // --- CONEXÃO VERTEX AI ---
        const vertex_ai = new VertexAI({
            project: "bright-task-474414-h3",
            location: "us-central1",
            googleAuthOptions: {
                credentials: {
                    client_email: credentials.client_email,
                    private_key: credentials.private_key,
                }
            }
        });

        console.log(`🤖 Vertex AI Conectado. Agente solicitado: ${agent}`);
        
        const model = vertex_ai.getGenerativeModel({ model: "gemini-2.0-flash-001" });

        // --- CONSTRUÇÃO DO "CÉREBRO" ---
        const selectedPersona = AGENT_PERSONAS[agent?.toLowerCase()] || AGENT_PERSONAS.aura;

        let finalSystemInstruction;

        if (agent === 'exam_generator') {
             finalSystemInstruction = `
                ${selectedPersona}
            `;
        } else {
            // Para todos os outros, injetamos:
            // 1. Protocolo de Agenda
            // 2. Personalidade
            // 3. Contexto do Projeto (Do Banco de Dados)
            finalSystemInstruction = `
                ${SCHEDULE_PROTOCOL}
                --- IDENTITY PROTOCOL ---
                ${selectedPersona}
                ${dbContext} 
            `;
        }

        // Contexto local (do frontend)
        if (systemContext) {
            finalSystemInstruction += `\n\n[CURRENT LIVE SCHEDULE DATA]:\n${systemContext}`;
        }

        const parts: any[] = [];
        
        parts.push({ text: `SYSTEM INSTRUCTIONS:\n${finalSystemInstruction}` });

        if (fileData) {
            console.log("📎 Anexando PDF...");
            parts.push({
                inlineData: {
                    data: fileData,
                    mimeType: "application/pdf"
                }
            });
        }

        parts.push({ text: `USER QUERY: ${prompt}` });

        // --- GERAÇÃO ---
        console.log("⚡ Gerando resposta...");
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: parts }],
        });

        const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) throw new Error("A IA devolveu uma resposta vazia.");

        console.log("✅ Resposta Gerada com Sucesso!");
        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("🔥 ERRO FATAL:", error);
        return NextResponse.json({ 
            error: "Erro no processamento", 
            details: error.message,
            code: error.code 
        }, { status: 500 });
    }
}