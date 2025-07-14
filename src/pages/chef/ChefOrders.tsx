import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OrderCard } from "@/components/orders/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import { OrderStatus } from "@/types";
import { RefreshCw, Clock, ChefHat, CheckCircle, Truck } from "lucide-react";

export function ChefOrders() {
  const { orders, loading, updateOrderStatus, deleteOrder, getOrdersByStatus } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh (data is already real-time)
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(orderId);
    }
  };

  const pendingOrders = getOrdersByStatus('pending');
  const cookingOrders = getOrdersByStatus('cooking');
  const readyOrders = getOrdersByStatus('ready');
  const deliveredOrders = getOrdersByStatus('delivered');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-chef bg-clip-text text-transparent">
            Orders Dashboard
          </h1>
          <p className="text-muted-foreground">Manage incoming orders in real-time</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingOrders.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {pendingOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cooking" className="relative">
            Cooking
            {cookingOrders.length > 0 && (
              <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {cookingOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready
            {readyOrders.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {readyOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingOrders.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending orders</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDeleteOrder}
                  showCustomer
                  showActions
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cooking" className="space-y-4 mt-6">
          {cookingOrders.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders being prepared</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cookingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  showCustomer
                  showActions
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4 mt-6">
          {readyOrders.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders ready for pickup</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {readyOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  showCustomer
                  showActions
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4 mt-6">
          {deliveredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No delivered orders today</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {deliveredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showCustomer
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}