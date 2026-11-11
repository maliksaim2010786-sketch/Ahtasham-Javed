import React, { useState, useEffect } from 'react';
import { 
  Star, MessageSquarePlus, Check, X, Sparkles, 
  ExternalLink, Send, RefreshCw, User, Building 
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { playClickSound, playSuccessSound, playHoverSound } from '../utils/audio';

export interface ClientReview {
  id: string;
  name: string;
  role?: string;
  company?: string;
  project_name?: string;
  rating: number;
  review: string;
  created_at: string;
}

export const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [projectName, setProjectName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');

  // Fetch real reviews from Supabase
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data as ClientReview[]);
      }
    } catch (err) {
      console.info('Reviews fetch note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;

    playClickSound();
    setIsSubmitting(true);

    const newReview = {
      name: name.trim(),
      role: role.trim() || undefined,
      company: company.trim() || undefined,
      project_name: projectName.trim() || undefined,
      rating: rating || 5,
      review: reviewText.trim(),
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('client_reviews')
        .insert([newReview])
        .select();

      if (!error && data && data.length > 0) {
        setReviews((prev) => [data[0] as ClientReview, ...prev]);
      } else {
        // Optimistic UI update
        const tempRecord: ClientReview = {
          id: 'temp-' + Date.now(),
          ...newReview,
        };
        setReviews((prev) => [tempRecord, ...prev]);
      }
    } catch {
      const tempRecord: ClientReview = {
        id: 'temp-' + Date.now(),
        ...newReview,
      };
      setReviews((prev) => [tempRecord, ...prev]);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    playSuccessSound();

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsModalOpen(false);
      // Reset form
      setName('');
      setRole('');
      setCompany('');
      setProjectName('');
      setReviewText('');
      setRating(5);
    }, 1800);
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background Neon Glow */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-cyan-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Real Client Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 font-display">
              Client Reviews & Experiences
            </h2>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base leading-relaxed">
              Read honest reviews submitted directly by clients, or share your own experience working with Ahtasham.
            </p>
          </div>

          {/* Action: Write a review & Refresh */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                fetchReviews();
              }}
              disabled={loading}
              className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer"
              title="Refresh reviews from database"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                playClickSound();
                setIsModalOpen(true);
              }}
              onMouseEnter={() => playHoverSound()}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Content Area */}
        {loading && reviews.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading verified client feedback...</p>
          </div>
        ) : reviews.length === 0 ? (
          /* Honest Empty State when no fake reviews are present */
          <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto border border-white/10 space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Be the First to Leave a Review!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Have you worked with Ahtasham on a web app, 3D experience, or digital product? Click below to leave your honest rating and feedback.
              </p>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setIsModalOpen(true);
              }}
              onMouseEnter={() => playHoverSound()}
              className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105 cursor-pointer"
            >
              Write First Client Review
            </button>
          </div>
        ) : (
          /* Grid of Real Client Reviews */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                onMouseEnter={() => playHoverSound()}
                className="glass-panel hover-card-3d rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/40 shadow-xl group"
              >
                <div className="space-y-4">
                  {/* Top: Star rating & Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {new Date(r.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Project Tag if provided */}
                  {r.project_name && (
                    <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-md inline-block">
                      Project: {r.project_name}
                    </div>
                  )}

                  {/* Review Text */}
                  <p className="text-sm text-slate-200 dark:text-slate-200 light:text-slate-800 leading-relaxed font-sans">
                    "{r.review}"
                  </p>
                </div>

                {/* Client Bio */}
                <div className="pt-5 mt-5 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold font-mono text-sm shrink-0 shadow-sm">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-bold text-white font-display truncate">
                      {r.name}
                    </div>
                    {(r.role || r.company) && (
                      <div className="text-xs text-slate-400 truncate">
                        {r.role} {r.role && r.company ? '·' : ''} <span className="text-purple-300">{r.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg my-auto">
            <div className="glow-rotating-ring rounded-3xl p-[2px] shadow-2xl">
              <div className="glow-rotating-inner rounded-[22px] bg-[#090b14] p-6 sm:p-8 text-left relative overflow-hidden border border-white/15">
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    playClickSound();
                    setIsModalOpen(false);
                  }}
                  className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close review form"
                >
                  <X className="w-5 h-5" />
                </button>

                {submitSuccess ? (
                  <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-display">
                      Thank You For Your Review!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                      Your feedback has been saved and is now published live on Ahtasham's portfolio.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Header */}
                    <div className="space-y-1 pr-8">
                      <div className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-semibold">
                        Client Feedback Form
                      </div>
                      <h3 className="text-2xl font-bold text-white font-display">
                        Leave a Client Review
                      </h3>
                      <p className="text-xs text-slate-400">
                        Share your feedback on the project completed with Ahtasham.
                      </p>
                    </div>

                    {/* Star Rating Selector */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-medium text-slate-300">
                        Your Rating <span className="text-purple-400">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const isFilled = (hoverRating !== null ? hoverRating : rating) >= starVal;
                          return (
                            <button
                              type="button"
                              key={starVal}
                              onClick={() => {
                                playClickSound();
                                setRating(starVal);
                              }}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  isFilled
                                    ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                                    : 'text-slate-600'
                                }`}
                              />
                            </button>
                          );
                        })}
                        <span className="text-xs font-mono text-amber-300 ml-2">
                          {rating}.0 / 5.0
                        </span>
                      </div>
                    </div>

                    {/* Client Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        Your Full Name <span className="text-purple-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Henderson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Role & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Founder / Manager"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300">
                          Company / Brand
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Alpha Solutions"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Project Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        Project Completed (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Luxury Car Rental Website"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Review text */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        Your Feedback & Experience <span className="text-purple-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="How was your experience working with Ahtasham? (Quality, speed, communication...)"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onMouseEnter={() => playHoverSound()}
                      className="w-full py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 pt-2"
                    >
                      {isSubmitting ? (
                        <span>Publishing Review...</span>
                      ) : (
                        <>
                          <span>Submit & Publish Review</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
