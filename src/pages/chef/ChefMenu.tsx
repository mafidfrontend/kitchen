import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFoods } from "@/hooks/useFoods";
import { Food, FoodCategory, CreateFood } from "@/types";
import { Plus, Edit, Trash2, Utensils, Coffee, Salad, Sandwich } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function ChefMenu() {
  const { foods, loading, addFood, updateFood, deleteFood } = useFoods();
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateFood>({
    title: "",
    price: 0,
    category: "main",
    isAvailable: true,
    description: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      price: 0,
      category: "main",
      isAvailable: true,
      description: "",
    });
    setEditingFood(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a valid title and price.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingFood) {
        await updateFood(editingFood.id, formData);
      } else {
        await addFood(formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving food:', error);
    }
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setFormData({
      title: food.title,
      price: food.price,
      category: food.category,
      isAvailable: food.isAvailable,
      description: food.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (food: Food) => {
    if (confirm(`Are you sure you want to delete "${food.title}"?`)) {
      await deleteFood(food.id);
    }
  };

  const handleToggleAvailability = async (food: Food) => {
    await updateFood(food.id, { isAvailable: !food.isAvailable });
  };

  const getCategoryIcon = (category: FoodCategory) => {
    switch (category) {
      case 'main':
        return <Utensils className="h-4 w-4" />;
      case 'drink':
        return <Coffee className="h-4 w-4" />;
      case 'salad':
        return <Salad className="h-4 w-4" />;
      case 'bread':
        return <Sandwich className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: FoodCategory) => {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-chef bg-clip-text text-transparent">
            Menu Management
          </h1>
          <p className="text-muted-foreground">Manage your restaurant's menu items</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingFood ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter food title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter food description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: FoodCategory) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Course</SelectItem>
                      <SelectItem value="drink">Drinks</SelectItem>
                      <SelectItem value="salad">Salads</SelectItem>
                      <SelectItem value="bread">Bread</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                />
                <Label htmlFor="available">Available for ordering</Label>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingFood ? "Update Item" : "Add Item"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {foods.map((food) => (
          <Card key={food.id} className="relative shadow-warm hover:shadow-chef transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{food.title}</CardTitle>
                  {food.description && (
                    <CardDescription className="mt-1 line-clamp-2">
                      {food.description}
                    </CardDescription>
                  )}
                </div>
                <Badge className={`ml-2 capitalize ${getCategoryColor(food.category)}`}>
                  <div className="flex items-center space-x-1">
                    {getCategoryIcon(food.category)}
                    <span>{food.category}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary">
                  ${food.price.toFixed(2)}
                </span>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={food.isAvailable}
                    onCheckedChange={() => handleToggleAvailability(food)}
                  />
                  <span className={`text-sm ${food.isAvailable ? 'text-success' : 'text-muted-foreground'}`}>
                    {food.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(food)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(food)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {foods.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <Utensils className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No menu items yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first menu item</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}