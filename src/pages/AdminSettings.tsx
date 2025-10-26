import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Shield, DollarSign, Users, Info } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Settings className="w-12 h-12 text-brand-gold" />
            <div>
              <h1 className="text-4xl font-heading font-bold">Settings & Configuration</h1>
              <p className="text-xl text-gray-300">Platform settings and administrative controls</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-brand-gold">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-yellow-600">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Info className="w-6 h-6" />
              Settings Panel Under Development
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">
                  Administrative Settings Dashboard
                </h3>
                <p className="text-emerald-800 mb-4">
                  The comprehensive settings panel is currently under development and will include:
                </p>
                <ul className="space-y-3 text-emerald-700">
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>User Role Controls:</strong> Manage admin permissions, create custom roles, and control access levels for different administrative functions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Payment Settings:</strong> Configure Stripe integration, set platform fees, manage payout schedules, and customize payment processing options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Community Fund Tracking:</strong> Monitor and allocate the 3% community impact fund, set distribution rules, and generate impact reports</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
                <h3 className="text-lg font-bold text-yellow-900 mb-2">
                  Planned Configuration Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-800">
                  <div>
                    <h4 className="font-semibold mb-2">Access & Security</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Admin role management</li>
                      <li>Two-factor authentication</li>
                      <li>API key management</li>
                      <li>Audit log viewing</li>
                      <li>Session timeout settings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Platform Configuration</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Platform fee percentages</li>
                      <li>Community fund allocation</li>
                      <li>Email notification templates</li>
                      <li>Site-wide announcements</li>
                      <li>Maintenance mode toggle</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Payment Processing</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Stripe account configuration</li>
                      <li>Payout schedule settings</li>
                      <li>Currency and tax settings</li>
                      <li>Refund policy management</li>
                      <li>Payment gateway monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Impact Fund Management</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Fund distribution rules</li>
                      <li>HBCU allocation settings</li>
                      <li>Scholarship fund tracking</li>
                      <li>Nonprofit partner management</li>
                      <li>Impact report generation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6">
                <p className="text-gray-600 text-lg">
                  The Settings panel will be available in the <strong className="text-brand-gold">next development phase</strong>.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  For immediate configuration changes, please contact the system administrator.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
