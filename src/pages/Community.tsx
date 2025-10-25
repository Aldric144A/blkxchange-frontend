import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, HelpCircle, Briefcase, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export function Community() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Forum & Discussions',
      description: 'Connect with entrepreneurs, share insights, and discuss topics from business to culture.',
      link: '/community/forum',
      color: 'bg-blue-500'
    },
    {
      icon: Calendar,
      title: 'Events & Networking',
      description: 'Discover upcoming events, workshops, and networking opportunities in your area.',
      link: '/community/events',
      color: 'bg-green-500'
    },
    {
      icon: HelpCircle,
      title: 'Q&A Hub',
      description: 'Ask questions, get expert answers, and help others in the community.',
      link: '/community/questions',
      color: 'bg-purple-500'
    },
    {
      icon: Briefcase,
      title: 'Find Services',
      description: 'Post your service needs and get matched with qualified Black professionals.',
      link: '/community/leads',
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Active Members', value: '10,000+', icon: Users },
    { label: 'Forum Posts', value: '5,000+', icon: MessageSquare },
    { label: 'Events Hosted', value: '500+', icon: Calendar },
    { label: 'Questions Answered', value: '2,500+', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-gradient-to-r from-brand-black to-brand-charcoal text-brand-ivory py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Community Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Connect, collaborate, and grow with the BlkXchange™ community. Share knowledge, find opportunities, and build lasting relationships.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 border-brand-gold/20 hover:border-brand-gold transition-colors">
              <CardContent className="p-6 text-center">
                <stat.icon className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                <div className="text-3xl font-bold text-brand-black mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-gray-200 hover:border-brand-gold hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-brand-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <Link to={feature.link}>
                  <Button className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 border-2 border-brand-gold">
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-12 h-12 text-brand-gold mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-brand-black mb-4">
              Join the Movement
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
              Be part of a thriving community of Black entrepreneurs, professionals, and supporters building the digital Black Wall Street.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/community/forum">
                <Button className="bg-brand-black text-white hover:bg-brand-charcoal font-semibold px-8">
                  Start a Discussion
                </Button>
              </Link>
              <Link to="/community/events">
                <Button className="bg-white text-brand-black border-2 border-brand-black hover:bg-gray-50 font-semibold px-8">
                  Browse Events
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
