'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Separator } from '@/components/ui/Separator';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import MenuManager from '@/components/dashboard/MenuManager';
import AIAssistant from '@/components/dashboard/AIAssistant';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

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

interface DashboardData {
  user: User | null;
  userName: string;
  hasShop: boolean;
  hasMenu: boolean;
  shopSlug?: string;
  completedSteps: number;
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

const ChocolateShopDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    user: null,
    userName: '',
    hasShop: false,
    hasMenu: false,
    completedSteps: 1
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const supabase = createClient();
      
      // Get user data
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        // Check if user has a shop
        const { data: shop } = await supabase
          .from('shops')
          .select('id, slug')
          .eq('user_id', user.id)
          .single();
        
        // Check if user has menu items
        let hasMenu = false;
        if (shop) {
          const { data: menuItems } = await supabase
            .from('menu_items')
            .select('id')
            .eq('shop_id', shop.id)
            .limit(1);
          
          hasMenu = !!(menuItems && menuItems.length > 0);
        }
        
        // Calculate completed steps
        let completedSteps = 1; // Account created
        if (shop) completedSteps++; // Shop created
        if (hasMenu) completedSteps++; // Menu uploaded
        
        setDashboardData({
          user,
          userName: profile?.full_name || user.email?.split('@')[0] || 'there',
          hasShop: !!shop,
          hasMenu,
          shopSlug: shop?.slug,
          completedSteps
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
    { 
      step: 1, 
      title: 'Account Created & Payment Confirmed', 
      description: 'Your account is ready to go!', 
      completed: true 
    },
    { 
      step: 2, 
      title: 'Upload Your Menu', 
      description: 'Upload photos or type items', 
      completed: dashboardData.hasMenu,
      current: !dashboardData.hasMenu
    },
    { 
      step: 3, 
      title: 'Customize Shop Details', 
      description: 'Add your business information', 
      completed: dashboardData.hasShop && dashboardData.hasMenu,
      current: dashboardData.hasMenu && !dashboardData.hasShop
    },
    { 
      step: 4, 
      title: 'Preview Your Website', 
      description: 'Review and approve design', 
      completed: false,
      current: dashboardData.hasShop && dashboardData.hasMenu
    },
    { 
      step: 5, 
      title: 'Go Live!', 
      description: 'Your shop is ready for customers', 
      completed: false 
    },
  ];

  const quickActions = [
    { 
      icon: <Upload className="h-5 w-5" />, 
      label: dashboardData.hasMenu ? 'Update Menu' : 'Upload Menu Photos', 
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => setActiveTab('menu')
    },
    { 
      icon: <MessageCircle className="h-5 w-5" />, 
      label: 'Test AI Chat', 
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => setActiveTab('ai'),
      disabled: !dashboardData.hasMenu
    },
    { 
      icon: <Eye className="h-5 w-5" />, 
      label: 'Preview My Website', 
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {
        if (dashboardData.shopSlug) {
          window.open(`/${dashboardData.shopSlug}`, '_blank');
        }
      },
      disabled: !dashboardData.hasShop
    },
  ];

  const progressPercentage = (dashboardData.completedSteps / 5) * 100;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-amber-700">AutoAI</h1>
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
          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'menu' && <MenuManager />}
          {activeTab === 'ai' && <AIAssistant />}
          
          {/* Overview Content - Show only when overview tab is active */}
          {activeTab === 'overview' && (
            <>
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {getGreeting()}, {dashboardData.userName}! Welcome to AutoAI
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {dashboardData.hasShop 
                      ? "Here's what's happening with your shop today"
                      : "Let's get your shop set up and running"}
                  </p>
                </div>
              </div>

              {/* Setup Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <span>Setup Progress</span>
                  </CardTitle>
                  <Progress value={progressPercentage} className="w-full" />
                  <p className="text-sm text-gray-600">
                    {dashboardData.completedSteps} of 5 steps completed
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {setupSteps.map((step) => (
                    <SetupStep key={step.step} {...step} />
                  ))}
                </CardContent>
              </Card>

              <div>
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
                        onClick={action.onClick}
                        disabled={action.disabled}
                      >
                        {action.icon}
                        <span>{action.label}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Coming Soon Section instead of fake customers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-amber-600" />
                    <span>Customer Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No customers yet</p>
                    <p className="text-sm text-gray-500">
                      {dashboardData.hasShop 
                        ? "Customer data will appear here once your shop starts receiving orders"
                        : "Complete your shop setup to start accepting customers"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChocolateShopDashboard;