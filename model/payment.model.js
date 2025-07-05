import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
