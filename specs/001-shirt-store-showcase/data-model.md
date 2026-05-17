# Data Model: Arcanjus Shirt Store Showcase

**Date**: 2026-05-16 | **Branch**: `001-shirt-store-showcase`

## Entities

### Shirt

| Field        | Type          | Constraints                          |
|--------------|---------------|--------------------------------------|
| id           | UUID          | PK, auto-generated                   |
| name         | String        | Required, max 200 chars              |
| description  | Text          | Required                             |
| price        | Decimal(10,2) | Required, >= 0, stored in BRL        |
| sizes        | String[]      | Required, at least one (PP/P/M/G/GG) |
| color        | String        | Required                             |
| category     | String        | Required (e.g., casual, social, polo)|
| images       | ShirtImage[]  | At least one required                |
| active       | Boolean       | Default true, controls visibility    |
| createdAt    | DateTime      | Auto-set on creation                 |
| updatedAt    | DateTime      | Auto-set on update                   |

### ShirtImage

| Field     | Type     | Constraints                        |
|-----------|----------|------------------------------------|
| id        | UUID     | PK, auto-generated                 |
| shirtId   | UUID     | FK → Shirt.id, cascade delete      |
| url       | String   | Required, S3 object URL            |
| alt       | String   | Required, accessibility text        |
| sortOrder | Integer  | Default 0, controls display order  |
| isPrimary | Boolean  | Default false, one per shirt       |

### StoreInfo

| Field       | Type     | Constraints                        |
|-------------|----------|------------------------------------|
| id          | UUID     | PK (singleton record)              |
| name        | String   | Required (store display name)      |
| address     | String   | Required                           |
| city        | String   | Required                           |
| state       | String   | Required                           |
| zipCode     | String   | Required                           |
| phone       | String   | Required                           |
| latitude    | Decimal  | Required                           |
| longitude   | Decimal  | Required                           |
| hoursJson   | JSON     | Required, structured hours object  |
| aboutTitle  | String   | Required                           |
| aboutContent| Text     | Required (brand story, markdown)   |
| updatedAt   | DateTime | Auto-set on update                 |

### AdminUser

| Field        | Type     | Constraints                       |
|--------------|----------|-----------------------------------|
| id           | UUID     | PK, auto-generated                |
| email        | String   | Required, unique, validated       |
| passwordHash | String   | Required, bcrypt                  |
| name         | String   | Required                          |
| createdAt    | DateTime | Auto-set on creation              |
| lastLoginAt  | DateTime | Nullable, updated on login        |

### PageViewEvent

| Field      | Type     | Constraints                        |
|------------|----------|------------------------------------|
| id         | UUID     | PK, auto-generated                 |
| page       | String   | Required (URL path)                |
| referrer   | String   | Nullable                           |
| deviceType | String   | Required (mobile/tablet/desktop)   |
| timestamp  | DateTime | Required, indexed for queries      |

### ProductClickEvent

| Field      | Type     | Constraints                        |
|------------|----------|------------------------------------|
| id         | UUID     | PK, auto-generated                 |
| shirtId    | UUID     | FK → Shirt.id (nullable on delete) |
| actionType | String   | Required (view_detail/filter/image)|
| timestamp  | DateTime | Required, indexed for queries      |

## Relationships

```
Shirt 1 ──── * ShirtImage
Shirt 1 ──── * ProductClickEvent
StoreInfo    (singleton, no FK relationships)
AdminUser    (standalone, no FK relationships)
PageViewEvent (standalone, no FK relationships)
```

## Indexes

- `Shirt`: index on `active`, `category`, `color` (catalog filtering)
- `ShirtImage`: index on `shirtId` + `sortOrder`
- `PageViewEvent`: index on `timestamp` (analytics queries, retention purge)
- `ProductClickEvent`: index on `timestamp`, index on `shirtId` (reports)
- `AdminUser`: unique index on `email`

## Data Retention

- **Analytics events** (PageViewEvent, ProductClickEvent): 12-month rolling window. Scheduled job purges records older than 12 months daily.
- **Shirts**: Soft-deleted via `active = false` (preserves analytics references).
- **StoreInfo**: Single record, updated in place.

## Validation Rules

- Shirt price MUST be non-negative
- At least one ShirtImage MUST exist for a shirt to be `active = true`
- Exactly one ShirtImage per shirt MUST have `isPrimary = true`
- AdminUser email MUST be valid email format
- StoreInfo hoursJson MUST follow structure: `{ "monday": { "open": "HH:MM", "close": "HH:MM" }, ... }`
- Shirt sizes MUST be from allowed set: PP, P, M, G, GG, XGG
