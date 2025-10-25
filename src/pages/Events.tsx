import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Plus, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { api } from '../api';
import { useToast } from '../hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  organizer_name: string;
  organizer_email: string;
  image_url?: string;
  max_attendees?: number;
  rsvp_count: number;
  created_at: string;
}

interface EventRSVP {
  id: string;
  event_id: string;
  attendee_name: string;
  attendee_email: string;
  created_at: string;
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<EventRSVP[]>([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    organizer_name: '',
    organizer_email: '',
    max_attendees: ''
  });

  const [rsvpForm, setRsvpForm] = useState({
    attendee_name: '',
    attendee_email: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchRSVPs(selectedEvent.id);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRSVPs = async (eventId: string) => {
    try {
      const response = await api.get(`/api/events/${eventId}/rsvps`);
      setRsvps(response.data);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.description || !newEvent.location || !newEvent.event_date || !newEvent.organizer_name || !newEvent.organizer_email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const eventData = {
        ...newEvent,
        max_attendees: newEvent.max_attendees ? parseInt(newEvent.max_attendees) : null
      };
      await api.post('/api/events', eventData);
      toast({
        title: 'Success',
        description: 'Event created successfully!'
      });
      setNewEvent({ title: '', description: '', location: '', event_date: '', organizer_name: '', organizer_email: '', max_attendees: '' });
      setShowCreateEvent(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive'
      });
    }
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rsvpForm.attendee_name || !rsvpForm.attendee_email) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.post('/api/events/rsvp', {
        event_id: selectedEvent?.id,
        ...rsvpForm
      });
      toast({
        title: 'Success',
        description: 'RSVP confirmed! See you at the event!'
      });
      setRsvpForm({ attendee_name: '', attendee_email: '' });
      if (selectedEvent) {
        const updatedEvent = await api.get(`/api/events/${selectedEvent.id}`);
        setSelectedEvent(updatedEvent.data);
        fetchRSVPs(selectedEvent.id);
      }
    } catch (error: any) {
      console.error('Error creating RSVP:', error);
      const message = error.response?.status === 400 ? 'You have already RSVP\'d or the event is full' : 'Failed to RSVP';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const isEventFull = (event: Event) => {
    return event.max_attendees ? event.rsvp_count >= event.max_attendees : false;
  };

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-brand-ivory">
        <div className="bg-brand-black text-brand-ivory py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              onClick={() => setSelectedEvent(null)}
              className="mb-4 bg-brand-gold text-brand-black hover:bg-brand-gold/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              {selectedEvent.title}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-brand-gold mt-1" />
                  <div>
                    <div className="font-semibold text-brand-black">Date & Time</div>
                    <div className="text-gray-600">{formatDate(selectedEvent.event_date)}</div>
                    <div className="text-gray-600">{formatTime(selectedEvent.event_date)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-gold mt-1" />
                  <div>
                    <div className="font-semibold text-brand-black">Location</div>
                    <div className="text-gray-600">{selectedEvent.location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-brand-gold mt-1" />
                  <div>
                    <div className="font-semibold text-brand-black">Attendees</div>
                    <div className="text-gray-600">
                      {selectedEvent.rsvp_count} {selectedEvent.max_attendees ? `/ ${selectedEvent.max_attendees}` : ''} RSVPs
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-brand-gold mt-1" />
                  <div>
                    <div className="font-semibold text-brand-black">Organizer</div>
                    <div className="text-gray-600">{selectedEvent.organizer_name}</div>
                  </div>
                </div>
              </div>
              
              {isEventFull(selectedEvent) && (
                <Badge className="mb-4 bg-red-500 text-white">Event Full</Badge>
              )}
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-brand-black mb-2">About This Event</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
              </div>
            </CardContent>
          </Card>

          {!isEventFull(selectedEvent) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>RSVP for This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRSVP} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-brand-black mb-2">Your Name</label>
                      <Input
                        placeholder="Enter your name"
                        value={rsvpForm.attendee_name}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, attendee_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-black mb-2">Your Email</label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={rsvpForm.attendee_email}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, attendee_email: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold">
                    Confirm RSVP
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Attendees ({rsvps.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {rsvps.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No RSVPs yet. Be the first to RSVP!</p>
              ) : (
                <div className="space-y-2">
                  {rsvps.map((rsvp) => (
                    <div key={rsvp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-semibold text-brand-black">{rsvp.attendee_name}</span>
                      <span className="text-sm text-gray-600">
                        {new Date(rsvp.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showCreateEvent) {
    return (
      <div className="min-h-screen bg-brand-ivory">
        <div className="bg-brand-black text-brand-ivory py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              onClick={() => setShowCreateEvent(false)}
              className="mb-4 bg-brand-gold text-brand-black hover:bg-brand-gold/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              Create New Event
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">Event Title *</label>
                  <Input
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">Description *</label>
                  <Textarea
                    placeholder="Describe your event..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-black mb-2">Location *</label>
                    <Input
                      placeholder="Event location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-black mb-2">Date & Time *</label>
                    <Input
                      type="datetime-local"
                      value={newEvent.event_date}
                      onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-black mb-2">Your Name *</label>
                    <Input
                      placeholder="Organizer name"
                      value={newEvent.organizer_name}
                      onChange={(e) => setNewEvent({ ...newEvent, organizer_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-black mb-2">Your Email *</label>
                    <Input
                      type="email"
                      placeholder="Organizer email"
                      value={newEvent.organizer_email}
                      onChange={(e) => setNewEvent({ ...newEvent, organizer_email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">Max Attendees (Optional)</label>
                  <Input
                    type="number"
                    placeholder="Leave blank for unlimited"
                    value={newEvent.max_attendees}
                    onChange={(e) => setNewEvent({ ...newEvent, max_attendees: e.target.value })}
                  />
                </div>
                <Button type="submit" className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold">
                  Create Event
                </Button>
              </form>
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
          <div className="flex items-center justify-between">
            <div>
              <Link to="/community" className="text-brand-gold hover:underline mb-2 inline-block">
                ← Back to Community Hub
              </Link>
              <h1 className="text-4xl md:text-5xl font-heading font-bold">
                Events & Networking
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                Discover upcoming events, workshops, and networking opportunities
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-8">
          <Button
            onClick={() => setShowCreateEvent(true)}
            className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand-black mb-2">No upcoming events</h3>
              <p className="text-gray-600 mb-4">Be the first to create an event!</p>
              <Button
                onClick={() => setShowCreateEvent(true)}
                className="bg-brand-gold text-brand-black hover:bg-brand-gold/90"
              >
                Create First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-brand-gold"
                onClick={() => setSelectedEvent(event)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-brand-black hover:text-brand-gold line-clamp-2">
                      {event.title}
                    </h3>
                    {isEventFull(event) && (
                      <Badge className="bg-red-500 text-white text-xs">Full</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-brand-gold" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-brand-gold" />
                      <span>{formatTime(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-brand-gold" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 text-brand-gold" />
                      <span>
                        {event.rsvp_count} {event.max_attendees ? `/ ${event.max_attendees}` : ''} RSVPs
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      Organized by <span className="font-semibold">{event.organizer_name}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
