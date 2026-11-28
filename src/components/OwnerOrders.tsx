import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Clock, CheckCircle2, Send, RefreshCw, Mail, 
  MessageCircle, Search, Filter, Sparkles, Copy, Check, 
  Briefcase, DollarSign, Calendar, ArrowUpRight, 
  ShieldCheck, AlertCircle, Trash2, X, KeyRound, Lock, Eye, EyeOff
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { playClickSound, playSuccessSound, playHoverSound } from '../utils/audio';

export interface ClientOrder {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget: string;
  timeline: string;
  details?: string;
  order_status?: 'new' | 'in_progress' | 'proposal_sent' | 'completed' | 'cancelled';
  reply_message?: string | null;
  reply_status?: 'pending' | 'replied';
  replied_at?: string | null;
  created_at: string;
}

const LOCAL_STORAGE_ORDERS_KEY = 'ahtasham_client_orders_cache';

// Helper to filter out any fake/mock/demo orders
export const isDummyOrder = (o: { id?: string; name?: string; email?: string } | null | undefined): boolean => {
  if (!o) return true;
  const name = (o.name || '').toLowerCase();
  const email = (o.email || '').toLowerCase();
  const id = (o.id || '').toLowerCase();

  if (id === 'ord-8491' || id === 'ord-8492' || id === 'ord-101' || id === 'ord-102') return true;
  if (name.includes('elena rostova') || name.includes('marcus vance')) return true;
  if (email.includes('primedrive-luxury') || email.includes('stratech-ai.io')) return true;
  if (name.includes('test client') || name.includes('sample client')) return true;
  return false;
};

export const OwnerOrders: React.FC = () => {
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replyDrafts, setReplyDrafts] = useState<{ [key: string]: string }>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<ClientOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'orders' | 'security'>('orders');
  const [oldAdminPass, setOldAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    playClickSound();

    const currentStoredPass = localStorage.getItem('ahtasham_admin_custom_password') || 'webstudio5911';

    if (oldAdminPass.trim() !== currentStoredPass) {
      playClickSound();
      setPasswordMsg({ type: 'error', text: 'Purana password galat hai. Sahi purana password enter karein.' });
      return;
    }

    if (!newAdminPass.trim() || newAdminPass.length < 4) {
      playClickSound();
      setPasswordMsg({ type: 'error', text: 'Naya password kam az kam 4 characters ka hona chahiye.' });
      return;
    }

    if (newAdminPass !== confirmAdminPass) {
      playClickSound();
      setPasswordMsg({ type: 'error', text: 'Naya password aur confirm password match nahi kar rahe.' });
      return;
    }

    localStorage.setItem('ahtasham_admin_custom_password', newAdminPass.trim());
    playSuccessSound();
    setPasswordMsg({ type: 'success', text: 'Master Admin Password kamyabi ke sath change ho gaya hai!' });
    setOldAdminPass('');
    setNewAdminPass('');
    setConfirmAdminPass('');
  };

  // Load orders from Supabase + Local Storage cache (ONLY real client orders)
  const loadOrders = async () => {
    setLoading(true);

    let combined: ClientOrder[] = [];

    // 1. Read from LocalStorage cache first and purge any legacy fake/dummy orders
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          combined = parsed.filter((o: ClientOrder) => !isDummyOrder(o));
          // Save sanitized list back to cache
          localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(combined));
        }
      }
    } catch {
      // ignore
    }

    // 2. Fetch live from Supabase table 'hire_requests'
    try {
      const { data, error } = await supabase
        .from('hire_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const dbOrders = (data as ClientOrder[]).filter((o) => !isDummyOrder(o));
        
        // Merge without duplicating IDs
        const existingIds = new Set(dbOrders.map((o) => o.id));
        const nonDuplicateLocal = combined.filter((o) => !existingIds.has(o.id));
        combined = [...dbOrders, ...nonDuplicateLocal];

        // Update local cache
        try {
          localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(combined));
        } catch {}
      }
    } catch (err) {
      console.info('Supabase orders fetch notice:', err);
    }

    // Sort newest first - if empty, keep it empty (ZERO fake orders)
    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setOrders(combined);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    // Listen for live client order events dispatched by HireModal or ContactForm
    const handleNewOrderEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ClientOrder>;
      if (customEvent.detail && !isDummyOrder(customEvent.detail)) {
        setOrders((prev) => {
          const exists = prev.some((o) => o.id === customEvent.detail.id);
          if (exists) return prev;
          const updated = [customEvent.detail, ...prev];
          try {
            localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });
        playSuccessSound();
      }
    };

    window.addEventListener('new-client-order', handleNewOrderEvent);
    return () => window.removeEventListener('new-client-order', handleNewOrderEvent);
  }, []);

  // Update order status in both Supabase and LocalStorage
  const handleUpdateStatus = async (
    orderId: string,
    newStatus: 'new' | 'in_progress' | 'proposal_sent' | 'completed' | 'cancelled'
  ) => {
    playClickSound();
    setUpdatingId(orderId);

    // Update in Supabase
    try {
      await supabase
        .from('hire_requests')
        .update({ order_status: newStatus })
        .eq('id', orderId);
    } catch (err) {
      console.info('Status update notice:', err);
    }

    // Update state & LocalStorage
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o));
      try {
        localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setUpdatingId(null);
    playSuccessSound();
  };

  // Save proposal/reply for an order
  const handleSaveReply = async (order: ClientOrder) => {
    const draftText = replyDrafts[order.id]?.trim();
    if (!draftText) return;

    playClickSound();
    setUpdatingId(order.id);
    const nowIso = new Date().toISOString();
    const nextStatus = order.order_status === 'new' ? 'proposal_sent' : order.order_status;

    try {
      await supabase
        .from('hire_requests')
        .update({
          reply_message: draftText,
          reply_status: 'replied',
          order_status: nextStatus,
          replied_at: nowIso,
        })
        .eq('id', order.id);
    } catch (err) {
      console.info('Order reply notice:', err);
    }

    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              reply_message: draftText,
              reply_status: 'replied' as const,
              order_status: nextStatus,
              replied_at: nowIso,
            }
          : o
      );
      try {
        localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setUpdatingId(null);
    playSuccessSound();
  };

  const handleCopyEmail = (email: string) => {
    playClickSound();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleWhatsApp = (order: ClientOrder) => {
    playClickSound();
    const draft = replyDrafts[order.id] || `Hi ${order.name}! Ahtasham Javed here regarding your project order for ${order.service}. I have reviewed your brief and would love to get started!`;
    const text = encodeURIComponent(draft);
    const phone = order.phone?.replace(/[^0-9]/g, '') || '923007118380';
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleEmail = (order: ClientOrder) => {
    playClickSound();
    const draft = replyDrafts[order.id] || `Hi ${order.name},\n\nThank you for placing your project order for ${order.service}.\n\nI have reviewed your specifications and would love to collaborate.\n\nBest regards,\nAhtasham Javed`;
    const subject = encodeURIComponent(`Project Proposal: ${order.service} - Ahtasham Javed`);
    const body = encodeURIComponent(draft);
    window.open(`mailto:${order.email}?subject=${subject}&body=${body}`, '_blank');
  };

  // Open custom in-UI delete confirmation modal (no window.confirm to avoid iframe issues)
  const handlePromptDeleteOrder = (order: ClientOrder) => {
    playClickSound();
    setOrderToDelete(order);
  };

  // Permanently delete order from Supabase & LocalStorage
  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    playClickSound();

    const targetId = orderToDelete.id;

    try {
      await supabase.from('hire_requests').delete().eq('id', targetId);
    } catch (err) {
      console.info('Supabase delete order notice:', err);
    }

    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== targetId);
      try {
        localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsDeleting(false);
    setOrderToDelete(null);
    playSuccessSound();
  };

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'new'
        ? o.order_status === 'new' || (!o.order_status && o.reply_status !== 'replied')
        : statusFilter === 'in_progress'
        ? o.order_status === 'in_progress'
        : statusFilter === 'completed'
        ? o.order_status === 'completed'
        : o.order_status === statusFilter;

    const matchesSearch =
      searchQuery === ''
        ? true
        : o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.details && o.details.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const newCount = orders.filter((o) => o.order_status === 'new' || (!o.order_status && o.reply_status !== 'replied')).length;
  const inProgCount = orders.filter((o) => o.order_status === 'in_progress').length;
  const completedCount = orders.filter((o) => o.order_status === 'completed').length;

  return (
    <section id="orders" className="py-20 relative overflow-hidden bg-black/40 min-h-[90vh]">
      {/* Background Neon Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Top Header Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Owner Exclusive Dashboard</span>
              <span className="text-slate-600">·</span>
              <span className="text-purple-400">Live Client Orders</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              Client Orders Management Hub
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Every client project order submitted through the <strong className="text-cyan-300">Hire Me</strong> form or <strong className="text-purple-300">Service Selection</strong> arrives here in real-time. Review client budgets, manage development stages, and dispatch proposals.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => {
                playClickSound();
                loadOrders();
              }}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Orders</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setAdminTab('orders');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'orders'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'glass-panel text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span>Client Orders Hub</span>
            {newCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-black font-mono font-bold text-[10px]">
                {newCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setAdminTab('security');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'security'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'glass-panel text-slate-300 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4 text-purple-400" />
            <span>Admin Security & Password</span>
          </button>
        </div>

        {adminTab === 'security' ? (
          /* =========================================================
             ADMIN SECURITY & PASSWORD CHANGE PANEL
             ========================================================= */
          <div className="max-w-xl mx-auto py-10">
            <div className="glass-panel rounded-3xl p-8 border border-purple-500/30 bg-purple-950/20 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  <KeyRound className="w-7 h-7 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white font-display">
                  Change Admin Master Password
                </h2>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Enter your current (old) master password followed by your new password to secure portfolio admin access.
                </p>
              </div>

              {passwordMsg && (
                <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs animate-in fade-in duration-200 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                }`}>
                  <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${passwordMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <span className="leading-relaxed">{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {/* Old Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Current Admin Password (Purana Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPass ? 'text' : 'password'}
                      required
                      placeholder="Enter current password..."
                      value={oldAdminPass}
                      onChange={(e) => setOldAdminPass(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setShowOldPass(!showOldPass);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    New Admin Password (Naya Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Enter new password (min 4 chars)..."
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setShowNewPass(!showNewPass);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password..."
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Lock className="w-4 h-4 text-cyan-300" />
                    <span>Update Admin Master Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* =========================================================
             CLIENT ORDERS HUB VIEW
             ========================================================= */
          <>
            {/* Orders Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-400/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase">
              <span>Total Orders Received</span>
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-white font-display mt-2">{orders.length}</div>
            <div className="text-[11px] text-cyan-400 mt-1">Direct from portfolio clients</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between text-amber-400 text-[11px] font-mono uppercase">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>New Orders (Pending)</span>
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-300 font-display mt-2">{newCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Awaiting proposal / kickoff</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all">
            <div className="flex items-center justify-between text-blue-400 text-[11px] font-mono uppercase">
              <span>In Development</span>
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-blue-300 font-display mt-2">{inProgCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Active client sprints</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-emerald-400/40 transition-all">
            <div className="flex items-center justify-between text-emerald-400 text-[11px] font-mono uppercase">
              <span>Completed Projects</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-300 font-display mt-2">{completedCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Delivered to production</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
            <span className="text-slate-400 text-[11px] font-mono mr-1">Filter:</span>
            {[
              { id: 'all', label: `All (${orders.length})` },
              { id: 'new', label: `🟡 New (${newCount})` },
              { id: 'in_progress', label: `🔵 In Progress (${inProgCount})` },
              { id: 'completed', label: `🟢 Completed (${completedCount})` },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  playClickSound();
                  setStatusFilter(btn.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  statusFilter === btn.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Orders Feed */}
        {filteredOrders.length === 0 ? (
          <div className="glass-panel rounded-3xl p-14 text-center space-y-4 border border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">No Client Orders Yet</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Jab koi real client website par <strong className="text-cyan-300">"Hire Me"</strong> button se ya contact form se order submit karega, wo yahan real-time live show hoga.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Supabase Sync Active</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStatus = order.order_status || 'new';
              const currentDraft = replyDrafts[order.id] || '';

              return (
                <div
                  key={order.id}
                  onMouseEnter={() => playHoverSound()}
                  className={`glass-panel rounded-3xl p-6 sm:p-8 border transition-all duration-300 hover:shadow-2xl ${
                    currentStatus === 'new'
                      ? 'border-amber-500/40 bg-amber-950/[0.08] shadow-[0_0_25px_rgba(245,158,11,0.1)]'
                      : currentStatus === 'in_progress'
                      ? 'border-cyan-500/40 bg-cyan-950/[0.08] shadow-[0_0_25px_rgba(6,182,212,0.1)]'
                      : 'border-white/10 bg-black/60'
                  }`}
                >
                  {/* Top Bar of Order Card */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      {/* Avatar with spinning ring */}
                      <div className="glow-rotating-ring w-12 h-12 rounded-full p-[2px] shrink-0">
                        <div className="glow-rotating-inner w-full h-full rounded-full bg-slate-950 font-bold text-sm text-cyan-300 font-mono">
                          {order.name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-bold text-white font-display">
                            {order.name}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                            Order #{order.id.slice(0, 8)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="font-mono">{order.email}</span>
                          <button
                            onClick={() => handleCopyEmail(order.email)}
                            className="p-1 hover:text-white text-slate-500 transition-colors cursor-pointer"
                            title="Copy client email"
                          >
                            {copiedEmail === order.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status Changer & Actions */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/15 shadow-sm">
                        <span className="text-[10px] font-mono text-slate-400 pl-2">Status:</span>
                        <select
                          value={currentStatus}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleUpdateStatus(
                              order.id,
                              e.target.value as 'new' | 'in_progress' | 'proposal_sent' | 'completed' | 'cancelled'
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono focus:outline-none cursor-pointer ${
                            currentStatus === 'new'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : currentStatus === 'in_progress'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : currentStatus === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          <option value="new" className="bg-slate-900 text-amber-300">🟡 New Order</option>
                          <option value="in_progress" className="bg-slate-900 text-cyan-300">🔵 In Progress</option>
                          <option value="proposal_sent" className="bg-slate-900 text-purple-300">🟣 Proposal Sent</option>
                          <option value="completed" className="bg-slate-900 text-emerald-300">🟢 Completed</option>
                          <option value="cancelled" className="bg-slate-900 text-rose-300">🔴 Cancelled</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handlePromptDeleteOrder(order)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600/90 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        title="Delete this order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>

                      <div className="text-[11px] font-mono text-slate-500 pl-1">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Order Key Specs Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b border-white/10">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Ordered Service</div>
                      <div className="text-xs font-semibold text-cyan-300 truncate">{order.service}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Budget Tier</div>
                      <div className="text-xs font-semibold text-purple-300 font-mono">{order.budget}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Target Timeline</div>
                      <div className="text-xs font-semibold text-emerald-300 font-mono">{order.timeline}</div>
                    </div>
                  </div>

                  {/* Client Brief / Requirements */}
                  <div className="py-4 space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Client Order Requirements:</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {order.details ? `"${order.details}"` : 'No additional brief specified by client.'}
                    </div>
                  </div>

                  {/* Previous Reply if already sent */}
                  {order.reply_message && (
                    <div className="mb-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs font-mono text-purple-400">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Dispatched Proposal / Reply:</span>
                        </span>
                        {order.replied_at && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.replied_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-200 italic">"{order.reply_message}"</p>
                    </div>
                  )}

                  {/* Proposal & Reply Composer */}
                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-mono text-purple-400 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Dispatch Proposal or Reply to Client:</span>
                      </label>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-500">Quick:</span>
                        <button
                          onClick={() => {
                            playClickSound();
                            setReplyDrafts({
                              ...replyDrafts,
                              [order.id]: `Hi ${order.name}! I have reviewed your project requirements for ${order.service}. I can deliver this within ${order.timeline} adhering to your ${order.budget} budget. Let's schedule a 15-minute technical alignment call.`,
                            });
                          }}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Formal Scope
                        </button>
                        <button
                          onClick={() => {
                            playClickSound();
                            setReplyDrafts({
                              ...replyDrafts,
                              [order.id]: `Hello ${order.name}, thank you for your order! I have reserved your development sprint in my schedule. When would you be available for a kickoff session?`,
                            });
                          }}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Kickoff Call
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      placeholder={`Type proposal or response to ${order.name}...`}
                      value={currentDraft}
                      onChange={(e) => setReplyDrafts({ ...replyDrafts, [order.id]: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    />

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => handleSaveReply(order)}
                        disabled={updatingId === order.id || !currentDraft}
                        className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40"
                      >
                        {updatingId === order.id ? (
                          <span>Saving...</span>
                        ) : (
                          <>
                            <span>Save & Dispatch Proposal</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWhatsApp(order)}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600/80 hover:bg-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Message client on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleEmail(order)}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Email client directly"
                        >
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Email Proposal</span>
                        </button>

                        <button
                          onClick={() => handlePromptDeleteOrder(order)}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600/90 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Delete this order permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Order</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </>
    )}

      </div>

      {/* Delete Confirmation In-UI Modal (prevents iframe alert/confirm issues) */}
      {orderToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => !isDeleting && setOrderToDelete(null)}
        >
          <div 
            className="glass-panel max-w-md w-full rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.3)] relative bg-[#0d0914] text-left animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Delete Client Order</h3>
                  <span className="text-[10px] font-mono text-rose-400 font-semibold uppercase">Permanent Action</span>
                </div>
              </div>

              {!isDeleting && (
                <button
                  onClick={() => setOrderToDelete(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
              Kya aap waqai is client order ko delete karna chahte hain? Ye order database aur dashboard dono se hamesha ke liye delete ho jayega.
            </p>

            <div className="my-4 p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Client:</span>
                <span className="text-white font-semibold">{orderToDelete.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email:</span>
                <span className="text-cyan-300 font-mono truncate max-w-[200px]">{orderToDelete.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Service:</span>
                <span className="text-purple-300 truncate max-w-[200px]">{orderToDelete.service}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Budget:</span>
                <span className="text-emerald-300 font-mono">{orderToDelete.budget}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Order ID:</span>
                <span className="text-slate-400 font-mono">#{orderToDelete.id.slice(0, 8)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteOrder}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? (
                  <span>Deleting Order...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
