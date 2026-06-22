import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    maxlength: [100, 'Email cannot be more than 100 characters'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    lowercase: true,
    trim: true,
  },
  company: {
    type: String,
    maxlength: [100, 'Company name cannot be more than 100 characters'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide a message.'],
    maxlength: [5000, 'Message cannot exceed 5000 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
