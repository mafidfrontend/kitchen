import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FoodCard } from "@/components/food/FoodCard";
import { useFoods } from "@/hooks/useFoods";
import { useOrders } from "@/hooks/useOrders";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuth } from "@/hooks/useAuth";
import { FoodCategory } from "@/types";
import { 
  ShoppingCart, 
  Utensils, 
  Coffee, 
  Salad, 
  Sandwich,
  X,
  Plus,
  Minus
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function UserHome() {
  const { user } = useAuth();
  const { foods, loading } = useFoods();
  const { createOrder } = useOrders();
  const { 
    currentOrder, 
    clearOrder, 
    getTotalAmount, 
    getTotalItems,
    updateQuantity,
    removeFromOrder 
  } = useOrderStore();
  
  const [customerNotes, setCustomerNotes] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const availableFoods = foods.filter(food => food.isAvailable);

  const getFoodsByCategory = (category: FoodCategory) => {
    return availableFoods.filter(food => food.category === category);
  };

  const getCategoryIcon = (category: FoodCategory) => {
    switch (category) {
      case 'main':
        return <Utensils className="h-5 w-5" />;
      case 'drink':
        return <Coffee className="h-5 w-5" />;
      case 'salad':
        return <Salad className="h-5 w-5" />;
      case 'bread':
        return <Sandwich className="h-5 w-5" />;
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (currentOrder.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    setPlacingOrder(true);
    try {
      await createOrder({
        userId: user.id,
        items: currentOrder.map(item => ({
          foodId: item.foodId,
          qty: item.qty,
          price: item.price
        })),
        status: 'pending',
        totalAmount: getTotalAmount(),
        customerNotes: customerNotes.trim() || undefined,
      });

      clearOrder();
      setCustomerNotes("");
      toast({
        title: "Order Placed!",
        description: "Your order has been submitted successfully.",
      });
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Our Menu
            </h1>
            <p className="text-muted-foreground">Fresh, delicious food prepared with love</p>
          </div>

          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="main" className="flex items-center space-x-2">
                {getCategoryIcon('main')}
                <span className="hidden sm:inline">Main</span>
              </TabsTrigger>
              <TabsTrigger value="drink" className="flex items-center space-x-2">
                {getCategoryIcon('drink')}
                <span className="hidden sm:inline">Drinks</span>
              </TabsTrigger>
              <TabsTrigger value="salad" className="flex items-center space-x-2">
                {getCategoryIcon('salad')}
                <span className="hidden sm:inline">Salads</span>
              </TabsTrigger>
              <TabsTrigger value="bread" className="flex items-center space-x-2">
                {getCategoryIcon('bread')}
                <span className="hidden sm:inline">Bread</span>
              </TabsTrigger>
            </TabsList>

            {(['main', 'drink', 'salad', 'bread'] as FoodCategory[]).map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {getFoodsByCategory(category).map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>
                {getFoodsByCategory(category).length === 0 && (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="text-center">
                        {getCategoryIcon(category)}
                        <p className="text-muted-foreground mt-2">
                          No {category} items available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Your Order</span>
                {getTotalItems() > 0 && (
                  <Badge variant="secondary">{getTotalItems()}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {currentOrder.length === 0 
                  ? "Add items to start your order" 
                  : `${getTotalItems()} item${getTotalItems() > 1 ? 's' : ''} in cart`
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {currentOrder.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {currentOrder.map((item) => (
                      <div key={item.foodId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.food?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.foodId, item.qty - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.foodId, item.qty + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeFromOrder(item.foodId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Special Instructions (Optional)</label>
                    <Textarea
                      placeholder="Any special requests or dietary requirements..."
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">${getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={!user || placingOrder}
                      className="w-full bg-gradient-primary hover:opacity-90"
                    >
                      {placingOrder ? "Placing Order..." : "Place Order"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearOrder}
                      className="w-full"
                    >
                      Clear Cart
                    </Button>
                  </div>

                  {!user && (
                    <p className="text-sm text-muted-foreground text-center">
                      Please sign in to place your order
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}