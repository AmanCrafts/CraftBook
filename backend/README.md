# CraftBook Backend API

Professional Node.js/Express backend with clean architecture.

## 📁 Project Structure

```
backend/
├── src/
│   ├── api/                    # API layer (versioned)
│   │   └── v1/
│   │       └── index.js        # API v1 routes aggregator
│   │
│   ├── modules/                # Feature modules (domain-focused)
│   │   ├── user/
│   │   │   ├── user.controller.js    # HTTP handlers
│   │   │   ├── user.service.js       # Business logic
│   │   │   ├── user.repository.js    # Data access
│   │   │   └── user.routes.js        # Route definitions
│   │   │
│   │   ├── post/
│   │   │   ├── post.controller.js
│   │   │   ├── post.service.js
│   │   │   ├── post.repository.js
│   │   │   └── post.routes.js
│   │   │
│   │   └── upload/
│   │       ├── upload.controller.js
│   │       ├── upload.service.js
│   │       └── upload.routes.js
│   │
│   ├── config/                 # Configuration files
│   │   ├── index.js            # Main config aggregator
│   │   ├── database.js         # Prisma client setup
│   │   ├── supabase.js         # Supabase client setup
│   │   └── multer.js           # File upload configuration
│   │
│   ├── middlewares/            # Express middlewares
│   │   ├── error.middleware.js       # Error handling
│   │   └── logger.middleware.js      # Request logging
│   │
│   ├── app.js                  # Express app configuration
│   └── server.js               # Server startup & graceful shutdown
│
├── prisma/                     # Database schema & migrations
│   ├── schema.prisma
│   └── migrations/
│
├── generated/                  # Prisma generated client
├── lib/                        # Legacy (can be removed)
├── middleware/                 # Legacy (can be removed)
├── .env                        # Environment variables
├── .gitignore
└── package.json
```

## 🏗️ Architecture Layers

### 1. **Controller Layer** (`*.controller.js`)

- Thin HTTP request handlers
- Validates request data
- Calls service layer
- Formats HTTP responses
- Error handling

### 2. **Service Layer** (`*.service.js`)

- Contains business logic
- Orchestrates between repositories
- Handles complex operations
- Validates business rules

### 3. **Repository Layer** (`*.repository.js`)

- Data access layer
- All database queries (Prisma)
- CRUD operations
- Query optimization

### 4. **Routes Layer** (`*.routes.js`)

- Express route definitions
- Maps HTTP methods to controllers
- Route-specific middleware

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Setup Environment

Configure `.env` file with your credentials:

```env
PORT=3000
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_BUCKET_NAME=Images
```

### Run Database Migrations

```bash
npm run prisma:migrate
```

### Generate Prisma Client

```bash
npm run prisma:generate
```

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

## 🧪 Test Accounts

The database is seeded with test data for development and testing purposes. All test accounts share the same password.

### Default Password for All Test Accounts

```
password123
```

### Sample Test Accounts

| Email                            | Name               | Medium  |
| -------------------------------- | ------------------ | ------- |
| `emma.smith@example.com`         | Emma Smith         | Various |
| `liam.johnson@example.com`       | Liam Johnson       | Various |
| `olivia.williams@example.com`    | Olivia Williams    | Various |
| `noah.brown@example.com`         | Noah Brown         | Various |
| `ava.jones@example.com`          | Ava Jones          | Various |
| `ethan.garcia@example.com`       | Ethan Garcia       | Various |
| `sophia.miller@example.com`      | Sophia Miller      | Various |
| `mason.davis@example.com`        | Mason Davis        | Various |
| `isabella.rodriguez@example.com` | Isabella Rodriguez | Various |
| `william.martinez@example.com`   | William Martinez   | Various |

### Seed Data Overview

- **50 Users** - Each with unique profile pictures and bios
- **500-750 Posts** - Each user has 10-15 posts with artistic images
- **5-30 Likes per Post** - Random likes from other users
- **Comments** - Random comments on posts
- **Follow Relationships** - Users follow each other randomly

### Running the Seed Script

To reset and reseed the database:

```bash
npm run prisma:seed
```

> ⚠️ **Warning**: This will delete all existing data and replace it with fresh test data.

### Email Pattern

All test user emails follow the pattern:

```
{firstname}.{lastname}@example.com
```

For example:

- First name: `Emma`, Last name: `Smith` → `emma.smith@example.com`
- First name: `Liam`, Last name: `Johnson` → `liam.johnson@example.com`

## 📡 API Endpoints

### Health Check

```
GET /
GET /api/health
```

### Users

```
GET    /api/users              # Get all users
GET    /api/users/:id          # Get user by ID
GET    /api/users/google/:id   # Get user by Google ID
POST   /api/users              # Create new user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
```

### Posts

```
GET    /api/posts                          # Get all posts
GET    /api/posts/:id                      # Get post by ID
GET    /api/posts/recent                   # Get recent posts
GET    /api/posts/popular                  # Get popular posts
GET    /api/posts/process                  # Get process posts
GET    /api/posts/user/:userId             # Get posts by user
GET    /api/posts/tag/:tag                 # Search by tag
GET    /api/posts/medium/:medium           # Get by medium
GET    /api/posts/search/title/:title      # Search by title
POST   /api/posts                          # Create new post
PUT    /api/posts/:id                      # Update post
DELETE /api/posts/:id                      # Delete post
```

### Upload

```
POST   /api/upload             # Upload image
DELETE /api/upload/:id         # Delete image
```

## 🛠️ Available Scripts

| Script                    | Description                           |
| ------------------------- | ------------------------------------- |
| `npm start`               | Start production server               |
| `npm run dev`             | Start development server with nodemon |
| `npm test`                | Test database connection              |
| `npm run prisma:migrate`  | Run database migrations               |
| `npm run prisma:generate` | Generate Prisma client                |
| `npm run prisma:studio`   | Open Prisma Studio                    |

## 📦 Key Dependencies

- **Express** - Web framework
- **Prisma** - Database ORM
- **@supabase/supabase-js** - Supabase client
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management
- **Nodemon** - Development auto-reload

## 🔒 Error Handling

Centralized error handling with:

- Proper HTTP status codes
- Detailed error messages in development
- Clean error responses in production
- Multer error handling
- Prisma error handling

## 📝 Code Style

- **ES6+ Modules** - Using `import/export`
- **Async/Await** - For asynchronous operations
- **Singleton Pattern** - For database connection
- **Class-based** - Controllers, Services, Repositories
- **JSDoc Comments** - Function documentation

## 🔄 Migration from Old Structure

Old files that can be removed:

- `server.js` (root) → moved to `src/server.js`
- `controllers.js` → split into modules
- `lib/` → moved to `src/config/`
- `middleware/` → moved to `src/middlewares/`

## 🎯 Best Practices

1. **Separation of Concerns** - Each layer has specific responsibilities
2. **DRY Principle** - Reusable code in services and repositories
3. **Error Handling** - Consistent error responses
4. **Logging** - Request logging in development
5. **Graceful Shutdown** - Proper cleanup on server stop
6. **Environment Config** - Centralized configuration
7. **API Versioning** - Prepared for future versions

## 🚦 Development Workflow

1. Define routes in `*.routes.js`
2. Create controller methods in `*.controller.js`
3. Implement business logic in `*.service.js`
4. Add database queries in `*.repository.js`
5. Test endpoints
6. Add error handling
7. Document API changes

---

Built with ❤️ for CraftBook
