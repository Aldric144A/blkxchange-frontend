import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Check, X, Clock, BookOpen, Users, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://app-tcqwzext.fly.dev';

interface AIHistory {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  image_url?: string;
  status: string;
  created_at: string;
}

interface AIMentorship {
  id: string;
  mentee_id: string;
  mentee_email: string;
  mentee_skills: string[];
  mentee_interests: string[];
  mentee_industry: string;
  mentor_id?: string;
  match_score?: number;
  status: string;
  created_at: string;
}

interface AIContent {
  id: string;
  content_type: string;
  title: string;
  summary: string;
  full_content: string;
  tags: string[];
  target_audience: string;
  status: string;
  created_at: string;
}

export default function AdminAIContent() {
  const [activeTab, setActiveTab] = useState<'history' | 'mentorship' | 'content'>('history');
  const [historyItems, setHistoryItems] = useState<AIHistory[]>([]);
  const [mentorships, setMentorships] = useState<AIMentorship[]>([]);
  const [contentItems, setContentItems] = useState<AIContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminSecret, setAdminSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated, activeTab]);

  const handleAuth = () => {
    if (adminSecret === 'changeme') {
      setAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid admin password');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      if (activeTab === 'history') endpoint = '/api/ai/history/pending';
      else if (activeTab === 'mentorship') endpoint = '/api/ai/mentorship/pending';
      else if (activeTab === 'content') endpoint = '/api/ai/content/pending';

      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'X-Admin-Secret': adminSecret
        }
      });

      const data = await response.json();

      if (data.success) {
        if (activeTab === 'history') setHistoryItems(data.history || []);
        else if (activeTab === 'mentorship') setMentorships(data.matches || []);
        else if (activeTab === 'content') setContentItems(data.content || []);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, type: 'history' | 'mentorship' | 'content') => {
    try {
      let endpoint = '';
      if (type === 'history') endpoint = `/api/ai/history/${id}/approve`;
      else if (type === 'mentorship') endpoint = `/api/ai/mentorship/${id}/approve`;
      else if (type === 'content') endpoint = `/api/ai/content/${id}/approve`;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': adminSecret
        },
        body: JSON.stringify({
          status: 'approved',
          admin_notes: 'Approved by admin'
        })
      });

      const data = await response.json();

      if (data.success) {
        loadData();
      } else {
        alert('Failed to approve item');
      }
    } catch (err) {
      console.error('Approve error:', err);
      alert('Failed to approve item');
    }
  };

  const handleReject = async (id: string, type: 'history' | 'mentorship' | 'content') => {
    const reason = prompt('Enter rejection reason (optional):');

    try {
      let endpoint = '';
      if (type === 'history') endpoint = `/api/ai/history/${id}/approve`;
      else if (type === 'mentorship') endpoint = `/api/ai/mentorship/${id}/approve`;
      else if (type === 'content') endpoint = `/api/ai/content/${id}/approve`;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': adminSecret
        },
        body: JSON.stringify({
          status: 'rejected',
          admin_notes: reason || 'Rejected by admin'
        })
      });

      const data = await response.json();

      if (data.success) {
        loadData();
      } else {
        alert('Failed to reject item');
      }
    } catch (err) {
      console.error('Reject error:', err);
      alert('Failed to reject item');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-ivory py-12">
        <div className="max-w-md mx-auto px-4">
          <Card className="border-2 border-brand-gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-gold" />
                Admin Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    placeholder="Enter admin password"
                  />
                </div>
                <button
                  onClick={handleAuth}
                  className="w-full bg-brand-gold text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Authenticate
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Sparkles className="w-12 h-12 text-brand-gold" />
            <div>
              <h1 className="text-4xl font-heading font-bold">AI Content Manager</h1>
              <p className="text-xl text-gray-300">Review and approve AI-generated content</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'history'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 hover:text-brand-gold'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              History Content ({historyItems.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('mentorship')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'mentorship'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 hover:text-brand-gold'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Mentorship Matches ({mentorships.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'content'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 hover:text-brand-gold'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Generated Content ({contentItems.length})
            </div>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* History Content Tab */}
            {activeTab === 'history' && (
              <>
                {historyItems.length === 0 ? (
                  <Card className="border-2 border-gray-300">
                    <CardContent className="p-12 text-center">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-600">No pending history content</p>
                    </CardContent>
                  </Card>
                ) : (
                  historyItems.map((item) => (
                    <Card key={item.id} className="border-2 border-gray-300">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="flex items-center justify-between">
                          <span>{item.title}</span>
                          <span className="text-sm font-normal text-gray-500">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Category:</p>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {item.category}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Content:</p>
                            <p className="text-gray-700 leading-relaxed">
                              {item.content.substring(0, 500)}...
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Source:</p>
                            <a
                              href={item.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-gold hover:underline"
                            >
                              {item.source}
                            </a>
                          </div>
                          <div className="flex gap-4 pt-4">
                            <button
                              onClick={() => handleApprove(item.id, 'history')}
                              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                            >
                              <Check className="w-5 h-5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(item.id, 'history')}
                              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                            >
                              <X className="w-5 h-5" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </>
            )}

            {/* Mentorship Matches Tab */}
            {activeTab === 'mentorship' && (
              <>
                {mentorships.length === 0 ? (
                  <Card className="border-2 border-gray-300">
                    <CardContent className="p-12 text-center">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-600">No pending mentorship matches</p>
                    </CardContent>
                  </Card>
                ) : (
                  mentorships.map((match) => (
                    <Card key={match.id} className="border-2 border-gray-300">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="flex items-center justify-between">
                          <span>Mentorship Match Request</span>
                          <span className="text-sm font-normal text-gray-500">
                            {new Date(match.created_at).toLocaleDateString()}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Mentee Email:</p>
                            <p className="text-gray-700">{match.mentee_email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Industry:</p>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {match.mentee_industry}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {match.mentee_skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Interests:</p>
                            <div className="flex flex-wrap gap-2">
                              {match.mentee_interests.map((interest, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-4 pt-4">
                            <button
                              onClick={() => handleApprove(match.id, 'mentorship')}
                              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                            >
                              <Check className="w-5 h-5" />
                              Approve Match
                            </button>
                            <button
                              onClick={() => handleReject(match.id, 'mentorship')}
                              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                            >
                              <X className="w-5 h-5" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </>
            )}

            {/* Generated Content Tab */}
            {activeTab === 'content' && (
              <>
                {contentItems.length === 0 ? (
                  <Card className="border-2 border-gray-300">
                    <CardContent className="p-12 text-center">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-600">No pending generated content</p>
                    </CardContent>
                  </Card>
                ) : (
                  contentItems.map((content) => (
                    <Card key={content.id} className="border-2 border-gray-300">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="flex items-center justify-between">
                          <span>{content.title}</span>
                          <span className="text-sm font-normal text-gray-500">
                            {new Date(content.created_at).toLocaleDateString()}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Content Type:</p>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                              {content.content_type}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Summary:</p>
                            <p className="text-gray-700">{content.summary}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Full Content:</p>
                            <p className="text-gray-700 leading-relaxed">{content.full_content}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Tags:</p>
                            <div className="flex flex-wrap gap-2">
                              {content.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-4 pt-4">
                            <button
                              onClick={() => handleApprove(content.id, 'content')}
                              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                            >
                              <Check className="w-5 h-5" />
                              Approve & Publish
                            </button>
                            <button
                              onClick={() => handleReject(content.id, 'content')}
                              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                            >
                              <X className="w-5 h-5" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
