# ShakyTails API Testing Guide

## Quick Start Testing

### 1. Health Check
```bash
GET http://localhost:5000/health
```

### 2. Register a User
```json
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@shakytails.com",
  "phone": "1234567890",
  "password": "test1234"
}
```

### 3. Login
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@shakytails.com",
  "password": "test1234"
}
```

**Copy the `token` from response and use in headers:**
```
Authorization: Bearer <your-token>
```

### 4. Create Pet Profile
```json
POST http://localhost:5000/api/pets/create
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "petName": "Max",
  "type": "dog",
  "breed": "Labrador",
  "age": 2,
  "gender": "male",
  "medicalHistory": "Vaccinated, healthy",
  "allergies": "None",
  "rewardNote": "$100 reward if found"
}
```

### 5. Get My Pets
```bash
GET http://localhost:5000/api/pets/mine
Authorization: Bearer <your-token>
```

### 6. Generate QR Code
```bash
GET http://localhost:5000/api/qr/generate/<petId>
Authorization: Bearer <your-token>
```

### 7. View Public Pet Profile (No Auth)
```bash
GET http://localhost:5000/api/public/pet/<qrCodeId>
```

### 8. Mark Pet as Lost
```json
PUT http://localhost:5000/api/pets/lost/<petId>
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "lastKnownLocation": "Central Park, New York",
  "rewardNote": "$200 reward for safe return"
}
```

### 9. Report Found Pet (No Auth)
```json
POST http://localhost:5000/api/public/pet/found/<qrCodeId>
Content-Type: application/json

{
  "finderName": "John Finder",
  "finderPhone": "9876543210",
  "finderEmail": "finder@example.com",
  "location": "Brooklyn Bridge",
  "message": "Found your dog near the bridge. He's safe with me!"
}
```

### 10. Admin Login
```json
POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "email": "admin@shakytails.com",
  "password": "admin123"
}
```

### 11. Get Admin Stats
```bash
GET http://localhost:5000/api/admin/stats
Authorization: Bearer <admin-token>
```

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@shakytails.com","phone":"1234567890","password":"test1234"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@shakytails.com","password":"test1234"}'
```

### Create Pet
```bash
curl -X POST http://localhost:5000/api/pets/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"petName":"Buddy","type":"dog","breed":"Golden Retriever","age":3,"gender":"male"}'
```

## Testing Workflow

1. **Register** → Get user account
2. **Login** → Get JWT token
3. **Create Pet** → Get pet with QR code
4. **Generate QR** → Download QR image
5. **View Public Profile** → Test scanning
6. **Mark Lost** → Test alert system
7. **Report Found** → Test notification

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Common Issues

1. **Token Expired** → Login again
2. **Not Authorized** → Check token in headers
3. **Validation Error** → Check required fields
4. **Pet Not Found** → Verify pet ID
