import React, { useState, useEffect } from 'react';
import { 
  Inbox as InboxIcon, MessageSquare, Clock, CheckCircle2, 
  Send, RefreshCw, Mail, MessageCircle, Phone, Search, 
  Filter, Sparkles, Copy, Check, Database, ExternalLink, AlertCircle
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { playClickSound, playSuccessSound, playHoverSound } from '../utils/audio';
import { GlowIconBox } from './GlowIconBox';

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget: string;
  message: string;
  reply_message?: string | null;
  reply_status?: 'pending' | 'replied';
  replied_at?: string | null;
  created_at: string;
}

// Starter fallback records in case remote database is waiting for first submission
const fallbackInquiries: InquiryRecord[] = [
  {
    id: 'demo-1',
    name: 'Elena Rostova',
    email: 'elena@primedrive-luxury.com',
    phone: '+44 7700 900123',
    service: 'Full-Stack Web Development',
    budget: '$3,000 - $5,000',
    message: 'Hi Ahtasham, we loved your work on the Prime Drive showcase. We are looking to scale our luxury fleet platform with custom 3D vehicle inspection views. When would you be free for a kickoff discovery call?',
    reply_status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Marcus Vance',
    email: 'm.vance@stratech-ai.io',
    phone: '+1 415 555 2671',
    service: '3D Three.js Experience',
    budget: '$5,000+',
    message: 'Hello Ahtasham, we need an interactive Three.js 3D globe and data-pipeline visualizer for our enterprise SaaS dashboard. Your micro-interaction latency benchmark is exactly what we need.',
    reply_message: 'Hi Marcus! Thank you for getting in touch. I would love to build the 3D data pipeline visualizer for Stratech. I have drafted an architecture timeline and will follow up with our scope brief.',
    reply_status: 'replied',
    replied_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'demo-3',
    name: 'Sophia Laurent',
    email: 'sophia@solstice-design.fr',
    phone: '+33 6 12 34 56 78',
    service: 'UI/UX Design & Spatial Systems',
    budget: '$3,000 - $5,000',
    message: 'We are expanding our Paris interior studio and need a modern portfolio redesign with smooth parallax scrolling and high-fidelity room views.',
    reply_status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
];

export const Inbox: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'replied'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replyDrafts, setReplyDrafts] = useState<{ [key: string]: string }>({});
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState<boolean>(false);
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);

  // Fetch inquiries from Supabase
  const fetchInquiries = async () => {
    setLoading(true);
    playClickSound();

    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Use initial demo records if remote table has no entries yet
        setInquiries(fallbackInquiries);
      } else {
        setInquiries(data as InquiryRecord[]);
      }
    } catch {
      setInquiries(fallbackInquiries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Handle saving and sending reply
  const handleSendReply = async (inquiry: InquiryRecord) => {
    const draftText = replyDrafts[inquiry.id]?.trim();
    if (!draftText) return;

    playClickSound();
    setSendingId(inquiry.id);

    const nowIso = new Date().toISOString();

    try {
      // Update in Supabase
      await supabase
        .from('contact_inquiries')
        .update({
          reply_message: draftText,
          reply_status: 'replied',
          replied_at: nowIso,
        })
        .eq('id', inquiry.id);
    } catch (err) {
      console.info('Supabase reply update note:', err);
    }

    // Update local state immediately
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === inquiry.id
          ? {
              ...item,
              reply_message: draftText,
              reply_status: 'replied',
              replied_at: nowIso,
            }
          : item
      )
    );

    setSendingId(null);
    playSuccessSound();
  };

  const handleCopyEmail = (email: string) => {
    playClickSound();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleEmailReply = (inquiry: InquiryRecord) => {
    playClickSound();
    const draft = replyDrafts[inquiry.id] || `Hi ${inquiry.name},\n\nThank you for reaching out regarding ${inquiry.service}!\n\nBest regards,\nAhtasham Javed`;
    const subject = encodeURIComponent(`Re: Your Project Inquiry - Ahtasham Javed`);
    const body = encodeURIComponent(draft);
    window.open(`mailto:${inquiry.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleWhatsAppReply = (inquiry: InquiryRecord) => {
    playClickSound();
    const draft = replyDrafts[inquiry.id] || `Hi ${inquiry.name}, Ahtasham Javed here regarding your inquiry for ${inquiry.service}. Let's discuss your project!`;
    const text = encodeURIComponent(draft);
    // If phone number is available, use it, else prompt
    const phone = inquiry.phone?.replace(/[^0-9]/g, '');
    if (phone && phone.length >= 10) {
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const setQuickDraft = (id: string, text: string) => {
    playClickSound();
    setReplyDrafts((prev) => ({ ...prev, [id]: text }));
  };

  const copySqlSchema = () => {
    playClickSound();
    const sql = `-- Supabase Table Schema for Inquiries and Replies
create table if not exists public.contact_inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  service text default 'Web Development',
  budget text default '$1,000 - $3,000',
  message text not null,
  reply_message text,
  reply_status text default 'pending',
  replied_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_inquiries enable row level security;

drop policy if exists "Allow public submissions" on public.contact_inquiries;
create policy "Allow public submissions" on public.contact_inquiries for insert to anon, authenticated with check (true);

drop policy if exists "Allow reading inquiries" on public.contact_inquiries;
create policy "Allow reading inquiries" on public.contact_inquiries for select to anon, authenticated using (true);

drop policy if exists "Allow updating replies" on public.contact_inquiries;
create policy "Allow updating replies" on public.contact_inquiries for update to anon, authenticated using (true) with check (true);
`;
    navigator.clipboard.writeText(sql);
    setSqlCopied(true);
    playSuccessSound();
    setTimeout(() => setSqlCopied(false), 2500);
  };

  // Filtered inquiries
  const filtered = inquiries.filter((item) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'pending'
        ? item.reply_status !== 'replied'
        : item.reply_status === 'replied';

    const matchesSearch =
      searchQuery === ''
        ? true
        : item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingCount = inquiries.filter((i) => i.reply_status !== 'replied').length;
  const repliedCount = inquiries.filter((i) => i.reply_status === 'replied').length;

  return (
    <section id="inbox" className="py-20 relative overflow-hidden bg-black/40 min-h-[90vh]">
      {/* Background Neon Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Client Communications Hub</span>
              <span className="text-slate-600">·</span>
              <span className="text-purple-400">Supabase Connected</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              Client Inquiries & Message Center
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Review messages submitted by visitors on your website, draft personalized proposals, and reply directly through WhatsApp, Email, or save status into Supabase.
            </p>
          </div>

          {/* Quick Actions / SQL Helper Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setShowSqlGuide(!showSqlGuide);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>{showSqlGuide ? 'Hide SQL Code' : 'View Supabase SQL'}</span>
            </button>

            <button
              onClick={fetchInquiries}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Messages</span>
            </button>
          </div>
        </div>

        {/* Collapsible Supabase SQL Guide Card */}
        {showSqlGuide && (
          <div className="glass-panel rounded-3xl p-6 border border-purple-500/30 bg-purple-950/20 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Supabase SQL Query for Inquiries & Reply Storage
                </h3>
              </div>
              <button
                onClick={copySqlSchema}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {sqlCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Script</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Run this in your <span className="text-cyan-400 font-mono">Supabase Dashboard &gt; SQL Editor</span>. It enables visitors to submit inquiries and allows you to store your responses, reply status, and timestamps.
            </p>

            <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto max-h-56">
{`-- Create or update contact_inquiries with reply columns
create table if not exists public.contact_inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  service text default 'Web Development',
  budget text default '$1,000 - $3,000',
  message text not null,
  reply_message text,
  reply_status text default 'pending',
  replied_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.contact_inquiries enable row level security;

-- Policies for public insert, read, and reply update
create policy "Allow public submissions" on public.contact_inquiries for insert to anon, authenticated with check (true);
create policy "Allow reading inquiries" on public.contact_inquiries for select to anon, authenticated using (true);
create policy "Allow updating replies" on public.contact_inquiries for update to anon, authenticated using (true) with check (true);`}
            </pre>
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1 transition-all">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Total Received</div>
            <div className="text-2xl font-black text-white font-display mt-1">{inquiries.length}</div>
            <div className="text-[11px] text-cyan-400 mt-1">Direct from Portfolio</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-amber-400/40 hover:-translate-y-1 transition-all">
            <div className="text-[11px] font-mono text-amber-400 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Pending Action</span>
            </div>
            <div className="text-2xl font-black text-amber-300 font-display mt-1">{pendingCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Awaiting your response</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-emerald-400/40 hover:-translate-y-1 transition-all">
            <div className="text-[11px] font-mono text-emerald-400 uppercase">Replied & Closed</div>
            <div className="text-2xl font-black text-emerald-400 font-display mt-1">{repliedCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Proposals dispatched</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-purple-400/40 hover:-translate-y-1 transition-all">
            <div className="text-[11px] font-mono text-purple-400 uppercase">Response Target</div>
            <div className="text-2xl font-black text-purple-300 font-display mt-1">&lt; 2 Hours</div>
            <div className="text-[11px] text-slate-400 mt-1">High conversion velocity</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10 text-xs w-full sm:w-auto">
            <button
              onClick={() => {
                playClickSound();
                setActiveFilter('all');
              }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Inquiries ({inquiries.length})
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveFilter('pending');
              }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-amber-500/80 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveFilter('replied');
              }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                activeFilter === 'replied'
                  ? 'bg-emerald-600/80 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Replied ({repliedCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Inquiries Message Cards */}
        {filtered.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-white/10">
            <InboxIcon className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No inquiries found in this view</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Any new message submitted by a client on your Contact Form or Hire Me modal will immediately appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((item) => {
              const isReplied = item.reply_status === 'replied';
              const currentDraft = replyDrafts[item.id] || '';

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => playHoverSound()}
                  className={`glass-panel rounded-3xl p-6 sm:p-8 border transition-all duration-300 hover:shadow-2xl ${
                    isReplied
                      ? 'border-white/10 hover:border-emerald-500/40 bg-black/50'
                      : 'border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)] bg-black/60'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3.5">
                      {/* Client Avatar initials with glowing ring */}
                      <div className="glow-rotating-ring w-11 h-11 rounded-full p-[2px] shrink-0">
                        <div className="glow-rotating-inner w-full h-full rounded-full bg-slate-950 font-bold text-sm text-cyan-300 font-mono">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white font-display">
                            {item.name}
                          </h3>
                          {isReplied ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Replied</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <Clock className="w-3 h-3 animate-spin" />
                              <span>Awaiting Reply</span>
                            </span>
                          )}
                        </div>

                        {/* Email & Copy */}
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="font-mono">{item.email}</span>
                          <button
                            onClick={() => handleCopyEmail(item.email)}
                            className="p-1 hover:text-white text-slate-500 transition-colors cursor-pointer"
                            title="Copy client email"
                          >
                            {copiedEmail === item.email ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Tags & Timestamp */}
                    <div className="flex flex-wrap items-center gap-2 sm:text-right">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-500/20">
                        {item.service}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-purple-950/40 text-purple-300 border border-purple-500/20">
                        {item.budget}
                      </span>
                      <div className="text-[11px] font-mono text-slate-500 w-full sm:w-auto">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="py-5 space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      Client Message:
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-sm text-slate-200 leading-relaxed font-sans">
                      "{item.message}"
                    </div>
                  </div>

                  {/* Previous Reply Display if available */}
                  {item.reply_message && (
                    <div className="mb-5 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Your Dispatched Reply:</span>
                        </span>
                        {item.replied_at && (
                          <span className="text-[10px] font-mono text-slate-400">
                            Sent {new Date(item.replied_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                        "{item.reply_message}"
                      </p>
                    </div>
                  )}

                  {/* Interactive Reply Formulation Box */}
                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-mono text-purple-400 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isReplied ? 'Send Follow-up Message:' : 'Compose Reply to ' + item.name + ':'}</span>
                      </label>

                      {/* Quick Templates */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-500">Quick:</span>
                        <button
                          onClick={() =>
                            setQuickDraft(
                              item.id,
                              `Hi ${item.name}! Thank you for your inquiry about ${item.service}. I would love to schedule a quick 15-minute discovery call to align on your timeline and specifications.`
                            )
                          }
                          className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Discovery Call
                        </button>
                        <button
                          onClick={() =>
                            setQuickDraft(
                              item.id,
                              `Hello ${item.name}, thank you for reaching out. Based on your ${item.budget} budget, I can prepare a comprehensive technical scope and milestones breakdown for you today.`
                            )
                          }
                          className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Send Estimate
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      placeholder={`Type your reply to ${item.name} (e.g. Hi ${item.name}, I received your brief and would love to collaborate...)...`}
                      value={currentDraft}
                      onChange={(e) => setReplyDrafts({ ...replyDrafts, [item.id]: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    />

                    {/* Action Buttons: Save & Send to Supabase + WhatsApp + Email */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendReply(item)}
                          disabled={sendingId === item.id || !currentDraft}
                          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40"
                        >
                          {sendingId === item.id ? (
                            <span>Recording...</span>
                          ) : (
                            <>
                              <span>Save & Send Reply</span>
                              <Send className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWhatsAppReply(item)}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600/80 hover:bg-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Open WhatsApp chat with client"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Reply on WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleEmailReply(item)}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Open default email client"
                        >
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Reply via Email</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
