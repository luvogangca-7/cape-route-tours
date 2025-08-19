import models from '../models/index.js';

export const createBooking = async (req, res) => {
  try {
    const { name, email, cell, packageId, number_of_people, townId } = req.body;

    // Find package by PK
    const packageData = await models.Package.findByPk(packageId);
    if (!packageData) return res.status(404).json({ error: 'Package not found' });

    const price = packageData.price;
    const totalPrice = price * number_of_people;

    // Create customer
    const customer = await models.Customer.create({ name, email, cell });

    // Create booking with associations
    const booking = await models.Booking.create({
      customerId: customer.customerId,
      townId: townId || null,
      packageId: packageData.packageId,
      numberOfPeople: number_of_people,
      totalPrice,
      status: 'pending',
    });

    res.json({ booking_id: booking.bookingId, totalPrice });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

