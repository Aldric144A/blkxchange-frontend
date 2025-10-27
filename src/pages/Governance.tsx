import { useState, useEffect } from 'react';
import { 
  Vote, Users, CheckCircle, XCircle, Clock, 
  AlertCircle, FileText, Calendar, Target
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Proposal {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  created_by: string;
  created_at: string;
  deadline: string;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  total_votes: number;
  quorum_required: number;
  user_vote?: 'for' | 'against' | 'abstain';
}

const Governance = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);

  const [newProposal, setNewProposal] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'platform',
  });

  const categories = [
    { id: 'platform', label: 'Platform Improvements' },
    { id: 'community', label: 'Community Initiatives' },
    { id: 'financial', label: 'Financial Decisions' },
    { id: 'policy', label: 'Policy Changes' },
    { id: 'partnership', label: 'Partnerships' },
  ];

  useEffect(() => {
    fetchProposals();
  }, [filterStatus]);

  const fetchProposals = async () => {
    try {
      const url = filterStatus === 'all'
        ? `${API_URL}/api/blk360/governance/proposals`
        : `${API_URL}/api/blk360/governance/proposals?status=${filterStatus}`;
      const response = await axios.get(url);
      setProposals(response.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setProposals([
        {
          id: '1',
          title: 'Reduce Platform Fee to 12%',
          summary: 'Proposal to reduce the platform fee from 15% to 12% to support vendor growth.',
          description: 'This proposal aims to make BlkXchange™ more competitive by reducing our platform fee. The reduction would be offset by increased transaction volume and community growth.',
          category: 'financial',
          status: 'active',
          created_by: 'Dr. Aldric Marshall',
          created_at: new Date().toISOString(),
          deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
          votes_for: 127,
          votes_against: 23,
          votes_abstain: 8,
          total_votes: 158,
          quorum_required: 100,
        },
        {
          id: '2',
          title: 'Launch Mobile App Development',
          summary: 'Approve budget for native iOS and Android app development.',
          description: 'To expand our reach and improve user experience, we propose developing native mobile applications for iOS and Android platforms. Estimated budget: $150,000.',
          category: 'platform',
          status: 'active',
          created_by: 'Community Member',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
          votes_for: 89,
          votes_against: 12,
          votes_abstain: 5,
          total_votes: 106,
          quorum_required: 100,
        },
        {
          id: '3',
          title: 'Partner with HBCU Business Programs',
          summary: 'Establish formal partnerships with 10 HBCU business schools.',
          description: 'Create a structured program to connect HBCU business students with vendors on our platform for internships, mentorship, and career opportunities.',
          category: 'partnership',
          status: 'passed',
          created_by: 'Education Committee',
          created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
          deadline: new Date(Date.now() - 7 * 86400000).toISOString(),
          votes_for: 201,
          votes_against: 15,
          votes_abstain: 10,
          total_votes: 226,
          quorum_required: 100,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
    try {
      await axios.post(`${API_URL}/api/blk360/governance/proposals/${proposalId}/vote`, {
        vote,
        user_id: 'demo-user', // TODO: Replace with actual user ID
      });
      alert('Vote recorded successfully!');
      fetchProposals();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Vote recorded! (Demo mode)');
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          const updated = { ...p };
          if (vote === 'for') updated.votes_for++;
          else if (vote === 'against') updated.votes_against++;
          else updated.votes_abstain++;
          updated.total_votes++;
          updated.user_vote = vote;
          return updated;
        }
        return p;
      }));
    }
  };

  const handleSubmitProposal = async () => {
    try {
      await axios.post(`${API_URL}/api/blk360/governance/proposals`, {
        ...newProposal,
        created_by: 'demo-user', // TODO: Replace with actual user
      });
      alert('Proposal submitted successfully!');
      setShowNewProposalModal(false);
      setNewProposal({ title: '', summary: '', description: '', category: 'platform' });
      fetchProposals();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Proposal submitted! (Demo mode)');
      setShowNewProposalModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'emerald';
      case 'passed': return 'green';
      case 'rejected': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Clock;
      case 'passed': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return AlertCircle;
      default: return FileText;
    }
  };

  const calculateVotePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading Governance...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 border-b border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Vote className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              BlkDAO Governance
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mb-6">
            Community-driven decision making for the future of BlkXchange™.
          </p>
          <button
            onClick={() => setShowNewProposalModal(true)}
            className="bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Submit New Proposal
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3">
          {['all', 'active', 'passed', 'rejected', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 capitalize ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-emerald-600 to-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {proposals.map((proposal) => {
            const StatusIcon = getStatusIcon(proposal.status);
            const statusColor = getStatusColor(proposal.status);
            const forPercentage = calculateVotePercentage(proposal.votes_for, proposal.total_votes);
            const againstPercentage = calculateVotePercentage(proposal.votes_against, proposal.total_votes);
            const abstainPercentage = calculateVotePercentage(proposal.votes_abstain, proposal.total_votes);
            const quorumMet = proposal.total_votes >= proposal.quorum_required;

            return (
              <div
                key={proposal.id}
                className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{proposal.title}</h3>
                      <span className={`flex items-center gap-1 bg-${statusColor}-600 text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                        <StatusIcon className="w-3 h-3" />
                        {proposal.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">{proposal.summary}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{proposal.created_by}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline: {new Date(proposal.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span className={quorumMet ? 'text-emerald-400' : 'text-yellow-400'}>
                          {proposal.total_votes}/{proposal.quorum_required} votes (Quorum {quorumMet ? 'Met' : 'Needed'})
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold ml-4">
                    {categories.find(c => c.id === proposal.category)?.label}
                  </span>
                </div>

                {/* Vote Breakdown */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Vote Distribution</span>
                    <span className="text-sm text-gray-400">{proposal.total_votes} total votes</span>
                  </div>
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-gray-800">
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${forPercentage}%` }}
                      title={`For: ${forPercentage}%`}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${againstPercentage}%` }}
                      title={`Against: ${againstPercentage}%`}
                    />
                    <div
                      className="bg-gray-500"
                      style={{ width: `${abstainPercentage}%` }}
                      title={`Abstain: ${abstainPercentage}%`}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-emerald-400">For: {proposal.votes_for} ({forPercentage}%)</span>
                    <span className="text-red-400">Against: {proposal.votes_against} ({againstPercentage}%)</span>
                    <span className="text-gray-400">Abstain: {proposal.votes_abstain} ({abstainPercentage}%)</span>
                  </div>
                </div>

                {/* Voting Buttons */}
                {proposal.status === 'active' && !proposal.user_vote && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVote(proposal.id, 'for')}
                      className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Vote For
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, 'against')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Vote Against
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, 'abstain')}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Abstain
                    </button>
                  </div>
                )}

                {proposal.user_vote && (
                  <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-3 text-center">
                    <span className="text-emerald-400 font-semibold">
                      You voted: {proposal.user_vote.toUpperCase()}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setSelectedProposal(proposal)}
                  className="w-full mt-3 bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
                >
                  View Full Details
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Proposal Modal */}
      {showNewProposalModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border-2 border-emerald-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Submit New Proposal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
                  placeholder="Brief, descriptive title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={newProposal.category}
                  onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Summary * (1-2 sentences)
                </label>
                <textarea
                  value={newProposal.summary}
                  onChange={(e) => setNewProposal({ ...newProposal, summary: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
                  rows={2}
                  placeholder="Brief summary of your proposal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Description *
                </label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
                  rows={6}
                  placeholder="Detailed explanation of your proposal, including rationale and expected impact"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitProposal}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Submit Proposal
                </button>
                <button
                  onClick={() => setShowNewProposalModal(false)}
                  className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-3xl w-full border-2 border-emerald-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-white mb-4">{selectedProposal.title}</h2>
            <div className="flex items-center gap-3 mb-6">
              <span className={`bg-${getStatusColor(selectedProposal.status)}-600 text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                {selectedProposal.status}
              </span>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm font-semibold">
                {categories.find(c => c.id === selectedProposal.category)?.label}
              </span>
            </div>
            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-gray-300 text-lg mb-4">{selectedProposal.summary}</p>
              <p className="text-gray-400">{selectedProposal.description}</p>
            </div>
            <button
              onClick={() => setSelectedProposal(null)}
              className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Governance;
