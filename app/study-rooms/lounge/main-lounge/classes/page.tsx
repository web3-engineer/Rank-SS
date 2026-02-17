"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, User, Activity, Clock, ChevronUp, ChevronDown, 
  Power, Send, Sparkles, X, AlertCircle, StickyNote,
  FileText, Plus, Database, Bot, File, Briefcase, Pen, Globe,
  Users, Layers, Share2, Copy, Link as LinkIcon, ArrowUpRight,
  Type, Image as ImageIcon, Bold, Italic, Hash, UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// --- INITIAL DATA ---
const initialSchedule = [
  { id: 1, name: "Systems Arch.", teacher: "Dr. Aris", room: "Lab 402", days: [1, 3], hour: 8, color: "from-cyan-400 to-blue-500" },
  { id: 2, name: "Neural Nets", teacher: "Prof. Sarah", room: "Hall B", days: [1, 3], hour: 10, color: "from-blue-500 to-indigo-600" },
  { id: 3, name: "AI Ethics", teacher: "Marcus V.", room: "101", days: [2, 4], hour: 13, color: "from-teal-400 to-emerald-500" },
  { id: 4, name: "React Flow", teacher: "Lucas N.", room: "Virtual", days: [2, 4], hour: 15, color: "from-violet-500 to-fuchsia-500" },
  { id: 5, name: "DB Design", teacher: "Elena R.", room: "Lab 105", days: [5], hour: 9, color: "from-orange-400 to-red-500" },
  { id: 6, name: "CyberSec", teacher: "Jack R.", room: "Sec Lab", days: [1, 5], hour: 14, color: "from-sky-400 to-cyan-500" },
  { id: 7, name: "UI Design", teacher: "Sofia B.", room: "Studio", days: [3], hour: 15, color: "from-pink-400 to-rose-500" },
];

// --- INTERFACES ---
interface StoredDoc { id: string; title: string; type: 'pdf' | 'doc'; size: string; }
interface UserItem { id: string; type: 'file' | 'link'; name: string; meta: string; }
interface UserModule { id: number; title: string; items: UserItem[]; }

// --- COMPONENT: COLLECTIVE BUILD NODE ---
const CollectiveZone = ({ classes, currentUser, dragConstraints }: { classes: any[], currentUser: any, dragConstraints: any }) => {
    const [activeClassId, setActiveClassId] = useState(classes[0]?.id || 1);
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [chatMsg, setChatMsg] = useState("");
    const [groupMessages, setGroupMessages] = useState<{user: string, text: string}[]>([
        { user: 'System', text: 'Secure channel established.' }
    ]);

    const activeClass = classes.find((c: any) => c.id === activeClassId);

    const generateCode = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const code = `ZAE-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.floor(Math.random() * 99)}`;
            setInviteCode(code);
            setIsGenerating(false);
            if (currentUser && members.length === 0) {
                setMembers([currentUser]); 
            }
        }, 1500);
    };

    const sendGroupMessage = () => {
        if (!chatMsg.trim()) return;
        setGroupMessages(prev => [...prev, { user: currentUser?.name || 'You', text: chatMsg }]);
        setChatMsg("");
    };

    return (
        <motion.div 
            drag
            dragConstraints={dragConstraints}
            whileHover={{ cursor: "grab" }}
            whileDrag={{ cursor: "grabbing", zIndex: 100 }}
            className="w-full mt-10 max-w-[1400px] relative z-30"
        >
            <div className="relative w-full bg-white/70 dark:bg-black/30 backdrop-blur-3xl border border-slate-300 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-300/50 dark:border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-500">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">Collective Build Node</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Real-time collaboration workspace</p>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-full pb-1">
                        {classes.map((cls: any) => (
                            <button
                                key={cls.id}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => { setActiveClassId(cls.id); setInviteCode(null); setMembers([]); }}
                                className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border
                                    ${activeClassId === cls.id 
                                        ? `bg-slate-800 text-white border-slate-900 dark:bg-white dark:text-black shadow-lg` 
                                        : 'bg-white/50 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10'
                                    }`}
                            >
                                {cls.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 h-[500px]">
                    <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2rem] p-1 relative overflow-hidden" onPointerDown={(e) => e.stopPropagation()}>
                        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-black/20">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{activeClass?.name} Channel</span>
                            </div>
                            <Users size={14} className="text-slate-400" />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {groupMessages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.user === (currentUser?.name || 'You') ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[8px] text-slate-400 mb-1 ml-1">{msg.user}</span>
                                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-[11px] font-medium leading-relaxed ${msg.user === (currentUser?.name || 'You') ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 rounded-tl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-black/20 border-t border-slate-200 dark:border-white/5">
                            <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-2 py-2">
                                <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendGroupMessage()} placeholder={`Message ${activeClass?.name} group...`} className="flex-1 bg-transparent px-4 text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none" />
                                <button onClick={sendGroupMessage} className="w-8 h-8 bg-slate-800 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"><ArrowUpRight size={14} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-80 flex flex-col gap-4">
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[2rem] p-6 text-center relative overflow-hidden group" onPointerDown={(e) => e.stopPropagation()}>
                            {!inviteCode ? (
                                <div className="flex flex-col items-center gap-3 relative z-10">
                                    <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-lg mb-1"><Share2 size={20} className="text-indigo-500" /></div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-white">Build Together</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight px-4">Create a secure link to invite peers to this module.</p>
                                    <button onClick={generateCode} disabled={isGenerating} className="mt-2 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-[10px] font-bold uppercase tracking-wider hover:scale-105 transition-transform w-full">{isGenerating ? "Generating..." : "Generate Invite Code"}</button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 relative z-10">
                                    <div className="w-full bg-white/50 dark:bg-black/30 border border-dashed border-indigo-400/50 rounded-xl p-4 flex flex-col items-center"><span className="text-[9px] font-bold text-indigo-500 uppercase mb-1">Access Code</span><span className="text-2xl font-black font-mono text-slate-800 dark:text-white tracking-widest select-all">{inviteCode}</span></div>
                                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />Session Active</div>
                                    <button onClick={() => { navigator.clipboard.writeText(`zaeon.io/join/${inviteCode}`); }} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"><Copy size={12} /> Copy Link</button>
                                </div>
                            )}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] group-hover:bg-indigo-500/30 transition-all duration-700" />
                        </div>
                        <div className="flex-1 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2rem] p-4 flex flex-col gap-3 relative overflow-y-auto custom-scrollbar" onPointerDown={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between pl-2"><span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Active Nodes</span><span className="text-[9px] font-mono text-slate-400">{members.length} Online</span></div>
                            <div className="grid grid-cols-2 gap-3 flex-1 content-start">
                                {members.length === 0 ? (
                                    <div className="col-span-2 flex flex-col items-center justify-center opacity-40 h-full min-h-[100px]"><Users size={24} className="text-slate-400 mb-2" /><span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Waiting for peers...</span></div>
                                ) : (
                                    members.map((member, i) => (
                                        <div key={i} className="aspect-square rounded-2xl border border-slate-300/50 dark:border-white/10 bg-white/30 dark:bg-black/20 flex flex-col items-center justify-center relative overflow-hidden group/slot shadow-sm">
                                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2 z-10 w-full">
                                                <div className="w-12 h-12 rounded-full border-2 border-indigo-500 p-0.5 bg-white/10 backdrop-blur-md shadow-lg"><div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">{member.image ? <Image src={member.image} alt="" fill className="object-cover" /> : <User size={20} className="text-white" />}</div></div>
                                                <div className="text-center w-full px-2"><span className="text-[9px] font-bold text-slate-800 dark:text-white truncate block">{member.name}</span><span className="text-[7px] font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded-full inline-block mt-0.5">CONNECTED</span></div>
                                            </motion.div>
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover/slot:opacity-100 transition-opacity pointer-events-none" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: COLLAB EDITOR ---
const CollabEditor = ({ dragConstraints }: { dragConstraints: any }) => {
    return (
        <div className="w-full max-w-[1400px] flex flex-col items-center mb-20 relative z-30">
            <div className="h-16 w-full flex justify-center relative">
                <svg width="20" height="100%" viewBox="0 0 20 64" className="overflow-visible">
                    <line x1="10" y1="0" x2="10" y2="64" stroke="#6366f1" strokeWidth="2" className="opacity-30" />
                    <motion.line x1="10" y1="0" x2="10" y2="64" stroke="#818cf8" strokeWidth="3" strokeDasharray="10 20" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: 100 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="opacity-80 drop-shadow-[0_0_8px_#6366f1]" />
                    <circle cx="10" cy="0" r="4" fill="#6366f1" className="animate-pulse" />
                    <circle cx="10" cy="64" r="4" fill="#6366f1" className="animate-pulse" />
                </svg>
            </div>
            <motion.div drag dragConstraints={dragConstraints} whileHover={{ cursor: "grab" }} whileDrag={{ cursor: "grabbing", zIndex: 100 }} className="relative w-full bg-white/70 dark:bg-black/30 backdrop-blur-3xl border border-slate-300 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-300/50 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-500"><Pen size={20} /></div>
                        <div><h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">Neural Editor</h3><p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Drafting research papers & blogs</p></div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-2 py-1">
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-600 dark:text-slate-300 transition-colors"><Type size={14} /></button>
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-600 dark:text-slate-300 transition-colors"><Bold size={14} /></button>
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-600 dark:text-slate-300 transition-colors"><Italic size={14} /></button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-white/20 mx-1"></div>
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-600 dark:text-slate-300 transition-colors"><ImageIcon size={14} /></button>
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-600 dark:text-slate-300 transition-colors"><LinkIcon size={14} /></button>
                    </div>
                </div>
                <div className="flex flex-col gap-4" onPointerDown={(e) => e.stopPropagation()}>
                    <input type="text" placeholder="Untitled Article..." className="text-3xl font-black bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/20"/>
                    <input type="text" placeholder="Add a subtitle or brief description..." className="text-sm font-medium bg-transparent border-none outline-none text-slate-500 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-white/10"/>
                    <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold"><Hash size={12} /><input type="text" placeholder="Add tags (e.g., #Zaeon #Research)" className="bg-transparent outline-none w-full text-indigo-500 placeholder:text-indigo-500/40" /></div>
                    <div className="w-full h-px bg-slate-200 dark:bg-white/5 my-2"></div>
                    <textarea className="w-full h-64 bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-white/10 custom-scrollbar" placeholder="Start typing your research content here..."/>
                    <div className="w-full h-24 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"><div className="p-2 bg-slate-100 dark:bg-white/5 rounded-full group-hover:scale-110 transition-transform"><UploadCloud size={18} /></div><span className="text-[10px] font-bold uppercase tracking-wider">Drop images or files to attach</span></div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-300/50 dark:border-white/10"><button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg hover:shadow-indigo-500/30 transition-all"><Send size={12} /> Publish to Feed</button></div>
            </motion.div>
        </div>
    );
}

export default function LessonsModule() {
  const { data: session } = useSession();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showYearBoard, setShowYearBoard] = useState(true);
  
  // STATE
  const [classes, setClasses] = useState(initialSchedule);
  const [selectedClass, setSelectedClass] = useState<any>(initialSchedule[0]);
  const [gadgetOn, setGadgetOn] = useState(false);
  const [pluggedDay, setPluggedDay] = useState<number | null>(null); 
  const [showSticky, setShowSticky] = useState(true);
  const [stickyText, setStickyText] = useState("");
  
  // CHAT ASSISTANT (AGENDA)
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "System online. Schedule management active." }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // CHAT ZAEON (RESEARCH)
  const [liquidChatHistory, setLiquidChatHistory] = useState<{role: 'user' | 'agent', text: string}[]>([
      { role: 'agent', text: "Zaeon initialized. Ready for data processing." }
  ]);
  const [zaeonInput, setZaeonInput] = useState("");
  const [isZaeonProcessing, setIsZaeonProcessing] = useState(false);

  const [storedPdfs, setStoredPdfs] = useState<StoredDoc[]>([]); 
  const [generatedDocs, setGeneratedDocs] = useState<StoredDoc[]>([]); 

  const [userModules, setUserModules] = useState<UserModule[]>([
      { id: 1, title: "Personal Backpack", items: [] },
      { id: 2, title: "Project Archives", items: [] }
  ]);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const constraintsRef = useRef(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const agendaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedClasses = localStorage.getItem('zaeon_schedule_data');
        const savedSticky = localStorage.getItem('zaeon_sticky_note');
        if (savedClasses) setClasses(JSON.parse(savedClasses));
        if (savedSticky) setStickyText(savedSticky);
        setIsDataLoaded(true);
    }
    if (session?.user) {
        setSelectedUser({ ...session.user, role: (session.user as any).role || 'ARCHITECT' });
    } else {
        setSelectedUser({ name: "Operative", role: "ARCHITECT", course: "Computer Science" });
    }
  }, [session]);

  useEffect(() => { 
      if (isDataLoaded) {
          localStorage.setItem('zaeon_schedule_data', JSON.stringify(classes)); 
          localStorage.setItem('zaeon_sticky_note', stickyText);
      }
  }, [classes, stickyText, isDataLoaded]);

  // --- HANDLER: ASSISTANT CHAT (Agenda Control) ---
  const handleAssistantMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputMessage("");
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: userMsg, 
            agent: "zenita", 
            systemContext: JSON.stringify(classes) 
        })
      });
      const data = await response.json();
      if (data.toolCall && data.toolCall.name === "update_schedule") {
          const args = data.toolCall.args;
          setClasses(prevClasses => {
              let newClasses = [...prevClasses];
              if (args.action === "add" || args.action === "update") {
                  newClasses = newClasses.filter(c => !(c.days.includes(args.day) && c.hour === args.hour));
                  newClasses.push({
                      id: Date.now(),
                      name: args.name || "New Event",
                      teacher: args.teacher || "Self-Study",
                      room: args.room || "Virtual",
                      days: [args.day],
                      hour: args.hour,
                      color: "from-emerald-400 to-teal-500"
                  });
              } 
              else if (args.action === "remove") {
                  newClasses = newClasses.filter(c => !(c.days.includes(args.day) && c.hour === args.hour));
              }
              return newClasses;
          });
          setChatHistory(prev => [...prev, { role: 'ai', text: `Schedule updated successfully.` }]);
      } else {
          setChatHistory(prev => [...prev, { role: 'ai', text: data.text || "Command processed." }]);
      }
    } catch (e) {
      console.error(e);
      setChatHistory(prev => [...prev, { role: 'ai', text: "Error connecting to Neural Core." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HANDLER: ZAEON CHAT (Knowledge/Tools) ---
  const handleZaeonMessage = async () => {
      if (!zaeonInput.trim()) return;
      const msg = zaeonInput;
      setLiquidChatHistory(prev => [...prev, { role: 'user', text: msg }]);
      setZaeonInput("");
      setIsZaeonProcessing(true);

      try {
        // Envia contexto de arquivos da Library (apenas títulos para não estourar payload)
        const libraryContext = storedPdfs.length > 0 
            ? `Available Files: ${storedPdfs.map(f => f.title).join(", ")}` 
            : "No files in library.";

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: msg, 
                agent: "ethernaut", 
                systemContext: `User is in Zaeon Lab. ${libraryContext}` 
            })
        });
        const data = await response.json();
        setLiquidChatHistory(prev => [...prev, { role: 'agent', text: data.text || "Data retrieved." }]);
      } catch (e) {
        setLiquidChatHistory(prev => [...prev, { role: 'agent', text: "Connection offline." }]);
      } finally {
        setIsZaeonProcessing(false);
      }
  };

  const handleGadgetDragEnd = (event: any, info: any) => {
    if (!agendaRef.current) return;
    const agendaRect = agendaRef.current.getBoundingClientRect();
    const dropY = info.point.y;
    const isNearBottom = dropY > agendaRect.bottom - 80 && dropY < agendaRect.bottom + 50;
    if (isNearBottom && info.point.x > agendaRect.left && info.point.x < agendaRect.right) {
        const colWidth = agendaRect.width / 5;
        const colIndex = Math.floor((info.point.x - agendaRect.left) / colWidth);
        if (colIndex >= 0 && colIndex <= 4) setPluggedDay(colIndex); else setPluggedDay(null);
    } else { setPluggedDay(null); }
  };

  const handleUserModuleDrop = (e: React.DragEvent, moduleId: number) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      const newItems: UserItem[] = files.map(f => ({
          id: Math.random().toString(36).substr(2, 9), type: 'file', name: f.name, meta: (f.size / 1024 / 1024).toFixed(1) + 'mb'
      }));
      setUserModules(prev => prev.map(m => m.id === moduleId ? { ...m, items: [...m.items, ...newItems] } : m));
  };

  const deleteUserItem = (moduleId: number, itemId: string) => { setUserModules(prev => prev.map(m => m.id === moduleId ? { ...m, items: m.items.filter(i => i.id !== itemId) } : m)); };
  const handleAddLink = (moduleId: number) => { const url = prompt("Enter URL:"); if (url) { const name = prompt("Link Name:") || "Link"; setUserModules(prev => prev.map(m => m.id === moduleId ? { ...m, items: [...m.items, { id: Math.random().toString(36).substr(2, 9), type: 'link', name, meta: url }] } : m)); } };

  const yearSquares = Array.from({ length: 365 }, (_, i) => Math.floor(Math.random() * 4));
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = Array.from({ length: 9 }, (_, i) => i + 8);
  const formatTime = (h: number) => `${h.toString().padStart(2, '0')}:00 - ${(h + 2).toString().padStart(2, '0')}:00`;

  return (
    <div ref={constraintsRef} className="relative min-h-screen w-full flex flex-col items-center p-8 bg-transparent font-sans selection:bg-cyan-500/30 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      
      {/* HEADER / ANNUAL FLOW */}
      <section className="w-full max-w-[1400px] z-10 transition-all duration-700 pointer-events-auto mb-10">
        <div className="flex justify-between items-center px-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]"><Activity size={14} className="text-cyan-300" /></div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Annual Flow</h3>
          </div>
          <div className="flex items-center gap-2">
             {!showSticky && <button onClick={() => setShowSticky(true)} className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md transition-all"><StickyNote size={12} /> Open Note</button>}
             <button onClick={() => setShowYearBoard(!showYearBoard)} className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full backdrop-blur-md">{showYearBoard ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
          </div>
        </div>
        <AnimatePresence>{showYearBoard && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_20px_40px_-20px_rgba(0,0,0,0.5)]"><div className="overflow-x-auto pb-2 scrollbar-hide mask-fade-sides"><div className="grid grid-rows-7 grid-flow-col gap-[4px] w-max min-w-full">{yearSquares.map((level, i) => (<div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${level === 0 ? 'bg-white/5' : level === 1 ? 'bg-cyan-900/40 shadow-[0_0_5px_rgba(8,145,178,0.2)]' : level === 2 ? 'bg-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] scale-110'}`} />))}</div></div></div></motion.div>)}</AnimatePresence>
      </section>

      <div className="h-24 pointer-events-none"></div>

      {/* 3. DRAGGABLE WORKSPACE */}
      <div className="flex justify-center items-start gap-6 flex-wrap z-20 relative w-full pb-10 min-h-[400px]">
        {/* ASSISTANT CHAT */}
        <motion.div drag dragConstraints={constraintsRef} className="group w-80 h-[380px] relative z-10">
            <div className="w-full h-full bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-5 rounded-[2.5rem] shadow-xl flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2 z-10"><div className="flex items-center gap-2"><Sparkles size={12} className="text-cyan-400" /><span className="text-[9px] font-bold uppercase tracking-widest text-white/70">Assistant</span></div>{isProcessing && <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></div>}</div>
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pr-1 py-2 z-10">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-2.5 rounded-2xl text-[10px] leading-relaxed font-medium ${msg.role === 'user' ? 'bg-cyan-500/10 text-cyan-200 border border-cyan-500/20' : 'bg-white/5 text-white/80 border border-white/5'}`}>{msg.text}</div></div>
                    ))}
                </div>
                <div className="mt-2 pt-2 border-t border-white/5 flex gap-2 z-10">
                    <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAssistantMessage()} disabled={isProcessing} placeholder="Type command..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors" />
                    <button onClick={handleAssistantMessage} disabled={isProcessing} className="p-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 rounded-xl border border-cyan-500/30 transition-colors disabled:opacity-50"><Send size={12} /></button>
                </div>
            </div>
        </motion.div>

        {/* SCHEDULE */}
        <motion.div ref={agendaRef} drag dragConstraints={constraintsRef} className="group w-64 h-[340px] relative z-10"><div className={`w-full h-full backdrop-blur-xl border border-white/10 p-5 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-between relative overflow-hidden bg-[#172554]/90 dark:bg-black/40`}><div className="w-full flex justify-between items-center mb-2 pointer-events-none"><span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Agenda</span>{pluggedDay !== null && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping shadow-[0_0_10px_#22d3ee]"></div>}</div><div className="w-full flex gap-2 justify-between h-full pointer-events-auto">{days.map((day, dIdx) => (<div key={day} className="flex flex-col h-full flex-1 items-center relative"><div className={`absolute inset-0 rounded-lg transition-all duration-500 pointer-events-none ${pluggedDay === dIdx ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse' : ''}`} /><div className="flex-1 flex flex-col justify-between w-full z-10 gap-[2px]">{hours.map((hour) => {const classAtTime = classes.find((c:any) => c.days.includes(dIdx + 1) && c.hour === hour);return <div key={`${day}-${hour}`} onPointerDown={() => classAtTime && setSelectedClass(classAtTime)} className={`w-full flex-1 rounded-[2px] cursor-pointer ${classAtTime ? `bg-gradient-to-br ${classAtTime.color} opacity-80` : 'bg-white/5'}`} />})}</div><div className="mt-2 w-full flex flex-col items-center justify-end h-8 relative">{pluggedDay === dIdx ? (<motion.div layoutId="gadget-fuse" onClick={() => setPluggedDay(null)} className="w-full h-6 bg-[#222] border-t-2 border-cyan-500 rounded-b-md shadow-[0_0_10px_#22d3ee] flex items-center justify-center cursor-pointer hover:bg-[#333]"><div className={`w-2 h-2 rounded-full ${gadgetOn ? 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]' : 'bg-gray-600'}`}></div></motion.div>) : (<div className="w-full h-1 bg-white/10 rounded-full mb-1"></div>)}<span className={`text-[7px] font-bold transition-colors ${pluggedDay === dIdx ? 'text-cyan-300' : 'text-white/40'}`}>{day[0]}</span></div></div>))}</div></div></motion.div>
        
        {/* DETAILS */}
        <motion.div drag dragConstraints={constraintsRef} className="group w-52 h-52 relative"><div className="w-full h-full bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-xl flex flex-col justify-between relative overflow-hidden">{selectedClass ? (<><h2 className="text-sm font-bold text-white leading-tight drop-shadow-md mb-2">{selectedClass.name}</h2><div className="flex items-center gap-1.5 text-cyan-300"><Clock size={12} /><span className="text-[10px] font-mono">{formatTime(selectedClass.hour)}</span></div></>) : (<div className="flex flex-col items-center justify-center h-full text-white/20 gap-2"><X size={16} /><span className="text-[9px] font-bold uppercase tracking-widest">No Selection</span></div>)}</div></motion.div>
        
        {/* STICKY & PLUG */}
        <AnimatePresence>{showSticky && <motion.div drag dragConstraints={constraintsRef} className="group w-40 h-40 relative z-20"><div className="w-full h-full bg-[#fbbf24] dark:bg-yellow-900/10 backdrop-blur-xl border border-yellow-600/30 dark:border-yellow-500/10 p-5 rounded-[2rem] shadow-xl flex flex-col relative overflow-hidden"><textarea value={stickyText} onChange={(e) => setStickyText(e.target.value)} className="w-full h-full bg-transparent border-none outline-none resize-none text-[10px] text-black font-black font-mono placeholder-black/30" placeholder="Note..." /></div></motion.div>}</AnimatePresence>
        <AnimatePresence>{pluggedDay === null && (<motion.div layoutId="gadget-fuse" drag onDragEnd={handleGadgetDragEnd} dragConstraints={constraintsRef} className="group w-16 h-24 relative z-50"><div className="w-full h-full bg-gradient-to-b from-[#333] to-[#111] border border-gray-600 rounded-md shadow-[0_10px_20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col items-center justify-between p-2 relative overflow-hidden"><div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-yellow-600 rounded-t-sm shadow-sm"></div><button onPointerDown={(e) => { e.stopPropagation(); setGadgetOn(!gadgetOn); }} className={`w-8 h-8 rounded-full border-2 border-[#444] shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all ${gadgetOn ? 'bg-cyan-900 shadow-[inset_0_0_8px_#06b6d4]' : 'bg-[#222]'}`}><Power size={10} className={`transition-colors ${gadgetOn ? 'text-cyan-400' : 'text-gray-600'}`} /></button><div className="w-full h-8 bg-black/60 rounded border border-white/5 flex items-center justify-center relative overflow-hidden">{gadgetOn && <div className="absolute inset-0 bg-cyan-500/20 animate-pulse"></div>}<div className={`w-full h-[1px] bg-gray-700`}><motion.div animate={{ width: gadgetOn ? "100%" : "0%" }} className="h-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]" /></div></div></div></motion.div>)}</AnimatePresence>
      </div>

      {/* 4. ZAEON & GADGETS */}
      <div className="w-full flex justify-center py-20 relative z-20">
        <motion.div drag dragConstraints={constraintsRef} className="group relative flex items-center gap-10">
            {/* ENERGY CORDS ANIMATION */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
                {[{ yStart: 130, yEnd: 84, delay: 0 }, { yStart: 340, yEnd: 356, delay: 0.2 }].map((cord, idx) => (
                    <div key={idx} className="absolute left-[384px] overflow-visible">
                        <svg width="80" height="450" viewBox="0 0 80 450" className="overflow-visible opacity-30"><path d={`M 0 ${cord.yStart} C 40 ${cord.yStart}, 30 ${cord.yEnd}, 80 ${cord.yEnd}`} fill="none" stroke="#22d3ee" strokeWidth="2" /></svg>
                        <svg width="80" height="450" viewBox="0 0 80 450" className="absolute top-0 overflow-visible">
                            <motion.path d={`M 0 ${cord.yStart} C 40 ${cord.yStart}, 30 ${cord.yEnd}, 80 ${cord.yEnd}`} fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="10 40" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -100 }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: cord.delay }} className="drop-shadow-[0_0_8px_#22d3ee]" />
                        </svg>
                    </div>
                ))}
                <div className="absolute left-[382px] top-[125px] w-1 h-[40px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] rounded-full animate-pulse" />
                <div className="absolute left-[382px] top-[335px] w-1 h-[40px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] rounded-full animate-pulse" />
            </div>

            {/* ZAEON CHAT (Fixed) */}
            <div className="w-96 h-[450px] bg-white/10 dark:bg-black/40 bg-white/70 backdrop-blur-3xl border border-white/30 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative z-10 transition-all duration-500">
                <div className="h-16 border-b border-white/20 flex items-center px-6 gap-4 bg-white/10"><div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-lg flex items-center justify-center border border-white/20"><Bot size={20} className="text-white" /></div><div className="flex flex-col"><span className="text-sm font-black text-slate-800 dark:text-white tracking-widest uppercase">Zaeon</span><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span><span className="text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-tighter">Core Active</span></div></div></div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">{liquidChatHistory.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed backdrop-blur-md shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white font-bold' : 'bg-white/80 dark:bg-white/5 text-slate-900 dark:text-white/90 border border-white/20'}`}>{m.text}</div></div>))}</div>
                <div className="p-4 bg-white/10 border-t border-white/20">
                    <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-black/30 rounded-full px-2 py-2 border border-white/30 dark:border-white/5">
                        <input value={zaeonInput} onChange={(e) => setZaeonInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleZaeonMessage()} className="bg-transparent flex-1 text-xs text-slate-900 dark:text-white px-3 outline-none placeholder:text-slate-500 dark:placeholder:text-white/20" placeholder="Ask Zaeon..." disabled={isZaeonProcessing} />
                        <button onClick={handleZaeonMessage} disabled={isZaeonProcessing} className="w-9 h-9 rounded-full bg-blue-600 dark:bg-cyan-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"><Send size={14} className="text-white" /></button>
                    </div>
                </div>
            </div>

            {/* GADGETS */}
            <div className="flex flex-col gap-14 z-10">
                <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const files = Array.from(e.dataTransfer.files); const pdfs = files.filter(f => f.type === 'application/pdf').map(f => ({ id: Math.random().toString(36).substr(2, 9), title: f.name, type: 'pdf' as const, size: (f.size / 1024 / 1024).toFixed(1) + 'mb' })); setStoredPdfs(prev => [...prev, ...pdfs]); }} className="h-32 min-w-[150px] max-w-[450px] bg-white/70 dark:bg-black/60 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[1.8rem] p-4 flex flex-col relative shadow-2xl"><div className="flex items-center justify-between mb-3 border-b border-blue-200/50 dark:border-white/20 pb-2"><div className="flex items-center gap-2"><Database size={13} className="text-blue-600 dark:text-cyan-400" /><span className="text-[10px] font-black uppercase tracking-widest">Library</span></div></div><div className="flex gap-2 items-center h-full overflow-x-auto scrollbar-hide pr-2">{storedPdfs.map(pdf => (<motion.div key={pdf.id} className="group/item w-20 h-20 bg-blue-50/50 dark:bg-white/10 rounded-xl border border-blue-200/50 dark:border-white/20 flex flex-col items-center justify-center gap-0.5 p-2 relative"><FileText size={22} className="text-blue-600 dark:text-cyan-400" /><span className="text-[8px] text-slate-900 dark:text-white font-black truncate w-full block">{pdf.title}</span></motion.div>))}</div></div>
                <div className="h-32 min-w-[150px] max-w-[450px] bg-white/70 dark:bg-black/60 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[1.8rem] p-4 flex flex-col relative shadow-2xl"><div className="flex items-center justify-between mb-3 border-b border-purple-200/50 dark:border-white/20 pb-2"><div className="flex items-center gap-2"><Activity size={13} className="text-purple-600 dark:text-purple-400" /><span className="text-[10px] font-black uppercase tracking-widest">Fabricator</span></div></div></div>
            </div>
        </motion.div>
      </div>

      {/* 5. BACKPACK */}
      <div className="w-full flex justify-center gap-8 pb-32 flex-wrap relative z-20">
          {userModules.map((mod) => (
              <motion.div key={mod.id} drag dragConstraints={constraintsRef} className="h-44 min-w-[280px] max-w-[500px] flex-1 bg-white/70 dark:bg-black/60 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[1.8rem] p-5 flex flex-col relative shadow-xl"><div className="flex items-center justify-between mb-4 border-b border-emerald-200/50 dark:border-white/20 pb-2"><div className="flex items-center gap-2 w-full"><Briefcase size={14} className="text-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest">{mod.title}</span></div></div></motion.div>
          ))}
      </div>

      {/* 6. COLLECTIVE BUILD ZONE */}
      <CollectiveZone classes={classes} currentUser={session?.user} dragConstraints={constraintsRef} />

      {/* 7. NEURAL EDITOR */}
      <CollabEditor dragConstraints={constraintsRef} />

    </div>
  );
}