import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Calendar, Users, Info } from 'lucide-react';

export default function AdminCommunityEvents() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Globe className="w-12 h-12 text-brand-gold" />
            <div>
              <h1 className="text-4xl font-heading font-bold">Community & Events Management</h1>
              <p className="text-xl text-gray-300">Manage community features and events</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-brand-gold">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-yellow-600">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Info className="w-6 h-6" />
              Coming in Phase 3
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">
                  Community & Events Management Dashboard
                </h3>
                <p className="text-emerald-800 mb-4">
                  This comprehensive management system is currently under development and will include:
                </p>
                <ul className="space-y-3 text-emerald-700">
                  <li className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Event Creation & Management:</strong> Create, schedule, and manage community events with RSVP tracking, capacity limits, and automated reminders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Partner Onboarding:</strong> Streamlined process for vetting and onboarding community partners, nonprofits, and collaborators</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Nonprofit Integration:</strong> Direct integration with nonprofit organizations for fundraising campaigns, volunteer coordination, and impact tracking</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
                <h3 className="text-lg font-bold text-yellow-900 mb-2">
                  Expected Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-800">
                  <div>
                    <h4 className="font-semibold mb-2">Event Management</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Event calendar view</li>
                      <li>RSVP tracking</li>
                      <li>Ticket sales integration</li>
                      <li>Virtual event support</li>
                      <li>Automated email reminders</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Community Features</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Partner directory</li>
                      <li>Nonprofit profiles</li>
                      <li>Volunteer opportunities</li>
                      <li>Community forums</li>
                      <li>Impact reporting</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6">
                <p className="text-gray-600 text-lg">
                  This dashboard will be available in <strong className="text-brand-gold">Phase 3</strong> of the BlkXchange™ platform development.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  For immediate assistance with community or event management, please contact the development team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
