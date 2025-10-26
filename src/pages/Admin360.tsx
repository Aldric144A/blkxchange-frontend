import { Sparkles, Users, TrendingUp, Award, BookOpen, MessageCircle } from 'lucide-react';

export default function Admin360() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#C5A14E] flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            BlkXchange 360 Manager
          </h1>
          <p className="text-white/70 mt-2">
            Manage premium features, memberships, and 360 content
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-br from-[#00A86B] to-[#023020] rounded-2xl p-8 border-2 border-[#C5A14E]">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-[#C5A14E] mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-4">
            BlkXchange 360 Management Dashboard
          </h2>
          <p className="text-xl text-white/90 mb-6">
            Coming in Phase 2 Development
          </p>
          <p className="text-white/80 max-w-2xl mx-auto">
            This admin panel will allow you to manage premium memberships, content for the 
            Learning & Wealth Hub, Legacy Wall submissions, History Window articles, and 
            Community Forum moderation.
          </p>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#1A1A1A] border-2 border-[#C5A14E]/30 rounded-xl p-6">
          <Users className="w-10 h-10 text-[#C5A14E] mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Membership Management</h3>
          <p className="text-white/70">
            Manage Free, Premium ($9.99/mo), and Elite ($99/mo) memberships. 
            View subscriber analytics and billing.
          </p>
          <span className="inline-block mt-4 text-[#C5A14E] text-sm font-semibold">
            Phase 2
          </span>
        </div>

        <div className="bg-[#1A1A1A] border-2 border-[#C5A14E]/30 rounded-xl p-6">
          <TrendingUp className="w-10 h-10 text-[#C5A14E] mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Wealth Hub Content</h3>
          <p className="text-white/70">
            Upload courses, financial tools, and resources for the Learning & Wealth Hub.
          </p>
          <span className="inline-block mt-4 text-[#C5A14E] text-sm font-semibold">
            Phase 2
          </span>
        </div>

        <div className="bg-[#1A1A1A] border-2 border-[#C5A14E]/30 rounded-xl p-6">
          <Award className="w-10 h-10 text-[#C5A14E] mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Legacy Wall Moderation</h3>
          <p className="text-white/70">
            Review and approve user-submitted legacy stories and tributes.
          </p>
          <span className="inline-block mt-4 text-[#C5A14E] text-sm font-semibold">
            Phase 2
          </span>
        </div>

        <div className="bg-[#1A1A1A] border-2 border-[#C5A14E]/30 rounded-xl p-6">
          <BookOpen className="w-10 h-10 text-[#C5A14E] mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">History Window Content</h3>
          <p className="text-white/70">
            Curate and publish historical articles about Black Wall Street and beyond.
          </p>
          <span className="inline-block mt-4 text-[#C5A14E] text-sm font-semibold">
            Phase 2
          </span>
        </div>

        <div className="bg-[#1A1A1A] border-2 border-[#C5A14E]/30 rounded-xl p-6">
          <MessageCircle className="w-10 h-10 text-[#C5A14E] mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Community Forum</h3>
          <p className="text-white/70">
            Moderate discussions, manage user permissions, and foster engagement.
          </p>
          <span className="inline-block mt-4 text-[#C5A14E] text-sm font-semibold">
            Phase 2
          </span>
        </div>

        <div className="bg-[#1A1A1A] border-2 border-[#C5A14E]/30 rounded-xl p-6">
          <Sparkles className="w-10 h-10 text-[#C5A14E] mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
          <p className="text-white/70">
            Track 360 engagement, revenue, and user growth metrics.
          </p>
          <span className="inline-block mt-4 text-[#C5A14E] text-sm font-semibold">
            Phase 2
          </span>
        </div>
      </div>

      {/* Status Info */}
      <div className="bg-[#1A1A1A] border border-[#C5A14E]/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Development Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Phase 1: Portal & Framework</span>
            <span className="bg-[#00A86B] text-white px-3 py-1 rounded-full text-sm font-semibold">
              ✓ Complete
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">Phase 2: Premium Features</span>
            <span className="bg-[#C5A14E] text-black px-3 py-1 rounded-full text-sm font-semibold">
              In Planning
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">Phase 3: Stripe Integration</span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Upcoming
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
