import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Food } from "@/types";
import { useOrderStore } from "@/store/useOrderStore";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface FoodCardProps {
  food: Food;
}

export function FoodCard({ food }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToOrder } = useOrderStore();

  const handleAddToOrder = () => {
    addToOrder(food, quantity);
    setQuantity(1);
  };

  const getCategoryColor = (category: Food['category']) => {
    switch (category) {
      case 'main':
        return 'bg-primary text-primary-foreground';
      case 'drink':
        return 'bg-accent text-accent-foreground';
      case 'salad':
        return 'bg-success text-success-foreground';
      case 'bread':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-warm hover:shadow-chef transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{food.title}</CardTitle>
            {food.description && (
              <CardDescription className="mt-1">{food.description}</CardDescription>
            )}
          </div>
          <Badge 
            className={`ml-2 capitalize ${getCategoryColor(food.category)}`}
          >
            {food.category}
          </Badge>
        </div>
      </CardHeader>

      {food.imageUrl && (
        <div className="px-6 pb-3">
          <img 
            src={food.imageUrl} 
            alt={food.title}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
      )}

      <CardContent className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${food.price.toFixed(2)}
          </span>
          {!food.isAvailable && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </CardContent>

      {food.isAvailable && (
        <CardFooter className="pt-0">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={handleAddToOrder}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Order
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}