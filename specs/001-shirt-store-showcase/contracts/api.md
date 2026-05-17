# API Contracts: Arcanjus Shirt Store Showcase

**Base URL**: `/api/v1`

## Public Endpoints (no auth)

### GET /shirts

List all active shirts with optional filtering.

**Query Parameters**:

| Param    | Type   | Required | Description                        |
|----------|--------|----------|------------------------------------|
| category | string | No       | Filter by category                 |
| color    | string | No       | Filter by color                    |
| size     | string | No       | Filter by available size           |
| sort     | string | No       | `price_asc`, `price_desc`, `newest`|
| page     | int    | No       | Page number (default 1)            |
| limit    | int    | No       | Items per page (default 20, max 50)|

**Response 200**:
```json
{
  "shirts": [
    {
      "id": "uuid",
      "name": "Camisa Polo Clássica",
      "price": 129.90,
      "color": "azul",
      "category": "polo",
      "sizes": ["P", "M", "G"],
      "primaryImage": {
        "url": "https://...",
        "alt": "Camisa polo azul"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### GET /shirts/:id

Get full details for a single shirt.

**Response 200**:
```json
{
  "id": "uuid",
  "name": "Camisa Polo Clássica",
  "description": "Camisa polo em algodão premium...",
  "price": 129.90,
  "color": "azul",
  "category": "polo",
  "sizes": ["P", "M", "G", "GG"],
  "images": [
    {
      "id": "uuid",
      "url": "https://...",
      "alt": "Camisa polo azul - frente",
      "isPrimary": true,
      "sortOrder": 0
    }
  ],
  "createdAt": "2026-05-16T10:00:00Z"
}
```

**Response 404**: `{ "error": "Shirt not found" }`

### GET /store-info

Get store information (singleton).

**Response 200**:
```json
{
  "name": "Arcanjus",
  "address": "Rua ...",
  "city": "...",
  "state": "...",
  "zipCode": "00000-000",
  "phone": "(00) 0000-0000",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "hours": {
    "monday": { "open": "09:00", "close": "18:00" },
    "tuesday": { "open": "09:00", "close": "18:00" },
    "wednesday": { "open": "09:00", "close": "18:00" },
    "thursday": { "open": "09:00", "close": "18:00" },
    "friday": { "open": "09:00", "close": "18:00" },
    "saturday": { "open": "09:00", "close": "13:00" },
    "sunday": null
  },
  "aboutTitle": "Sobre a Arcanjus",
  "aboutContent": "Nossa história..."
}
```

### GET /shirts/filters

Get available filter options (dynamic based on active shirts).

**Response 200**:
```json
{
  "categories": ["casual", "social", "polo"],
  "colors": ["azul", "branco", "preto"],
  "sizes": ["PP", "P", "M", "G", "GG"]
}
```

### POST /analytics/event

Track a visitor event (fire-and-forget from client).

**Request Body**:
```json
{
  "type": "page_view",
  "page": "/camisas/uuid",
  "referrer": "https://google.com",
  "deviceType": "mobile"
}
```

or:

```json
{
  "type": "product_click",
  "shirtId": "uuid",
  "actionType": "view_detail"
}
```

**Response 202**: `{ "status": "accepted" }`

## Admin Endpoints (auth required — Bearer JWT)

### POST /admin/auth/login

**Request Body**:
```json
{
  "email": "admin@arcanjus.com",
  "password": "..."
}
```

**Response 200**:
```json
{
  "token": "jwt...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@arcanjus.com"
  }
}
```

**Response 401**: `{ "error": "Invalid credentials" }`

### POST /admin/auth/refresh

**Headers**: `Authorization: Bearer <token>`

**Response 200**: `{ "token": "new-jwt...", "expiresIn": 86400 }`

### GET /admin/shirts

List all shirts (including inactive). Same query params as public + `active` filter.

### POST /admin/shirts

Create a new shirt.

**Request Body** (multipart/form-data):
```
name: string (required)
description: string (required)
price: number (required)
color: string (required)
category: string (required)
sizes: string[] (required)
images: File[] (at least one required)
```

**Response 201**: Full shirt object

### PUT /admin/shirts/:id

Update shirt details. Same fields as POST (all optional except id).

**Response 200**: Updated shirt object

### DELETE /admin/shirts/:id

Soft-delete a shirt (sets `active = false`).

**Response 200**: `{ "status": "deactivated" }`

### PUT /admin/store-info

Update store information.

**Request Body**: Same structure as GET /store-info response (all fields optional).

**Response 200**: Updated store info object

### GET /admin/analytics/overview

**Query Parameters**:

| Param | Type   | Required | Description                     |
|-------|--------|----------|---------------------------------|
| from  | string | No       | Start date (ISO, default 30d ago)|
| to    | string | No       | End date (ISO, default now)     |

**Response 200**:
```json
{
  "period": { "from": "2026-04-16", "to": "2026-05-16" },
  "totalPageViews": 12450,
  "totalProductClicks": 3280,
  "uniqueVisitorEstimate": 4200,
  "deviceBreakdown": {
    "mobile": 65,
    "desktop": 30,
    "tablet": 5
  },
  "topPages": [
    { "page": "/camisas", "views": 4500 },
    { "page": "/", "views": 3200 }
  ],
  "topShirts": [
    { "shirtId": "uuid", "name": "Camisa Polo Clássica", "clicks": 340 }
  ]
}
```

### GET /admin/analytics/shirts/:id

Detailed analytics for a single shirt.

**Response 200**:
```json
{
  "shirtId": "uuid",
  "name": "Camisa Polo Clássica",
  "totalClicks": 340,
  "clicksByAction": {
    "view_detail": 280,
    "image": 60
  },
  "dailyClicks": [
    { "date": "2026-05-15", "count": 12 },
    { "date": "2026-05-16", "count": 8 }
  ]
}
```

## Error Format (all endpoints)

```json
{
  "error": "Human-readable error message",
  "code": "VALIDATION_ERROR",
  "details": [
    { "field": "price", "message": "Must be a non-negative number" }
  ]
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 202: Accepted (async)
- 400: Validation error
- 401: Unauthorized
- 404: Not found
- 500: Internal server error
