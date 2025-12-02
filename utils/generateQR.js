const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique QR Code ID
 */
const generateUniqueId = () => {
  return uuidv4().split('-')[0]; // Short unique ID
};

/**
 * Generate QR Code image and save to file
 * @param {string} qrCodeId - Unique ID for the QR code
 * @param {string} petId - Pet's database ID
 * @returns {Promise<Object>} - QR code data
 */
const generateQRCode = async (qrCodeId, petId) => {
  try {
    // Create public URL for QR landing page
    const publicUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/qr-landing.html?qr=${qrCodeId}`;

    // Create directory if it doesn't exist
    const qrDir = path.join(__dirname, '../public/qrcodes');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    // Generate filename
    const filename = `${qrCodeId}.png`;
    const filepath = path.join(qrDir, filename);

    // Generate QR code with options
    await QRCode.toFile(filepath, publicUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Return QR code data
    return {
      qrCodeId,
      qrCodeImage: `/qrcodes/${filename}`,
      publicUrl,
      downloadUrl: `${process.env.BASE_URL}/qrcodes/${filename}`,
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate QR Code as Data URL (for email embedding)
 * @param {string} qrCodeId - Unique ID for the QR code
 * @returns {Promise<string>} - Base64 data URL
 */
const generateQRCodeDataURL = async (qrCodeId) => {
  try {
    const publicUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/qr-landing.html?qr=${qrCodeId}`;
    const dataUrl = await QRCode.toDataURL(publicUrl, {
      width: 300,
      margin: 2,
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code data URL:', error);
    throw new Error('Failed to generate QR code data URL');
  }
};

module.exports = {
  generateUniqueId,
  generateQRCode,
  generateQRCodeDataURL,
};
