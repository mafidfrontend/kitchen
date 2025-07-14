# KitchenPulse CRM

A modern kitchen management system built with React, TypeScript, Firebase, and Tailwind CSS. Features real-time order tracking, menu management, and sales analytics.

## 🚀 Features

### Customer Portal
- **Menu Browsing**: View available food items by category (Main, Drinks, Salads, Bread)
- **Order Placement**: Add items to cart and place orders with special instructions
- **Real-time Tracking**: Track order status from pending → cooking → ready → delivered
- **Google Authentication**: Secure sign-in with Google accounts

### Chef Dashboard (No Authentication Required)
- **Order Management**: View and update order status in real-time
- **Menu Control**: Add, edit, delete, and toggle availability of menu items
- **Daily Analytics**: Track sales, revenue, and category performance
- **Real-time Updates**: Automatic updates using Firestore listeners

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Backend**: Firebase (Firestore, Authentication)
- **Charts**: Recharts
- **Real-time**: Firestore onSnapshot listeners

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd kitchen-pulse-crm
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Google provider)
   - Create Firestore database
   - Copy your config to `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

4. **Run the development server**
```bash
npm run dev
```

## 🗄 Firestore Collections

### `foods`
```typescript
{
  title: string;
  price: number;
  category: "main" | "drink" | "salad" | "bread";
  isAvailable: boolean;
  description?: string;
}
```

### `orders`
```typescript
{
  userId: string;
  items: Array<{
    foodId: string;
    qty: number;
    price: number;
  }>;
  status: "pending" | "cooking" | "ready" | "delivered";
  createdAt: Timestamp;
  totalAmount: number;
  customerNotes?: string;
}
```

### `users`
```typescript
{
  displayName: string;
  email: string;
  photoURL?: string;
}
```

## 🎨 Design System

The app uses a warm, kitchen-inspired design system with:
- **Primary**: Vibrant orange (#FF7A00)
- **Accent**: Golden yellow (#FFB347)
- **Chef**: Dark brown for admin elements
- **Success**: Green for completed actions
- **Warning**: Amber for alerts

## 🔐 Security Rules

Basic Firestore security rules (expand as needed):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Foods are readable by all, writable by authenticated users (for demo)
    match /foods/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders are readable by owner or any authenticated user (for chef dashboard)
    match /orders/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment

Build for production:
```bash
npm run build
```

Deploy to Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📱 Usage

1. **Customer Flow**:
   - Sign in with Google
   - Browse menu by category
   - Add items to cart
   - Place order with optional notes
   - Track order status in real-time

2. **Chef Flow**:
   - Access chef dashboard (no login required)
   - View incoming orders
   - Update order status (pending → cooking → ready → delivered)
   - Manage menu items (add/edit/delete)
   - View daily sales statistics

## 🔄 Real-time Features

- Orders update instantly across all connected clients
- Menu changes reflect immediately
- Order status notifications
- Live analytics dashboard

## 🎯 Future Enhancements

- Push notifications via Firebase Cloud Messaging
- Image upload for menu items
- Advanced analytics and reporting
- Multi-restaurant support
- Mobile app with React Native

## 📝 License

MIT License - feel free to use this project as a starting point for your own kitchen management system!

---

**Note**: Remember to configure your Firebase credentials before running the application. The app includes demo data seeding capabilities in the hooks.