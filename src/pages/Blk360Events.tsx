import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, DollarSign, Award } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_time: string;
  end_time: string;
  rsvp_count: number;
  rsvp_limit: number | null;
  ticket_price: number;
  image_url: string | null;
  is_volunteer_event: boolean;
  blkcoin_reward: number;
  created_at: string;
}

const Blk360Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [filter, upcomingOnly]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('category', filter);
      params.append('upcoming_only', upcomingOnly.toString());
      
      const response = await fetch(`${API_URL}/api/events?${params}`);
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  const categories = ['all', 'community', 'education', 'networking', 'fundraising', 'volunteer', 'cultural'];

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C5A14E] mb-4">
            BlkXchange 360™ Events
          </h1>
          <p className="text-xl text-gray-300">
            Connect, Learn, and Grow with Our Community
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === cat
                    ? 'bg-[#C5A14E] text-black'
                    : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={upcomingOnly}
              onChange={(e) => setUpcomingOnly(e.target.checked)}
              className="w-4 h-4"
            />
            Upcoming Only
          </label>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A14E]"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-[#2A2A2A] rounded-xl">
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-[#2A2A2A] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-[#C5A14E]/20 transition-all border border-[#3A3A3A]"
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-[#C5A14E] text-black text-sm font-semibold rounded-full">
                      {event.category}
                    </span>
                    {event.is_volunteer_event && (
                      <span className="px-3 py-1 bg-emerald-600 text-white text-sm font-semibold rounded-full">
                        Volunteer
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[#C5A14E] mb-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C5A14E]" />
                      <span>{formatDate(event.start_time)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C5A14E]" />
                      <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C5A14E]" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C5A14E]" />
                      <span>
                        {event.rsvp_count} {event.rsvp_limit ? `/ ${event.rsvp_limit}` : ''} RSVPs
                      </span>
                    </div>

                    {event.ticket_price > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#C5A14E]" />
                        <span>${event.ticket_price.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#C5A14E]" />
                      <span>{event.blkcoin_reward} BlkCoins</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-[#C5A14E] text-black font-bold py-3 rounded-lg hover:bg-[#D4B15F] transition-colors">
                    RSVP Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blk360Events;
