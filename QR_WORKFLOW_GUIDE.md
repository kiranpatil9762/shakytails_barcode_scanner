# QR Code Pre-Generation Workflow Guide

## Overview
The ShakyTails system now supports **pre-generated QR codes** that can be produced in bulk, printed on physical tags, and distributed to customers who will register their pets later.

---

## 🔄 New Workflow

### Step 1: Admin Generates QR Codes in Bulk
1. Navigate to: **http://localhost:5000/admin-qr-generator.html**
2. Login with admin credentials:
   - Email: `theshakytails@gmail.com`
   - Password: `Shakytails@123`
3. Enter quantity (1-1000) and optional batch number
4. Click "Generate QR Codes"
5. Download all QR code images
6. Print QR codes on physical pet tags

### Step 2: Distribute Physical Tags
- Give printed QR tags to pet owners
- Each tag has a unique QR Code ID (e.g., `QR-ABC123-XYZ789`)
- Tags are pre-printed and ready to use

### Step 3: Pet Owner Registers
1. Pet owner receives physical tag with QR code
2. They visit: **http://localhost:5000/test-dashboard.html**
3. Register an account (Step 1)
4. Login (Step 2)
5. Create pet profile (Step 3) and **enter the QR Code ID from their tag**
6. System validates the QR code and assigns it to their pet

---

## 📊 Admin Panel Features

### Dashboard Stats
- **Total QR Codes**: All generated QR codes
- **Available**: Unassigned QR codes ready for distribution
- **Assigned**: QR codes linked to pet profiles
- **Active**: QR codes with active pet profiles

### Bulk Generation
```
POST /api/qr-inventory/generate-bulk
{
  "quantity": 100,
  "batchNumber": "BATCH-001"  // optional
}
```

### View Available QR Codes
```
GET /api/qr-inventory/available?limit=100
```

### Inventory Statistics
```
GET /api/qr-inventory/stats
```

---

## 🐾 Customer Registration

### With Pre-Generated QR Code
```javascript
POST /api/pets/create
Headers: { Authorization: Bearer <token> }
Body: {
  "qrCodeId": "QR-ABC123-XYZ789",  // From physical tag
  "petName": "Buddy",
  "type": "dog",
  "breed": "Golden Retriever",
  // ... other pet details
}
```

### Without QR Code (Auto-Generate)
```javascript
POST /api/pets/create
Headers: { Authorization: Bearer <token> }
Body: {
  // No qrCodeId provided
  "petName": "Buddy",
  "type": "dog",
  // ... system auto-generates QR code
}
```

---

## 🔍 QR Code Validation

### Verify QR Code Availability (Public)
```
GET /api/qr-inventory/verify/:qrCodeId
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "isAssigned": false,
  "message": "QR code is available for registration"
}
```

---

## 📁 File Locations

- **Generated QR Images**: `public/qrcodes/inventory/`
- **Admin Panel**: `public/admin-qr-generator.html`
- **Customer Dashboard**: `public/test-dashboard.html`
- **QR Scanner**: `public/mobile.html`

---

## 🚀 Quick Start Commands

### 1. Start Server
```powershell
cd c:\Users\Z004SVAZ\Desktop\Shakytails_Barcode
npm start
```

### 2. Access Admin Panel
```
http://localhost:5000/admin-qr-generator.html
```

### 3. Access Customer Dashboard
```
http://localhost:5000/test-dashboard.html
```

### 4. Mobile QR Scanner
```
http://localhost:5000/mobile.html
```

---

## 🎯 Testing the Workflow

### Test Scenario 1: Pre-Generated QR Code
1. **Admin**: Generate 10 QR codes via admin panel
2. **Admin**: Note down one QR Code ID (e.g., `QR-ABC123-XYZ789`)
3. **Customer**: Register account at test-dashboard.html
4. **Customer**: Create pet profile and enter the QR Code ID
5. **System**: Validates QR code, assigns it to pet, marks as "assigned"
6. **Verify**: Check admin panel stats - Available count should decrease

### Test Scenario 2: Auto-Generate QR Code
1. **Customer**: Register account at test-dashboard.html
2. **Customer**: Create pet profile, leave QR Code ID field empty
3. **System**: Auto-generates new QR code for the pet
4. **Verify**: Pet profile shows generated QR code

---

## 📊 Database Collections

### QRCodeInventory
```javascript
{
  qrCodeId: "QR-ABC123-XYZ789",
  qrCodeImage: "/qrcodes/inventory/QR-ABC123-XYZ789.png",
  publicUrl: "http://localhost:5000/pet-profile/QR-ABC123-XYZ789",
  isAssigned: false,
  pet: null,
  batchNumber: "BATCH-001",
  status: "available",  // available | assigned | active | inactive
  createdAt: "2025-01-23T10:00:00.000Z"
}
```

### Pet (with QR reference)
```javascript
{
  petName: "Buddy",
  owner: ObjectId("..."),
  qrCode: "QR-ABC123-XYZ789",
  qrCodeImage: "/qrcodes/inventory/QR-ABC123-XYZ789.png",
  publicUrl: "http://localhost:5000/pet-profile/QR-ABC123-XYZ789",
  // ... other pet details
}
```

---

## 🔐 Admin API Endpoints

All admin endpoints require authentication with admin role.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/qr-inventory/generate-bulk` | POST | Generate bulk QR codes |
| `/api/qr-inventory/available` | GET | List available QR codes |
| `/api/qr-inventory/stats` | GET | Get inventory statistics |
| `/api/qr-inventory/verify/:qrCodeId` | GET | Verify QR code (public) |

---

## 💡 Benefits

1. **Pre-Print Tags**: Print QR codes on physical tags before customers purchase
2. **Batch Production**: Generate 100s of QR codes at once for manufacturing
3. **Inventory Management**: Track available vs. assigned QR codes
4. **Quality Control**: Verify QR codes before distribution
5. **Analytics**: Monitor QR code usage and registration rates
6. **Flexible**: System supports both pre-generated and auto-generated QR codes

---

## 🛠️ Troubleshooting

### QR Code Not Found
- **Error**: "QR code not found in inventory"
- **Solution**: Verify QR Code ID is correct, check admin panel for available codes

### QR Code Already Assigned
- **Error**: "QR code already assigned to another pet"
- **Solution**: Use a different QR code, check admin panel for available codes

### Invalid QR Code Format
- **Error**: "Invalid QR code format"
- **Solution**: QR Code ID should match format `QR-XXXXXX-XXXXXX`

---

## 📞 Support

For questions or issues:
- Email: theshakytails@gmail.com
- Check logs: Server console output
- Review API responses in browser DevTools (F12)

---

**Last Updated**: January 23, 2025
