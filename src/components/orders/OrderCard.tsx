import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order, OrderStatus } from "@/types";
import { Clock, User, DollarSign, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface OrderCardProps {
  order: Order;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
  onDelete?: (orderId: string) => void;
  showCustomer?: boolean;
  showActions?: boolean;
}

export function OrderCard({ 
  order, 
  onStatusUpdate, 
  onDelete, 
  showCustomer = false,
  showActions = false 
}: OrderCardProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cooking':
        return 'bg-primary text-primary-foreground';
      case 'ready':
        return 'bg-success text-success-foreground';
      case 'delivered':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'pending':
        return 'cooking';
      case 'cooking':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return null;
    }
  };

  const getStatusAction = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Start Cooking';
      case 'cooking':
        return 'Mark Ready';
      case 'ready':
        return 'Mark Delivered';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(order.status);
  const statusAction = getStatusAction(order.status);

  return (
    <Card className="w-full shadow-warm hover:shadow-chef transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Order #{order.id.slice(-6)}
            </CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <Clock className="h-4 w-4" />
              <span>{format(order.createdAt.toDate(), 'MMM dd, yyyy HH:mm')}</span>
            </CardDescription>
          </div>
          <Badge className={`capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </Badge>
        </div>

        {showCustomer && order.user && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{order.user.displayName}</span>
            <span>({order.user.email})</span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex-1">
                <span className="font-medium">
                  {item.food?.title || `Food ID: ${item.foodId}`}
                </span>
                <span className="text-muted-foreground ml-2">x{item.qty}</span>
              </div>
              <span className="font-semibold">
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="my-3" />

        <div className="flex justify-between items-center font-semibold text-lg">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>Total:</span>
          </div>
          <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
        </div>

        {order.customerNotes && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <p className="text-sm">
              <strong>Note:</strong> {order.customerNotes}
            </p>
          </div>
        )}

        {showActions && (
          <div className="flex space-x-2 mt-4">
            {nextStatus && onStatusUpdate && (
              <Button
                onClick={() => onStatusUpdate(order.id, nextStatus)}
                className="flex-1"
                variant={order.status === 'cooking' ? 'default' : 'secondary'}
              >
                {statusAction}
              </Button>
            )}
            
            {onDelete && order.status === 'pending' && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(order.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}