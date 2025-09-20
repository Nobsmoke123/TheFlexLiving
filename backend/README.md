# Flex Living Reviews - Backend API

A robust RESTful API built with Node.js, Express, and TypeScript for managing property listings and customer reviews. This backend service powers the Flex Living property management platform with comprehensive validation, pagination, and external API integrations.

## 🚀 Features

- **Property Management**: Full CRUD operations for property listings
- **Review System**: Customer review management with approval workflows
- **Advanced Validation**: Comprehensive input validation using Joi schemas
- **Smart Pagination**: Context-aware pagination with filtering and sorting
- **External API Integration**: Hostaway API integration with fallback to mock data
- **Security First**: Helmet, CORS, input sanitization, and SQL injection prevention
- **Production Ready**: TypeScript, comprehensive testing

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with parameterized queries
- **Validation**: Joi validation library
- **Testing**: Jest with Supertest (43 comprehensive tests)
- **Security**: Helmet, CORS, Morgan logging
- **Development**: Nodemon, ts-node for hot reloading

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express application setup
│   ├── server.ts           # Server entry point
│   ├── config/
│   │   └── database.ts     # Database configuration
│   ├── controllers/        # Request handlers
│   │   ├── propertyController.ts
│   │   └── reviewsController.ts
│   ├── models/             # Data models with pagination
│   │   ├── property.ts
│   │   └── review.ts
│   ├── routes/             # API route definitions
│   │   └── routes.ts
│   ├── services/           # External API services
│   │   └── hostawayService.ts
│   ├── utils/              # Utility functions
│   │   ├── validation.ts   # Joi validation schemas
│   │   ├── pagination.ts   # Pagination helpers
│   │   └── types.ts        # TypeScript type definitions
│   └── data/               # Mock data for development
├── tests/                  # Comprehensive test suite
└── coverage/               # Test coverage reports
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup** (optional)

   ```bash
   # Create .env file for custom configuration
   cp .env.example .env
   ```

4. **Start development server**

   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3001`

### Production Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:3001/api
```

### Health Check

```http
GET /health
```

### Properties API

#### Get All Properties

```http
GET /properties?page=1&limit=10&sortBy=name&sortOrder=asc&minRating=4
```

**Query Parameters:**

- `page` (number): Page number for pagination
- `limit` (number): Items per page (max 100)
- `sortBy` (string): Sort field (name, avgRating, totalReviews)
- `sortOrder` (string): asc or desc
- `minRating` (number): Filter by minimum rating

### Reviews API

#### Get All Reviews

```http
GET /reviews?page=1&limit=10&propertyId=123&approved=true
```

**Query Parameters:**

- `page` (number): Page number for pagination
- `limit` (number): Items per page (max 100)
- `propertyId` (number): Filter by property ID
- `approved` (boolean): Filter by approval status
- `minRating` (number): Filter by minimum rating
- `channel` (string): Filter by review channel

#### Update Review Approval

```http
PUT /reviews/:id/approval
Content-Type: application/json

{
  "approved": true
}
```

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Error Responses

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid query parameters",
  "details": [...]
}
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### End-to-End Tests Only

```bash
npm run test:e2e
```

### Test Categories

- **Unit Tests**: Individual component testing
- **Integration Tests**: Full workflow testing
- **End-to-End Tests**: Complete API testing
- **Validation Tests**: Input validation scenarios
- **Pagination Tests**: Pagination and filtering
- **Error Handling Tests**: Edge cases and error conditions

**Current Coverage**: 79.54% with 43 comprehensive tests

## 🔒 Security Features

- **Input Validation**: Joi schemas for all endpoints
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured for frontend domains
- **Security Headers**: Helmet middleware
- **Request Logging**: Morgan HTTP request logger
- **Environment Variables**: Sensitive data protection

## 📊 Advanced Features

### Validation System

- Context-aware validation schemas
- Custom error messages
- Parameter sanitization with regex patterns
- Query parameter validation

### Pagination System

- SQL-level pagination for performance
- Context-aware sorting for different entity types
- Flexible filtering with multiple criteria
- Comprehensive metadata in responses

### External API Integration

- Hostaway API integration
- Graceful fallback to mock data
- Error handling and retry logic
- Data transformation and normalization

## 🚢 Deployment

### Railway Deployment

The project is configured for Railway deployment with:

- ✅ `build` script for TypeScript compilation
- ✅ `start` script for production server
- ✅ Proper main entry point (`dist/src/server.js`)
- ✅ Environment variable support
- ✅ Health check endpoint

### Docker Support (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 📈 Performance

- **Database**: SQLite with optimized queries
- **Pagination**: SQL LIMIT/OFFSET for efficient data retrieval
- **Caching**: Ready for Redis integration
- **Logging**: Structured logging with Morgan

## 🔧 Environment Variables

```bash
# Optional configuration
PORT=3001
NODE_ENV=production
HOSTAWAY_API_KEY=your_api_key_here
DATABASE_PATH=./config/database.db
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

ISC License - see LICENSE file for details

---

**Built with ❤️ for modern property management**
