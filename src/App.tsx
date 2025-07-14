import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import pages
import { UserHome } from "./pages/user/UserHome";
import { UserOrders } from "./pages/user/UserOrders";
import { ChefOrders } from "./pages/chef/ChefOrders";
import { ChefMenu } from "./pages/chef/ChefMenu";
import { ChefStats } from "./pages/chef/ChefStats";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* User Routes */}
          <Route path="/menu" element={<UserHome />} />
          <Route path="/my-orders" element={<UserOrders />} />
          
          {/* Chef Routes */}
          <Route path="/chef" element={<ChefOrders />} />
          <Route path="/chef/orders" element={<ChefOrders />} />
          <Route path="/chef/menu" element={<ChefMenu />} />
          <Route path="/chef/stats" element={<ChefStats />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
