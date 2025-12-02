// Quick script to update existing pet records with missing fields
require('dotenv').config();
const mongoose = require('mongoose');
const Pet = require('./models/Pet');
const User = require('./models/User');

const updateData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Find Jimmy's pet record
    const pet = await Pet.findOne({ petName: 'Jimmy' }).populate('owner');
    
    if (pet) {
      console.log('\n📋 Found pet:', pet.petName);
      console.log('Current color:', pet.color || 'NOT SET');
      console.log('Owner:', pet.owner.name);
      console.log('Owner address:', pet.owner.address || 'NOT SET');
      
      // Update pet color if not set
      if (!pet.color) {
        pet.color = 'Brown'; // Default color for Jimmy
        await pet.save();
        console.log('✅ Updated pet color to: Brown');
      }
      
      // Update owner address if not set
      if (!pet.owner.address) {
        const user = await User.findById(pet.owner._id);
        user.address = '123 Main Street, City'; // Default address
        await user.save();
        console.log('✅ Updated owner address');
      }
      
      console.log('\n✅ All updates complete!');
    } else {
      console.log('❌ Pet named Jimmy not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateData();
