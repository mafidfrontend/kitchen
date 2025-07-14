import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { UserHome } from "./user/UserHome";
import { ChefOrders } from "./chef/ChefOrders";
import { ChefMenu } from "./chef/ChefMenu";
import { ChefStats } from "./chef/ChefStats";
import { UserOrders } from "./user/UserOrders";
import { 
  ChefHat, 
  ShoppingCart, 
  BarChart3, 
  ClipboardList,
  Utensils,
  Users
} from "lucide-react";

type ViewMode = 'welcome' | 'user' | 'chef';
type ChefView = 'orders' | 'menu' | 'stats';

export default function Index() {
  const [mode, setMode] = useState<ViewMode>('welcome');
  const [chefView, setChefView] = useState<ChefView>('orders');
  const { user } = useAuth();

  const handleModeToggle = () => {
    setMode(mode === 'user' ? 'chef' : 'user');
  };

  const renderUserView = () => {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Header isChefMode={false} onToggleMode={handleModeToggle} />
        <UserHome />
      </div>
    );
  };

  const renderChefView = () => {
    return (
      <div className="min-h-screen bg-background">
        <Header isChefMode={true} onToggleMode={handleModeToggle} />
        
        {/* Chef Navigation */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-1 py-4">
              <Button
                variant={chefView === 'orders' ? 'default' : 'ghost'}
                onClick={() => setChefView('orders')}
                className="flex items-center space-x-2"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Orders</span>
              </Button>
              <Button
                variant={chefView === 'menu' ? 'default' : 'ghost'}
                onClick={() => setChefView('menu')}
                className="flex items-center space-x-2"
              >
                <Utensils className="h-4 w-4" />
                <span>Menu</span>
              </Button>
              <Button
                variant={chefView === 'stats' ? 'default' : 'ghost'}
                onClick={() => setChefView('stats')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Statistics</span>
              </Button>
            </nav>
          </div>
        </div>

        {/* Chef Content */}
        <div className="flex-1">
          {chefView === 'orders' && <ChefOrders />}
          {chefView === 'menu' && <ChefMenu />}
          {chefView === 'stats' && <ChefStats />}
        </div>
      </div>
    );
  };

  const renderWelcomeView = () => {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Header isChefMode={false} onToggleMode={handleModeToggle} />
        
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Welcome to KitchenPulse
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your complete kitchen management solution. Order delicious food or manage your restaurant operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* User Mode Card */}
            <Card 
              className="cursor-pointer hover:shadow-warm transition-all duration-300 transform hover:scale-105"
              onClick={() => setMode('user')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Customer Portal</CardTitle>
                <CardDescription>
                  Browse menu, place orders, and track your food
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">Menu Browsing</Badge>
                  <Badge variant="secondary">Order Tracking</Badge>
                  <Badge variant="secondary">Real-time Updates</Badge>
                </div>
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Start Ordering
                </Button>
              </CardContent>
            </Card>

            {/* Chef Mode Card */}
            <Card 
              className="cursor-pointer hover:shadow-chef transition-all duration-300 transform hover:scale-105"
              onClick={() => setMode('chef')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-gradient-chef w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Chef Dashboard</CardTitle>
                <CardDescription>
                  Manage orders, menu items, and view analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">Order Management</Badge>
                  <Badge variant="secondary">Menu Control</Badge>
                  <Badge variant="secondary">Sales Analytics</Badge>
                </div>
                <Button className="w-full bg-gradient-chef hover:opacity-90">
                  <ChefHat className="h-4 w-4 mr-2" />
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-8">Features</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="mx-auto bg-success w-12 h-12 rounded-full flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Real-time Orders</h3>
                <p className="text-sm text-muted-foreground">
                  Live order tracking and instant notifications
                </p>
              </div>
              <div className="space-y-2">
                <div className="mx-auto bg-accent w-12 h-12 rounded-full flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Menu Management</h3>
                <p className="text-sm text-muted-foreground">
                  Easy menu updates and availability control
                </p>
              </div>
              <div className="space-y-2">
                <div className="mx-auto bg-warning w-12 h-12 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed sales reports and insights
                </p>
              </div>
            </div>
          </div>

          {/* Firebase Setup Notice */}
          <div className="mt-16">
            <Card className="border-warning bg-warning/5">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2 text-warning">Setup Required</h3>
                <p className="text-sm text-muted-foreground">
                  Don't forget to configure your Firebase credentials in <code>src/lib/firebase.ts</code> 
                  to enable authentication and database functionality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Route based on mode
  if (mode === 'user') {
    return renderUserView();
  } else if (mode === 'chef') {
    return renderChefView();
  } else {
    return renderWelcomeView();
  }
}
