import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, MousePointer, Mail, Users, MapPin, Download } from 'lucide-react';
import { api } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsDashboardProps {
  entityType: 'professional' | 'vendor';
  entityId: string;
  days?: number;
}

interface AnalyticsSummary {
  entity_id: string;
  entity_type: string;
  total_views: number;
  total_clicks: number;
  total_leads: number;
  unique_visitors: number;
  top_locations: Array<{ location: string; count: number }>;
  period_start: string;
  period_end: string;
}

export function AnalyticsDashboard({ entityType, entityId, days = 30 }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [entityId, entityType, days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/summary/${entityType}/${entityId}?days=${days}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!analytics) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Total Views', analytics.total_views],
      ['Total Clicks', analytics.total_clicks],
      ['Total Leads', analytics.total_leads],
      ['Unique Visitors', analytics.unique_visitors],
      ['Period Start', new Date(analytics.period_start).toLocaleDateString()],
      ['Period End', new Date(analytics.period_end).toLocaleDateString()],
      [],
      ['Top Locations', 'Count'],
      ...analytics.top_locations.map(loc => [loc.location, loc.count])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${entityType}-${entityId}-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8 text-gray-600">
        No analytics data available yet.
      </div>
    );
  }

  const chartData = [
    { name: 'Views', value: analytics.total_views, fill: '#C5A14E' },
    { name: 'Clicks', value: analytics.total_clicks, fill: '#00A86B' },
    { name: 'Leads', value: analytics.total_leads, fill: '#1A1A1A' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-black">Analytics Dashboard</h2>
        <Button onClick={exportToCSV} className="bg-brand-gold text-brand-black hover:bg-brand-gold/90">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-brand-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_views}</div>
            <p className="text-xs text-gray-600">Last {days} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_clicks}</div>
            <p className="text-xs text-gray-600">Last {days} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Mail className="h-4 w-4 text-brand-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_leads}</div>
            <p className="text-xs text-gray-600">Last {days} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-brand-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.unique_visitors}</div>
            <p className="text-xs text-gray-600">Last {days} days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#C5A14E" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {analytics.top_locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-gold" />
              Top Visitor Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.top_locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                    <span className="text-sm text-gray-900">{location.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-brand-gold h-2 rounded-full"
                        style={{
                          width: `${(location.count / analytics.top_locations[0].count) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-brand-gold w-8 text-right">
                      {location.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-brand-gold/10 to-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-brand-black mb-2">
                Upgrade to Elite for Advanced Analytics
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Get access to detailed conversion tracking, A/B testing, monthly performance reports, and more with our Elite membership tier.
              </p>
              <Button className="bg-brand-black text-white hover:bg-brand-black/90">
                Upgrade Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
