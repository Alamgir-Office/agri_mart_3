# Backend Setup Guide for AgriFresh Marketplace

This document outlines the API endpoints required by the AgriFresh frontend. The frontend currently uses React Query to fetch mock data from `/public/data/*.json`. 

To connect this frontend to a real backend, you only need to update the base URL and endpoint paths in `src/hooks/useQueries.ts`. No UI components need to be changed.

## Base Configuration

Change the fetch calls in `src/hooks/useQueries.ts` to point to your backend API base URL (e.g., `https://api.agrifresh.com/v1`).

---

## 1. Products API

### GET /api/products
- **Description:** Fetch all products with optional filtering.
- **Query Params:**
  - `category` (string, optional) - e.g., "vegetables"
  - `organic` (boolean, optional) - e.g., true
  - `minRating` (number, optional) - e.g., 4.0
  - `maxPrice` (number, optional) - e.g., 500
  - `farmId` (string, optional) - e.g., "f1"
- **Output Success (200 OK):**
  ```json
  [
    {
      "id": "p1",
      "name": "Fresh Organic Tomatoes",
      "category": "vegetables",
      "price": 45,
      "originalPrice": 60,
      "unit": "kg",
      "farmName": "Green Valley Farms",
      "location": "Pune, Maharashtra",
      "rating": 4.8,
      "images": ["url1", "url2"],
      "isOrganic": true,
      "harvestDate": "2023-10-25",
      "stock": 150,
      "description": "..."
    }
  ]
  ```
- **Replaces React Query Key:** `['products']`

### GET /api/products/:id
- **Description:** Fetch a single product's details.
- **Path Params:** `id` (string)
- **Output Success (200 OK):** Returns single product object (same schema as above).
- **Output Error (404 Not Found):** `{ "error": "Product not found" }`
- **Replaces React Query Key:** `['product', id]`

### POST /api/products
- **Description:** Create a new product listing (Farmer Dashboard).
- **Headers:** `Authorization: Bearer <token>`
- **Input Body:**
  ```json
  {
    "name": "Fresh Tomatoes",
    "category": "vegetables",
    "price": 45,
    "unit": "kg",
    "stock": 150,
    "description": "...",
    "isOrganic": true,
    "images": ["file_url_or_base64"]
  }
  ```
- **Output Success (201 Created):** Returns the created product object.

---

## 2. Categories API

### GET /api/categories
- **Description:** Fetch all product categories for navigation and filtering.
- **Output Success (200 OK):**
  ```json
  [
    { "id": "c1", "name": "Vegetables", "slug": "vegetables", "icon": "Carrot" },
    { "id": "c2", "name": "Fruits", "slug": "fruits", "icon": "Apple" }
  ]
  ```
- **Replaces React Query Key:** `['categories']`

---

## 3. Marketing & Discovery API

### GET /api/marketing/seasonal
- **Description:** Fetch in-season produce collections for the homepage.
- **Output Success (200 OK):**
  ```json
  [
    {
      "id": "s1",
      "title": "Winter Greens",
      "description": "Fresh spinach, mustard greens...",
      "image": "url"
    }
  ]
  ```
- **Replaces React Query Key:** `['seasonal']`

### GET /api/marketing/banners
- **Description:** Fetch hero banners for the homepage.
- **Output Success (200 OK):**
  ```json
  [
    {
      "id": "b1",
      "title": "Straight from the farm...",
      "subtitle": "Get 20% off...",
      "image": "url",
      "cta": "Shop Now",
      "link": "/shop"
    }
  ]
  ```
- **Replaces React Query Key:** `['banners']`

---

## 4. User & Profile API

### GET /api/users/me
- **Description:** Fetch current logged-in user details.
- **Headers:** `Authorization: Bearer <token>`
- **Output Success (200 OK):**
  ```json
  {
    "id": "u1",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+91 9876543210",
    "avatar": "url",
    "loyaltyPoints": 450,
    "addresses": [
      {
        "id": "a1",
        "type": "Home",
        "street": "Flat 402...",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400050",
        "isDefault": true
      }
    ]
  }
  ```
- **Replaces React Query Key:** `['user']`

---

## 5. Orders API

### GET /api/orders
- **Description:** Fetch order history for the current user.
- **Headers:** `Authorization: Bearer <token>`
- **Output Success (200 OK):**
  ```json
  [
    {
      "id": "ord_1001",
      "date": "2023-10-20T10:30:00Z",
      "total": 450,
      "status": "Delivered",
      "items": [
        { "name": "Fresh Organic Tomatoes", "quantity": 2, "price": 45 }
      ]
    }
  ]
  ```
- **Replaces React Query Key:** `['orders']`

### POST /api/orders
- **Description:** Create a new order (Checkout).
- **Headers:** `Authorization: Bearer <token>`
- **Input Body:**
  ```json
  {
    "items": [{ "productId": "p1", "quantity": 2 }],
    "shippingAddress": { "street": "...", "city": "...", "pincode": "..." },
    "paymentMethod": "upi",
    "totalAmount": 450
  }
  ```
- **Output Success (201 Created):** `{ "orderId": "ord_1003", "status": "Confirmed" }`

---

## 6. Location & Map API

### GET /api/locations/farms
- **Description:** Fetch farm locations for the interactive map.
- **Query Params:**
  - `lat` (number, optional) - User's latitude
  - `lng` (number, optional) - User's longitude
  - `radius` (number, optional) - Search radius in km
- **Output Success (200 OK):**
  ```json
  [
    {
      "id": "loc1",
      "name": "Green Valley Farms",
      "type": "farm",
      "lat": 18.5204,
      "lng": 73.8567,
      "description": "Organic vegetable farm..."
    }
  ]
  ```
- **Replaces React Query Key:** `['locations']`
