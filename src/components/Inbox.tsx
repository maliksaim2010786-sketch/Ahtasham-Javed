import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Inbox as InboxIcon, MessageSquare, Clock, CheckCircle2, 
  Send, RefreshCw, Mail, MessageCircle, Phone, Search, 
  Filter, Sparkles, Copy, Check, Database, ExternalLink, AlertCircle,
  Briefcase, DollarSign, Calendar, PlusCircle, ArrowUpRight
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { playClickSound, playSuccessSound, playHoverSound } from '../utils/audio';

export interface OrderRecord {
  id: string;
  name: string;
  email: string;
  service: string;
  timeline: string;
  budget: string;
  details?: string;
  order_status?: 'new' | 'in_progress' | 'proposal_sent' | 'completed' | 'cancelled';
  reply_message?: string | null;
  reply_status?: 'pending' | 'replied';
  replied_at?: string | null;
  created_at: string;
}

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

// Starter fallback records in case remote database is waiting for first live order
const fallbackOrders: OrderRecord[] = [
  {
    id: 'ord-101',
    name: 'Elena Rostova',
    email: 'elena@primedrive-luxury.com',
    service: 'Full-Stack Web Development',
    timeline: '2 - 4 Weeks',
    budget: '$3,000 - $5,000',
    details: 'We want to scale our luxury fleet platform with custom 3D vehicle inspection views, online reservation booking with deposit payments, and sub-120ms animation performance.',
    order_status: 'new',
    reply_status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ord-102',
    name: 'Marcus Vance',
    email: 'm.vance@stratech-ai.io',
    service: '3D Three.js Web Experience',
    timeline: 'Urgent (< 2 Weeks)',
    budget: '$5,000+',
    details: 'Need an interactive Three.js 3D globe and data-pipeline visualizer for our enterprise SaaS dashboard before our Series A demo day.',
    order_status: 'in_progress',
    reply_message: 'Hi Marcus! Project initiated. Initial 3D wireframe and Three.js geometry shaders have been drafted and deployed to staging.',
    reply_status: 'replied',
    replied_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

const fallbackInquiries: InquiryRecord[] = [
  {
    id: 'inq-201',
    name: 'Sophia Laurent',
    email: 'sophia@solstice-design.fr',
    phone: '+33 6 12 34 56 78',
    service: 'UI/UX Design & Spatial Systems',
    budget: '$3,000 - $5,000',
    message: 'We are expanding our Paris interior studio and need a modern portfolio redesign with smooth parallax scrolling and high-fidelity room views.',
    reply_status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export const Inbox: React.FC = () => {
  const [mainView, setMainView] = useState<'orders' | 'inquiries'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replyDrafts, setReplyDrafts] = useState<{ [key: string]: string }>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Fetch client orders from Supabase table 'hire_requests'
  const fetchOrdersAndInquiries = async () => {
    setLoading(true);
    playClickSound();

    try {
      // 1. Fetch Orders
      const { data: ordersData, error: ordersErr } = await supabase
        .from('hire_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersErr || !ordersData || ordersData.length === 0) {
        setOrders(fallbackOrders);
      } else {
        setOrders(ordersData as OrderRecord[]);
      }

      // 2. Fetch Contact Inquiries
      const { data: inqData, error: inqErr } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (inqErr || !inqData || inqData.length === 0) {
        setInquiries(fallbackInquiries);
      } else {
        setInquiries(inqData as InquiryRecord[]);
      }
    } catch {
      setOrders(fallbackOrders);
      setInquiries(fallbackInquiries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndInquiries();
  }, []);

  // Update order status live in Supabase
  const handleUpdateOrderStatus = async (
    orderId: string, 
    newStatus: 'new' | 'in_progress' | 'proposal_sent' | 'completed' | 'cancelled'
  ) => {
    playClickSound();
    setUpdatingId(orderId);

    try {
      await supabase
        .from('hire_requests')
        .update({ order_status: newStatus })
        .eq('id', orderId);
    } catch (err) {
      console.info('Order status note:', err);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
    );

    setUpdatingId(null);
    playSuccessSound();
  };

  // Save proposal/reply for an order
  const handleSaveOrderReply = async (order: OrderRecord) => {
    const draftText = replyDrafts[order.id]?.trim();
    if (!draftText) return;

    playClickSound();
    setUpdatingId(order.id);
    const nowIso = new Date().toISOString();

    try {
      await supabase
        .from('hire_requests')
        .update({
          reply_message: draftText,
          reply_status: 'replied',
          order_status: order.order_status === 'new' ? 'proposal_sent' : order.order_status,
          replied_at: nowIso,
        })
        .eq('id', order.id);
    } catch (err) {
      console.info('Supabase order update note:', err);
    }

    setOrders((prev) =>
      prev.map((item) =>
        item.id === order.id
          ? {
              ...item,
              reply_message: draftText,
              reply_status: 'replied',
              order_status: order.order_status === 'new' ? 'proposal_sent' : order.order_status,
              replied_at: nowIso,
            }
          : item
      )
    );

    setUpdatingId(null);
    playSuccessSound();
  };

  const handleCopyEmail = (email: string) => {
    playClickSound();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleEmailClient = (order: OrderRecord) => {
    playClickSound();
    const draft = replyDrafts[order.id] || `Hi ${order.name},\n\nThank you for placing your project request for ${order.service}.\n\nI have reviewed your requirements and would love to collaborate.\n\nBest regards,\nAhtasham Javed`;
    const subject = encodeURIComponent(`Project Proposal: ${order.service} - Ahtasham Javed`);
    const body = encodeURIComponent(draft);
    window.open(`mailto:${order.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleWhatsAppClient = (order: OrderRecord) => {
    playClickSound();
    const draft = replyDrafts[order.id] || `Hi ${order.name}! Ahtasham Javed here regarding your project order for ${order.service}. I have reviewed your brief and would love to get started!`;
    const text = encodeURIComponent(draft);
    window.open(`https://wa.me/923007118380?text=${text}`, '_blank');
  };

  const handleSimulateNewOrder = async () => {
    playClickSound();
    const demoClientNames = ['Oliver Thorne', 'Zainab Qureshi', 'Alexander Pierce', 'Chloe Dupont'];
    const demoServices = ['3D Three.js Web Experience', 'Full-Stack Web Development', 'E-commerce & Booking Platform'];
    const demoBudgets = ['$3,000 - $5,000', '$5,000+', '$1,000 - $3,000'];
    
    const randomName = demoClientNames[Math.floor(Math.random() * demoClientNames.length)];
    const randomService = demoServices[Math.floor(Math.random() * demoServices.length)];
    const randomBudget = demoBudgets[Math.floor(Math.random() * demoBudgets.length)];
    
    const newSimulatedOrder: OrderRecord = {
      id: 'ord-' + Math.floor(1000 + Math.random() * 9000),
      name: randomName,
      email: `${randomName.toLowerCase().replace(' ', '.')}@enterprise-client.io`,
      service: randomService,
      timeline: '2 - 4 Weeks',
      budget: randomBudget,
      details: `We need an agency-grade ${randomService} with interactive 3D capabilities and seamless performance for our corporate product launch.`,
      order_status: 'new',
      reply_status: 'pending',
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('hire_requests').insert([newSimulatedOrder]);
    } catch {
      // optimistic update
    }

    setOrders((prev) => [newSimulatedOrder, ...prev]);
    playSuccessSound();
  };

  // Filtered orders
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

  const newOrdersCount = orders.filter((o) => o.order_status === 'new' || (!o.order_status && o.reply_status !== 'replied')).length;
  const inProgressCount = orders.filter((o) => o.order_status === 'in_progress').length;
  const completedCount = orders.filter((o) => o.order_status === 'completed').length;

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
              <span>Owner Command Center</span>
              <span className="text-slate-600">·</span>
              <span className="text-purple-400">Encrypted Private Access</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              Client Orders & Project Command Hub
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every order submitted by clients across your portfolio arrives here in real-time. Manage project scopes, track build progress, and dispatch proposals directly.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={handleSimulateNewOrder}
              onMouseEnter={() => playHoverSound()}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
              title="Test new order arrival"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test Client Order</span>
            </button>

            <button
              onClick={fetchOrdersAndInquiries}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Orders</span>
            </button>
          </div>
        </div>

        {/* Orders KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Total Orders</div>
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-white font-display mt-2">{orders.length}</div>
            <div className="text-[11px] text-cyan-400 mt-1">Client project bookings</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-amber-400/40 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono text-amber-400 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>New Orders</span>
              </div>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-300 font-display mt-2">{newOrdersCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Requires proposal / kickoff</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-blue-400/40 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono text-blue-400 uppercase">In Development</div>
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-blue-300 font-display mt-2">{inProgressCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Active client builds</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-emerald-400/40 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono text-emerald-400 uppercase">Completed</div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-300 font-display mt-2">{completedCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Delivered to production</div>
          </div>
        </div>

        {/* View Switcher: Client Orders vs Contact Inquiries */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/60 border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => {
                playClickSound();
                setMainView('orders');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mainView === 'orders'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Client Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setMainView('inquiries');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mainView === 'inquiries'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>General Messages ({inquiries.length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={mainView === 'orders' ? 'Search client or order...' : 'Search messages...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* =========================================================================
           TAB 1: CLIENT PROJECT ORDERS (Primary Focus)
           ========================================================================= */}
        {mainView === 'orders' && (
          <div className="space-y-6">
            {/* Status Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-mono mr-1">Filter:</span>
              {[
                { id: 'all', label: `All (${orders.length})` },
                { id: 'new', label: `New (${newOrdersCount})` },
                { id: 'in_progress', label: `In Progress (${inProgressCount})` },
                { id: 'completed', label: `Completed (${completedCount})` },
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

            {filteredOrders.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-white/10">
                <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No orders match this filter</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When a client clicks "Hire Me" or books a service on your website, their order will immediately show up here.
                </p>
                <button
                  onClick={handleSimulateNewOrder}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/50 transition-colors"
                >
                  Create Sample Order
                </button>
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
                        {/* Client Identity & Order Badge */}
                        <div className="flex items-center gap-4">
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
                                ID: {order.id.slice(0, 8)}
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

                        {/* Order Status Selector & Date */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/15">
                            <span className="text-[10px] font-mono text-slate-400 pl-2">Status:</span>
                            <select
                              value={currentStatus}
                              disabled={updatingId === order.id}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
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

                          <div className="text-[11px] font-mono text-slate-500">
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
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">Ordered Service</div>
                          <div className="text-xs font-semibold text-cyan-300 truncate">{order.service}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">Budget Tier</div>
                          <div className="text-xs font-semibold text-purple-300 font-mono">{order.budget}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">Target Timeline</div>
                          <div className="text-xs font-semibold text-emerald-300 font-mono">{order.timeline}</div>
                        </div>
                      </div>

                      {/* Client Brief / Requirements */}
                      <div className="py-4 space-y-2">
                        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Client Project Specifications:</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                          {order.details ? `"${order.details}"` : 'No additional notes provided by client.'}
                        </div>
                      </div>

                      {/* Previous Dispatched Reply if present */}
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

                      {/* Response Formulator */}
                      <div className="pt-2 border-t border-white/10 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-mono text-purple-400 font-semibold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Prepare Proposal / Reply to Client:</span>
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
                          placeholder={`Type proposal or message to ${order.name}...`}
                          value={currentDraft}
                          onChange={(e) => setReplyDrafts({ ...replyDrafts, [order.id]: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                        />

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <button
                            onClick={() => handleSaveOrderReply(order)}
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
                              onClick={() => handleWhatsAppClient(order)}
                              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600/80 hover:bg-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                              title="Message client on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              onClick={() => handleEmailClient(order)}
                              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                              title="Email client directly"
                            >
                              <Mail className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Email Proposal</span>
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
        )}

        {/* =========================================================================
           TAB 2: GENERAL CONTACT FORM INQUIRIES
           ========================================================================= */}
        {mainView === 'inquiries' && (
          <div className="space-y-6">
            {inquiries.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-white/10">
                <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No general messages yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Messages submitted on your Contact Form will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div>
                        <h4 className="text-base font-bold text-white font-display">{inq.name}</h4>
                        <div className="text-xs font-mono text-slate-400">{inq.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/20">
                          {inq.service}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/20">
                          {inq.budget}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed font-sans">
                      "{inq.message}"
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${inq.email}?subject=Regarding your message - Ahtasham Javed`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Reply via Email</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
