import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useOrderStore } from "@/store/useOrderStore";
import { ChefHat, ShoppingCart, LogOut, LogIn } from "lucide-react";

interface HeaderProps {
  isChefMode?: boolean;
  onToggleMode?: () => void;
}

export function Header({ isChefMode = false, onToggleMode }: HeaderProps) {
  const { user, signInWithGoogle, signOut, isAuthenticated } = useAuth();
  const { getTotalItems } = useOrderStore();
  const cartItemsCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-warm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">KitchenPulse</h1>
              <p className="text-xs text-muted-foreground">
                {isChefMode ? "Chef Dashboard" : "Order & Enjoy"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex items-center space-x-4">
          {/* Mode Toggle */}
          {onToggleMode && (
            <Button
              variant={isChefMode ? "chef" : "default"}
              onClick={onToggleMode}
              className="hidden sm:flex"
            >
              <ChefHat className="h-4 w-4 mr-2" />
              {isChefMode ? "Chef Mode" : "Switch to Chef"}
            </Button>
          )}

          {/* Cart (User Mode Only) */}
          {!isChefMode && (
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                <AvatarFallback>
                  {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">{user?.displayName}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            !isChefMode && (
              <Button onClick={signInWithGoogle} size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )
          )}
        </nav>
      </div>
    </header>
  );
}