import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimpleBarChart, SimplePieChart } from "@/components/ui/chart-simple";
import { useStats } from "@/hooks/useStats";
import { CalendarDays, DollarSign, ShoppingBag, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

export function ChefStats() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { stats, loading } = useStats(selectedDate);

  const categoryData = stats ? Object.entries(stats.categoryStats).map(([category, data]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: data.count,
    revenue: data.revenue
  })) : [];

  const revenueData = stats ? Object.entries(stats.categoryStats).map(([category, data]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: data.revenue
  })) : [];

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-chef bg-clip-text text-transparent">
            Daily Statistics
          </h1>
          <p className="text-muted-foreground">Track your restaurant's performance</p>
        </div>
        
        {/* Date Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDateChange(-1)}
          >
            Previous Day
          </Button>
          <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-md">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{format(selectedDate, 'MMM dd, yyyy')}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDateChange(1)}
            disabled={selectedDate >= new Date()}
          >
            Next Day
          </Button>
        </div>
      </div>

      {stats ? (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  ${stats.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total earnings for the day
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stats.totalOrders}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Revenue per order
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                <CalendarDays className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {Object.values(stats.categoryStats).reduce((sum, cat) => sum + cat.count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total items sold
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(stats.categoryStats).map(([category, data]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium capitalize flex items-center justify-between">
                    {category}
                    <Badge variant="secondary">{data.count} sold</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-primary">
                    ${data.revenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {data.count > 0 ? `$${(data.revenue / data.count).toFixed(2)} per item` : 'No sales'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          {stats.totalOrders > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Items Sold by Category</CardTitle>
                  <CardDescription>
                    Number of items sold in each category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart data={categoryData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>
                    Revenue distribution across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimplePieChart data={revenueData} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No sales data</h3>
                  <p className="text-muted-foreground">
                    No completed orders found for {format(selectedDate, 'MMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data available</h3>
              <p className="text-muted-foreground">
                Unable to load statistics for {format(selectedDate, 'MMM dd, yyyy')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}