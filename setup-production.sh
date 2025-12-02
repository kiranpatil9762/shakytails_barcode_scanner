#!/bin/bash

echo "🚀 Starting ShakyTails Production Setup..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please copy .env.production to .env and configure it"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/uploads public/qrcodes logs

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Run database migrations if needed
echo "🗄️  Checking database..."
# Add any migration scripts here if needed

echo "✅ Setup complete!"
echo ""
echo "🌐 To start the server:"
echo "   npm start"
echo ""
echo "📊 To monitor with PM2:"
echo "   pm2 start server.js --name shakytails"
echo "   pm2 save"
echo ""
