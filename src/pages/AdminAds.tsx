import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE_URL } from '../api';

interface AdCreative {
  id: string;
  advertiser_id: string;
  advertiser_name: string;
  asset_url: string;
  ad_type: string;
  pages: string[];
  start_date: string;
  end_date: string;
  price_tier: string;
  link_url?: string;
  status: string;
  created_at: string;
}

interface Advertiser {
  id: string;
  name: string;
  contact_email: string;
  website?: string;
  created_at: string;
}

export default function AdminAds() {
  const [adCreatives, setAdCreatives] = useState<AdCreative[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const secret = prompt('Enter admin password:');
    if (secret) {
      setAdminSecret(secret);
      setIsAuthenticated(true);
      loadData(secret);
    }
  }, []);

  const loadData = async (secret: string) => {
    try {
      const [creativesRes, advertisersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/ad-creatives`, {
          headers: { 'X-Admin-Secret': secret }
        }),
        fetch(`${API_BASE_URL}/api/advertisers`, {
          headers: { 'X-Admin-Secret': secret }
        })
      ]);

      if (creativesRes.ok && advertisersRes.ok) {
        const creatives = await creativesRes.json();
        const advertisers = await advertisersRes.json();
        setAdCreatives(creatives);
        setAdvertisers(advertisers);
      }
    } catch (error) {
      console.error('Error loading ad data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAdStatus = async (creativeId: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ad-creatives/${creativeId}/status?status=${status}`, {
        method: 'PATCH',
        headers: { 'X-Admin-Secret': adminSecret }
      });

      if (response.ok) {
        loadData(adminSecret);
      }
    } catch (error) {
      console.error('Error updating ad status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="text-xl text-gray-600">Authentication required</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading advertising data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Advertising Management
          </h1>
          <p className="text-xl text-gray-300">
            Manage advertisers and ad campaigns
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-brand-gold">Total Advertisers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-brand-black">{advertisers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-brand-gold">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-brand-black">
                {adCreatives.filter(ad => ad.status === 'live').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-brand-gold">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-brand-black">
                {adCreatives.filter(ad => ad.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-black">Advertisers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Website</th>
                    <th className="text-left py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {advertisers.map((advertiser) => (
                    <tr key={advertiser.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{advertiser.name}</td>
                      <td className="py-3 px-4">{advertiser.contact_email}</td>
                      <td className="py-3 px-4">
                        {advertiser.website && (
                          <a 
                            href={advertiser.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-brand-gold hover:underline flex items-center gap-1"
                          >
                            Visit <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-4">{formatDate(advertiser.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-brand-black">Ad Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adCreatives.map((creative) => (
                <div key={creative.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48 h-32 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={creative.asset_url} 
                        alt={`Ad by ${creative.advertiser_name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-brand-black">{creative.advertiser_name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="capitalize">{creative.ad_type}</Badge>
                            <Badge 
                              variant={creative.status === 'live' ? 'default' : 'secondary'}
                              className={creative.status === 'live' ? 'bg-green-600' : ''}
                            >
                              {creative.status}
                            </Badge>
                            <Badge variant="outline">{creative.price_tier}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {creative.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateAdStatus(creative.id, 'live')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {creative.status === 'live' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateAdStatus(creative.id, 'expired')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Disable
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="font-semibold">Duration:</span>
                          </div>
                          <div>{formatDate(creative.start_date)} - {formatDate(creative.end_date)}</div>
                        </div>
                        
                        <div>
                          <div className="font-semibold mb-1">Pages:</div>
                          <div className="flex flex-wrap gap-1">
                            {creative.pages.map((page) => (
                              <Badge key={page} variant="secondary" className="text-xs capitalize">
                                {page}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {creative.link_url && (
                        <div className="mt-2">
                          <a 
                            href={creative.link_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-brand-gold hover:underline flex items-center gap-1 text-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {creative.link_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
