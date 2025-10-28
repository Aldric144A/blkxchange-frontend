import { useState, useEffect } from 'react';
import { GraduationCap, DollarSign, Users, Calendar, Award, Send } from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  goal_category: string;
  requirements: string;
  eligibility_criteria: string;
  status: string;
  total_raised: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export default function ScholarshipPortal() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [formData, setFormData] = useState({
    user_id: 'demo-user-001',
    scholarship_id: '',
    applicant_name: '',
    email: '',
    phone: '',
    essay: '',
    goal_category: 'education',
    amount_requested: 0,
    additional_info: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const res = await fetch(`${API_URL}/api/scholarships?status=open`);
      if (res.ok) {
        const data = await res.json();
        setScholarships(data);
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setFormData({
      ...formData,
      scholarship_id: scholarship.id,
      amount_requested: scholarship.amount
    });
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${API_URL}/api/scholarships/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Application submitted successfully! You earned 15 BlkCoins!');
        setShowApplicationForm(false);
        setFormData({
          user_id: 'demo-user-001',
          scholarship_id: '',
          applicant_name: '',
          email: '',
          phone: '',
          essay: '',
          goal_category: 'education',
          amount_requested: 0,
          additional_info: ''
        });
        fetchScholarships();
      } else {
        const error = await res.json();
        alert(`Error: ${error.detail || 'Failed to submit application'}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      education: 'bg-blue-500',
      entrepreneurship: 'bg-green-500',
      technology: 'bg-purple-500',
      arts_culture: 'bg-pink-500',
      community_service: 'bg-yellow-500',
      healthcare: 'bg-red-500',
      other: 'bg-gray-500'
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-[#C5A14E] text-xl">Loading scholarships...</div>
      </div>
    );
  }

  if (showApplicationForm && selectedScholarship) {
    return (
      <div className="min-h-screen bg-[#111111] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowApplicationForm(false)}
            className="text-[#C5A14E] hover:text-white mb-6 flex items-center gap-2"
          >
            ← Back to Scholarships
          </button>

          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-[#C5A14E] mb-2">
              Apply for {selectedScholarship.title}
            </h2>
            <p className="text-white/80 mb-8">${selectedScholarship.amount.toLocaleString()} Award</p>

            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div>
                <label className="block text-[#C5A14E] font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#C5A14E] font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[#C5A14E] font-semibold mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C5A14E] font-semibold mb-2">
                  Goal Category *
                </label>
                <select
                  required
                  value={formData.goal_category}
                  onChange={(e) => setFormData({ ...formData, goal_category: e.target.value })}
                  className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
                >
                  <option value="education">Education</option>
                  <option value="entrepreneurship">Entrepreneurship</option>
                  <option value="technology">Technology</option>
                  <option value="arts_culture">Arts & Culture</option>
                  <option value="community_service">Community Service</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[#C5A14E] font-semibold mb-2">
                  Essay (500-1000 words) *
                </label>
                <textarea
                  required
                  value={formData.essay}
                  onChange={(e) => setFormData({ ...formData, essay: e.target.value })}
                  rows={12}
                  className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
                  placeholder="Tell us about your goals, achievements, and why you deserve this scholarship..."
                />
                <div className="text-white/60 text-sm mt-2">
                  {formData.essay.split(' ').filter(w => w).length} words
                </div>
              </div>

              <div>
                <label className="block text-[#C5A14E] font-semibold mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={formData.additional_info}
                  onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                  rows={4}
                  className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#C5A14E] hover:bg-[#8B7355] text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-6 py-4 border border-[#C5A14E]/30 text-[#C5A14E] hover:bg-[#C5A14E]/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C5A14E] mb-4">
            BlkXchange™ Scholarship Portal
          </h1>
          <p className="text-white text-lg max-w-3xl mx-auto">
            Empowering the next generation of Black leaders, entrepreneurs, and innovators through community-funded scholarships
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 p-6 rounded-xl text-center">
            <GraduationCap className="w-10 h-10 text-[#C5A14E] mx-auto mb-3" />
            <div className="text-white text-3xl font-bold">{scholarships.length}</div>
            <div className="text-white/60 text-sm">Open Scholarships</div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 p-6 rounded-xl text-center">
            <DollarSign className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <div className="text-white text-3xl font-bold">
              ${scholarships.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Total Available</div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 p-6 rounded-xl text-center">
            <Users className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <div className="text-white text-3xl font-bold">
              {scholarships.reduce((sum, s) => sum + s.applications_count, 0)}
            </div>
            <div className="text-white/60 text-sm">Applications</div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 p-6 rounded-xl text-center">
            <Award className="w-10 h-10 text-purple-500 mx-auto mb-3" />
            <div className="text-white text-3xl font-bold">
              ${scholarships.reduce((sum, s) => sum + s.total_raised, 0).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Funds Raised</div>
          </div>
        </div>

        {scholarships.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No open scholarships at this time.</p>
            <p className="mt-2">Check back soon for new opportunities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {scholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="bg-[#1A1A1A] border border-[#C5A14E]/30 rounded-xl p-8 hover:border-[#C5A14E] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#C5A14E] mb-2">
                      {scholarship.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`${getCategoryColor(scholarship.goal_category)} text-white text-xs px-3 py-1 rounded-full`}>
                        {scholarship.goal_category.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-500">
                      ${scholarship.amount.toLocaleString()}
                    </div>
                    <div className="text-white/60 text-sm">Award Amount</div>
                  </div>
                </div>

                <p className="text-white/80 mb-6 line-clamp-3">
                  {scholarship.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Deadline: {formatDate(scholarship.deadline)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {scholarship.applications_count} applications submitted
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">
                      ${scholarship.total_raised.toLocaleString()} raised of ${scholarship.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#111111] rounded-full h-2 mb-6">
                  <div
                    className="bg-[#C5A14E] h-2 rounded-full"
                    style={{
                      width: `${Math.min((scholarship.total_raised / scholarship.amount) * 100, 100)}%`
                    }}
                  />
                </div>

                <button
                  onClick={() => handleApply(scholarship)}
                  className="w-full bg-[#C5A14E] hover:bg-[#8B7355] text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
