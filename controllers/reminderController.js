const VaccineReminder = require('../models/VaccineReminder');
const Pet = require('../models/Pet');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Get all vaccine reminders for user
// @route   GET /api/reminders
// @access  Private
exports.getReminders = async (req, res) => {
  try {
    const reminders = await VaccineReminder.find({ owner: req.user.id })
      .populate('pet', 'petName type profileImage')
      .sort('dueDate');

    res.status(200).json({
      success: true,
      count: reminders.length,
      reminders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get pending vaccine reminders
// @route   GET /api/reminders/pending
// @access  Private
exports.getPendingReminders = async (req, res) => {
  try {
    const reminders = await VaccineReminder.find({
      owner: req.user.id,
      status: 'pending',
      dueDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // Due within 7 days
    })
      .populate('pet', 'petName type profileImage')
      .sort('dueDate');

    res.status(200).json({
      success: true,
      count: reminders.length,
      reminders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Mark reminder as completed
// @route   PUT /api/reminders/:id/complete
// @access  Private
exports.completeReminder = async (req, res) => {
  try {
    let reminder = await VaccineReminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found',
      });
    }

    // Make sure user is reminder owner
    if (reminder.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    reminder.status = 'completed';
    await reminder.save();

    res.status(200).json({
      success: true,
      reminder,
      message: 'Reminder marked as completed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await VaccineReminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found',
      });
    }

    // Make sure user is reminder owner
    if (reminder.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    await reminder.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Send vaccine reminders (used by cron job)
// @route   Internal function
// @access  Internal
exports.sendVaccineReminders = async () => {
  try {
    // Find all pending reminders that are due today or overdue
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders = await VaccineReminder.find({
      status: 'pending',
      reminderSent: false,
      dueDate: { $lte: today },
    }).populate('pet owner');

    console.log(`📧 Found ${reminders.length} vaccine reminders to send`);

    for (const reminder of reminders) {
      try {
        // Format due date
        const dueDate = reminder.dueDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        // Send email
        await sendEmail({
          email: reminder.owner.email,
          subject: `Vaccination Reminder for ${reminder.pet.petName}`,
          html: emailTemplates.vaccineReminder(
            reminder.pet.petName,
            reminder.vaccineName,
            dueDate
          ),
        });

        // Update reminder
        reminder.reminderSent = true;
        reminder.reminderSentDate = new Date();
        reminder.status = 'sent';
        await reminder.save();

        console.log(`✅ Reminder sent for ${reminder.pet.petName}`);
      } catch (error) {
        console.error(`❌ Failed to send reminder for ${reminder.pet.petName}:`, error);
      }
    }

    return {
      success: true,
      remindersSent: reminders.length,
    };
  } catch (error) {
    console.error('❌ Error sending vaccine reminders:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
