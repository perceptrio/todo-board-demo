import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let body: any = null;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  const tickets: any[] = Array.isArray(body?.tickets) ? body.tickets : [];
  const makeDumb = () => {
    const n = tickets.length;
    const pr = (p: string) => tickets.filter((x:any)=>x?.priority===p).length;
    const st = (s: string) => tickets.filter((x:any)=>x?.status===s).length;
    const overdue = tickets.filter((x:any)=>{ try { return (new Date(x?.dueDate).getTime() - Date.now()) < 0 } catch(_){ return false } }).length;
    const soon = tickets.filter((x:any)=>{ const d=new Date(x?.dueDate).getTime()-Date.now(); const dd=Math.ceil(d/(1000*60*60*24)); return dd>=0 && dd<=3 }).length;
    return `Total ${n}. Priorities: urgent=${pr('urgent')}, high=${pr('high')}, medium=${pr('medium')}, low=${pr('low')}. Status: backlog=${st('backlog')}, in-progress=${st('in-progress')}, review=${st('review')}, done=${st('done')}. Deadlines: overdue=${overdue}, due-soon=${soon}.`;
  };
  const k = process.env.OPENAI_API_KEY;
  if (!k) {
    return NextResponse.json({ summary: makeDumb(), provider: 'fallback' });
  }
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${k}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You summarize task boards briefly.' },
          { role: 'user', content: `Summarize this ticket board in 3 short sentences, include counts by status and priority, and mention urgent/overdue: ${JSON.stringify(tickets).slice(0, 15000)}` }
        ],
        temperature: 0.2,
        max_tokens: 200
      })
    });
    if (!r.ok) {
      return NextResponse.json({ summary: makeDumb(), provider: 'fallback', note: 'ai_fail' });
    }
    const j = await r.json();
    const txt = j?.choices?.[0]?.message?.content || makeDumb();
    return NextResponse.json({ summary: txt, provider: 'openai' });
  } catch (e) {
    return NextResponse.json({ summary: makeDumb(), provider: 'fallback', note: 'err' });
  }
}
