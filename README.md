# 🐾 ShakyTails Backend - Premium QR Pet ID Tag System

A complete backend system for managing pet profiles with QR codes, lost & found features, vaccination reminders, and admin dashboard.

## 📋 Features

### Core Features
- ✅ **User Authentication** - Register, Login, Password Reset with JWT
- ✅ **Pet Profile Management** - Create, Update, Delete pet profiles
- ✅ **QR Code Generation** - Unique QR codes for each pet
- ✅ **Lost & Found System** - Mark pets as lost, receive finder reports
- ✅ **Email Notifications** - Instant alerts for lost/found pets
- ✅ **Vaccination Tracking** - Record vaccinations and set reminders
- ✅ **Auto Reminders** - Daily cron job sends vaccine due reminders
- ✅ **Admin Dashboard** - Manage users and pets
- ✅ **Scan Analytics** - Track QR code scans with IP logging
- ✅ **Image Upload** - Pet profile pictures

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **QR Codes:** qrcode npm package
- **Email:** Nodemailer
- **File Upload:** Multer
- **Scheduling:** node-cron
- **Security:** bcryptjs

## 📁 Project Structure

```
shakytails-backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── email.js              # Email configuration & templates
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── petController.js      # Pet CRUD operations
│   ├── qrController.js       # QR code generation
│   ├── reminderController.js # Vaccine reminders
│   └── adminController.js    # Admin operations
├── models/
│   ├── User.js              # User schema
│   ├── Pet.js               # Pet schema
│   ├── FoundReport.js       # Found pet reports
│   └── VaccineReminder.js   # Vaccine reminders
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── petRoutes.js         # Pet endpoints
│   ├── qrRoutes.js          # QR endpoints
│   ├── reminderRoutes.js    # Reminder endpoints
│   ├── adminRoutes.js       # Admin endpoints
│   └── publicRoutes.js      # Public endpoints
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── utils/
│   ├── generateQR.js        # QR code utilities
│   ├── token.js             # Token utilities
│   └── uploader.js          # File upload utilities
├── public/
│   ├── qrcodes/             # Generated QR codes
│   └── uploads/             # Uploaded images
├── .env.example             # Environment variables template
├── .gitignore
├── app.js                   # Express app setup
├── server.js                # Server & cron jobs
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email notifications)

### Step 1: Clone & Install Dependencies

```bash
cd Shakytails_Barcode
npm install
```

### Step 2: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shakytails

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=ShakyTails <noreply@shakytails.com>

# URLs
BASE_URL=http://localhost:5000
FRONTEND_URL=https://shakytails.com

# Admin
ADMIN_EMAIL=admin@shakytails.com
ADMIN_PASSWORD=admin123
```

### Step 3: Gmail App Password Setup

1. Go to Google Account Settings
2. Security → 2-Step Verification (enable it)
3. App Passwords → Generate new app password
4. Copy the 16-character password
5. Use it in `EMAIL_PASS` in `.env`

### Step 4: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (cloud) and update `MONGODB_URI`

### Step 5: Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start at `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |
| POST | `/forgot-password` | Request password reset | No |
| PUT | `/reset-password/:resetToken` | Reset password | No |
| PUT | `/update` | Update user details | Yes |
| PUT | `/update-password` | Change password | Yes |

### Pets (`/api/pets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create` | Create pet profile | Yes |
| PUT | `/update/:id` | Update pet profile | Yes |
| DELETE | `/delete/:id` | Delete pet | Yes |
| GET | `/mine` | Get all my pets | Yes |
| GET | `/get/:id` | Get single pet (owner) | Yes |
| PUT | `/lost/:id` | Mark pet as lost | Yes |
| POST | `/:id/vaccination` | Add vaccine record | Yes |
| GET | `/:id/stats` | Get pet statistics | Yes |

### QR Codes (`/api/qr`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/generate/:petId` | Generate QR code | Yes |
| POST | `/regenerate/:petId` | Regenerate QR code | Yes |
| GET | `/dataurl/:petId` | Get QR as base64 | Yes |

### Public (`/api/public`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/pet/:qrId` | Get public pet profile | No |
| POST | `/pet/found/:qrId` | Report found pet | No |

### Reminders (`/api/reminders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all reminders | Yes |
| GET | `/pending` | Get pending reminders | Yes |
| PUT | `/:id/complete` | Mark reminder complete | Yes |
| DELETE | `/:id` | Delete reminder | Yes |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Admin login | No |
| GET | `/stats` | Dashboard statistics | Admin |
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| PUT | `/users/:id/toggle-active` | Toggle user status | Admin |
| GET | `/pets` | Get all pets | Admin |
| DELETE | `/pets/:id` | Delete pet | Admin |

## 🧪 Testing the API

### Using Postman/Thunder Client

**1. Register User:**
```json
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

**2. Login:**
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response will include `token`. Use it in subsequent requests:
```
Authorization: Bearer <your-token-here>
```

**3. Create Pet Profile:**
```json
POST http://localhost:5000/api/pets/create
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "petName": "Buddy",
  "type": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "allergies": "None",
  "medicalHistory": "Healthy",
  "emergencyContacts": [
    {
      "name": "Jane Doe",
      "phone": "9876543210",
      "relation": "Family"
    }
  ]
}
```

**4. Get Public Pet Profile:**
```json
GET http://localhost:5000/api/public/pet/<qrCodeId>
```

## ⏰ Cron Jobs

The system automatically runs scheduled tasks:

- **Daily at 9:00 AM** - Send vaccine reminders for due vaccinations
- **Hourly (dev mode)** - Check for pending reminders

## 📧 Email Templates

Pre-built email templates for:
- Welcome email
- Password reset
- Pet lost alert
- Pet found notification
- Vaccination reminders

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes with middleware
- Role-based access control (User/Admin)
- Input validation
- Secure password reset flow

## 📊 Scan Analytics

Each QR code scan is tracked:
- Total scan count
- Timestamp of each scan
- IP address (can be extended with geolocation)
- Scan history logs

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or check service status
systemctl status mongod
```

### Email Not Sending
- Verify Gmail App Password is correct
- Check if 2-Step Verification is enabled
- Test SMTP connection

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000
```

## 🚀 Deployment

### Deploy to Heroku

```bash
heroku create shakytails-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-mongodb-atlas-uri>
heroku config:set JWT_SECRET=<your-secret>
# ... set all env variables
git push heroku main
```

### Deploy to Railway/Render

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## 📝 Future Enhancements

- [ ] WhatsApp notifications integration
- [ ] SMS alerts via Twilio
- [ ] Google Maps integration for location
- [ ] Payment integration for premium features
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (Socket.io)
- [ ] Export pet profile as PDF

## 📄 License

ISC

## 👨‍💻 Author

**ShakyTails Team**

---

## 🎉 Ready to Go!

Your ShakyTails backend is now fully set up! 🐾

For support or issues, please create an issue in the repository.

**Happy Coding!** 🚀
