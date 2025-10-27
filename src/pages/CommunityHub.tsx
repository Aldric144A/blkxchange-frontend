import { useState, useEffect } from 'react';
import { 
  MessageSquare, Users, Calendar, Heart, Share2, 
  MapPin, Clock, Filter, Star
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface FeedItem {
  id: string;
  type: 'legacy' | 'forum' | 'wealth' | 'event';
  title: string;
  content: string;
  author: string;
  timestamp: string;
  category: string;
  likes: number;
  comments: number;
  featured?: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image_url?: string;
  rsvp_count: number;
  status: 'upcoming' | 'ongoing' | 'past';
}

const CommunityHub = () => {
  const [activeView, setActiveView] = useState<'feed' | 'events'>('feed');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'liked' | 'featured'>('recent');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [calendarView, setCalendarView] = useState<'month' | 'list'>('list');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'business', label: 'Business' },
    { id: 'education', label: 'Education' },
    { id: 'faith', label: 'Faith' },
    { id: 'community', label: 'Community' },
    { id: 'culture', label: 'Culture' },
  ];

  useEffect(() => {
    fetchFeed();
    fetchEvents();
  }, [sortBy, filterCategory]);

  const fetchFeed = async () => {
    try {
      const [legacyRes, forumRes, wealthRes] = await Promise.all([
        axios.get(`${API_URL}/api/blk360/legacy-wall`),
        axios.get(`${API_URL}/api/blk360/forum-posts`),
        axios.get(`${API_URL}/api/blk360/wealth-hub/modules`),
      ]);

      const combined: FeedItem[] = [
        ...legacyRes.data.map((item: any) => ({
          id: item.id,
          type: 'legacy' as const,
          title: item.title,
          content: item.story,
          author: item.author_name,
          timestamp: item.created_at,
          category: 'Legacy',
          likes: item.likes || 0,
          comments: 0,
          featured: item.featured,
        })),
        ...forumRes.data.map((item: any) => ({
          id: item.id,
          type: 'forum' as const,
          title: item.title,
          content: item.content,
          author: item.author_name,
          timestamp: item.created_at,
          category: item.category,
          likes: 0,
          comments: item.reply_count || 0,
        })),
        ...wealthRes.data.map((item: any) => ({
          id: item.id,
          type: 'wealth' as const,
          title: item.title,
          content: item.description,
          author: 'BlkXchange 360',
          timestamp: item.created_at,
          category: 'Wealth Hub',
          likes: 0,
          comments: 0,
        })),
      ];

      let sorted = [...combined];
      if (sortBy === 'recent') {
        sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } else if (sortBy === 'liked') {
        sorted.sort((a, b) => b.likes - a.likes);
      } else if (sortBy === 'featured') {
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }

      if (filterCategory !== 'all') {
        sorted = sorted.filter(item => 
          item.category.toLowerCase() === filterCategory.toLowerCase()
        );
      }

      setFeedItems(sorted);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blk360/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleLike = async (itemId: string) => {
    setFeedItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  const handleShare = (item: FeedItem) => {
    const url = `${window.location.origin}/blkxchange360/community-hub/${item.type}/${item.id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleRSVP = async (eventId: string) => {
    try {
      await axios.post(`${API_URL}/api/blk360/events/${eventId}/rsvp`);
      alert('RSVP confirmed!');
      fetchEvents();
    } catch (error) {
      console.error('Error RSVPing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading Community Hub...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 border-b border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              Community Hub
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Your digital community center for collaboration, networking, and empowerment.
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveView('feed')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'feed'
                ? 'bg-gradient-to-r from-emerald-600 to-yellow-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <MessageSquare className="w-5 h-5 inline mr-2" />
            Community Feed
          </button>
          <button
            onClick={() => setActiveView('events')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'events'
                ? 'bg-gradient-to-r from-emerald-600 to-yellow-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Events
          </button>
        </div>
      </div>

      {/* Feed View */}
      {activeView === 'feed' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex gap-2">
              <Filter className="w-5 h-5 text-gray-400 mt-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="liked">Most Liked</option>
                <option value="featured">Featured</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    filterCategory === cat.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feed Items */}
          <div className="space-y-6">
            {feedItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className={`bg-gray-900 rounded-xl p-6 border-2 ${
                  item.featured ? 'border-yellow-500' : 'border-gray-700'
                } hover:border-emerald-500 transition-all duration-300`}
              >
                {item.featured && (
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-500 text-sm font-semibold">Featured</span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 mb-3 line-clamp-3">{item.content}</p>
                  </div>
                  <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold ml-4">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    {item.comments > 0 && (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>{item.comments} comments</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span>{item.likes}</span>
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      className="flex items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events View */}
      {activeView === 'events' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Calendar View Toggle */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setCalendarView('list')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                calendarView === 'list'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setCalendarView('month')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                calendarView === 'month'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Calendar View
            </button>
          </div>

          {/* Events List */}
          {calendarView === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300"
                >
                  {event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white flex-1">{event.title}</h3>
                      <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{event.rsvp_count} attending</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRSVP(event.id)}
                          className="bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                        >
                          RSVP
                        </button>
                        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300">
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Calendar View Placeholder */}
          {calendarView === 'month' && (
            <div className="bg-gray-900 rounded-xl p-8 border-2 border-gray-700 text-center">
              <Calendar className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Calendar View Coming Soon</h3>
              <p className="text-gray-400">
                Full calendar integration with month/week views will be available in the next update.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Private Groups Teaser */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border-2 border-purple-700 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Private Groups</h3>
          <p className="text-gray-300 mb-6">
            Create and join exclusive groups for focused discussions and collaboration.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
