'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Menu, 
  Bot, 
  ShoppingBag, 
  Globe, 
  Users, 
  Settings, 
  CheckCircle, 
  Clock, 
  Upload, 
  MessageCircle, 
  Eye, 
  QrCode, 
  Calendar,
  Package,
  AlertTriangle,
  Gift,
  Sun,
  Cloud,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

interface SetupStepProps {
  step: number;
  title: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface PopularItemProps {
  name: string;
  quantity: number;
  revenue: string;
  rank: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend = 'neutral' }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />;
      case 'down': return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SetupStep: React.FC<SetupStepProps> = ({ step, title, description, completed, current = false }) => {
  return (
    <div className={`flex items-start space-x-3 p-4 rounded-lg transition-colors ${
      current ? 'bg-amber-50 border border-amber-200' : 'bg-white'
    }`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        completed 
          ? 'bg-green-100 text-green-600' 
          : current 
            ? 'bg-amber-100 text-amber-600'
            : 'bg-gray-100 text-gray-400'
      }`}>
        {completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
        active 
          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

const PopularItem: React.FC<PopularItemProps> = ({ name, quantity, revenue, rank }) => {
  const getRankBadge = () => {
    const colors = ['bg-yellow-100 text-yellow-800', 'bg-gray-100 text-gray-800', 'bg-orange-100 text-orange-800'];
    return colors[rank - 1] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3">
        <Badge className={getRankBadge()}>#{rank}</Badge>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{quantity} sold</p>
        </div>
      </div>
      <p className="font-semibold text-gray-900">{revenue}</p>
    </div>
  );
};

const ChocolateShopDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Overview', key: 'overview' },
    { icon: <Menu className="h-5 w-5" />, label: 'My Menu', key: 'menu' },
    { icon: <Bot className="h-5 w-5" />, label: 'AI Assistant', key: 'ai' },
    { icon: <ShoppingBag className="h-5 w-5" />, label: 'Orders', key: 'orders' },
    { icon: <Globe className="h-5 w-5" />, label: 'My Website', key: 'website' },
    { icon: <Users className="h-5 w-5" />, label: 'Customers', key: 'customers' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', key: 'settings' },
  ];

  const setupSteps = [
    { step: 1, title: 'Account Created & Payment Confirmed', description: 'Your account is ready to go!', completed: true },
    { step: 2, title: 'Upload Your Menu', description: 'Upload photos or type items', completed: false, current: true },
    { step: 3, title: 'Customize AI Assistant', description: 'Test chat responses', completed: false },
    { step: 4, title: 'Preview Your Website', description: 'Review and approve design', completed: false },
    { step: 5, title: 'Go Live!', description: 'Publish website and start taking orders', completed: false },
  ];

  const popularItems = [
    { name: 'Dark Chocolate Truffles', quantity: 45, revenue: '$675', rank: 1 },
    { name: 'Milk Chocolate Hearts', quantity: 32, revenue: '$480', rank: 2 },
    { name: 'Artisan Chocolate Box', quantity: 18, revenue: '$540', rank: 3 },
  ];

  const quickActions = [
    { icon: <Upload className="h-5 w-5" />, label: 'Upload Menu Photos', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: <MessageCircle className="h-5 w-5" />, label: 'Test AI Chat', color: 'bg-green-500 hover:bg-green-600' },
    { icon: <Eye className="h-5 w-5" />, label: 'Preview My Website', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: <QrCode className="h-5 w-5" />, label: 'Download QR Code', color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-amber-700">ChocolateAI</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-500 hover:text-gray-700"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={sidebarCollapsed ? '' : item.label}
              active={activeTab === item.key}
              onClick={() => setActiveTab(item.key)}
            />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Good morning, Sarah! Welcome to AutoAI</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your chocolate shop today</p>
            </div>
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center space-x-3">
                <Sun className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Sunny, 72°F</p>
                  <p className="text-sm text-blue-700">Perfect for foot traffic!</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Setup Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <span>Setup Progress</span>
              </CardTitle>
              <Progress value={20} className="w-full" />
              <p className="text-sm text-gray-600">1 of 5 steps completed</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {setupSteps.map((step) => (
                <SetupStep key={step.step} {...step} />
              ))}
            </CardContent>
          </Card>

          {/* Daily Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Today's Orders"
                value="12"
                change={25}
                trend="up"
                icon={<ShoppingBag className="h-5 w-5" />}
              />
              <MetricCard
                title="Revenue"
                value="$1,840"
                change={15}
                trend="up"
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <MetricCard
                title="AI Conversations"
                value="28"
                change={8}
                trend="up"
                icon={<MessageCircle className="h-5 w-5" />}
              />
              <MetricCard
                title="Website Visitors"
                value="156"
                change={12}
                trend="up"
                icon={<Eye className="h-5 w-5" />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  <span>Popular Items This Week</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularItems.map((item, index) => (
                  <PopularItem key={index} {...item} />
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-amber-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    className={`w-full justify-start space-x-2 text-white ${action.color}`}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chocolate Shop Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Seasonal Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Valentine's Collection</span>
                    <Badge className="bg-red-100 text-red-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Easter Specials</span>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                  <Button size="sm" className="w-full">Manage Seasonal Items</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-amber-700 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Inventory Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Low Stock Items:</p>
                    <p className="text-amber-700">• Dark Chocolate (5 left)</p>
                    <p className="text-amber-700">• Gift Boxes (3 left)</p>
                  </div>
                  <Button size="sm" className="w-full">Update Inventory</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700 flex items-center space-x-2">
                  <Gift className="h-5 w-5" />
                  <span>Custom Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-purple-800">Pending Requests: 3</p>
                    <p className="text-purple-700">• Wedding favor boxes</p>
                    <p className="text-purple-700">• Corporate gifts</p>
                  </div>
                  <Button size="sm" className="w-full">Review Requests</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-amber-600" />
                <span>New Customers Today</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Emma Thompson', email: 'emma@email.com', order: 'Chocolate Truffle Box' },
                  { name: 'Michael Chen', email: 'michael@email.com', order: 'Valentine\'s Special' },
                  { name: 'Lisa Rodriguez', email: 'lisa@email.com', order: 'Custom Gift Box' },
                ].map((customer, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Avatar>
                      <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{customer.order}</p>
                      <Badge variant="secondary">New</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChocolateShopDashboard;