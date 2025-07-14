import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OrderCard } from "@/components/orders/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { Clock, ChefHat, CheckCircle, Truck, ShoppingBag } from "lucide-react";

export function UserOrders() {
  const { user } = useAuth();
  const { orders, loading, getOrdersByStatus } = useOrders(user?.id);

  const pendingOrders = getOrdersByStatus('pending');
  const cookingOrders = getOrdersByStatus('cooking');
  const readyOrders = getOrdersByStatus('ready');
  const deliveredOrders = getOrdersByStatus('delivered');

  const currentOrders = [...pendingOrders, ...cookingOrders, ...readyOrders];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-muted-foreground">
                Please sign in to view your orders
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          My Orders
        </h1>
        <p className="text-muted-foreground">Track your current and past orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cooking</CardTitle>
            <ChefHat className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cookingOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current" className="relative">
            Current Orders
            {currentOrders.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {currentOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">
            Order History
            {deliveredOrders.length > 0 && (
              <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {deliveredOrders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4 mt-6">
          {currentOrders.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No current orders</h3>
                  <p className="text-muted-foreground">
                    You don't have any active orders right now
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Active Orders Status Flow */}
              <div className="grid gap-4">
                {/* Pending Orders */}
                {pendingOrders.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-warning" />
                      <h3 className="text-lg font-semibold">Pending Orders</h3>
                      <Badge variant="outline">{pendingOrders.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {pendingOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Cooking Orders */}
                {cookingOrders.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <ChefHat className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Being Prepared</h3>
                      <Badge variant="outline">{cookingOrders.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {cookingOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Ready Orders */}
                {readyOrders.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <h3 className="text-lg font-semibold">Ready for Pickup!</h3>
                      <Badge variant="outline">{readyOrders.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {readyOrders.map((order) => (
                        <div key={order.id} className="relative">
                          <OrderCard order={order} />
                          <div className="absolute -top-2 -right-2">
                            <Badge variant="default" className="animate-pulse">
                              Ready!
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {deliveredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No order history</h3>
                  <p className="text-muted-foreground">
                    Your completed orders will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {deliveredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}