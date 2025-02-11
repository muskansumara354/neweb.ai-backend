const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Unique Clerk user ID
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email regex
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    profileImage: { type: String, default: '' }, // Profile image URL
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deleted'],
      default: 'active',
    },
    website_count: {
      type: Number,
      default: 0,
    },
    subscription: {
      plan: {
        type: String,
        enum: [
          // add or remove plans here
          'pro_a',
          'pro_b',
          'pro_c',
          'pro_plus_a',
          'pro_plus_b',
          'pro_plus_c',
          'pro_yearly_a',
          'pro_yearly_b',
          'pro_yearly_c',
          'pro_plus_yearly_a',
          'pro_plus_yearly_b',
          'pro_plus_yearly_c',
          'agency',
        ],
        default: 'pro_a',
      },
      billingFrequency: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly',
      },
      price: { type: Number, required: false }, // For Stripe/Paddle prices
      stripeCustomerId: { type: String },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
      },
      paymentGateway: {
        type: String,
        enum: ['razorpay', 'stripe'], // Extendable to other gateways
      },
      startDate: { type: Date },
      endDate: { type: Date },
      trialStartDate: { type: Date },
      trialEndDate: { type: Date },
      invoice: { type: String },
      website_count: { type: Number },
    },
    metadata: {
      lastLogin: { type: Date }, // Updated from Clerk events
      lastUpdatedBy: { type: String }, // System/User/Admin
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        delete ret.role;
      },
    },
  },
);

// Pre-save hooks
userSchema.pre('save', function (next) {
  this.metadata.updatedAt = new Date();
  next();
});

// Instance methods (if needed for more advanced logic)
userSchema.methods.getFullName = function () {
  return `${this.name.firstName} ${this.name.lastName}`;
};

// Export Model
const User = mongoose.model('User', userSchema);
module.exports = User;