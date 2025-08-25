import models from '../models/index.js'
// If you're still using bookingController.js, update it to use bookingDetails
export const createBooking = async (req, res) => {
  try {
    const { name, email, cell, packageId, number_of_people, bookingDetails } = req.body;

    // Find package by PK
    const packageData = await models.Package.findByPk(packageId);
    if (!packageData) return res.status(404).json({ error: 'Package not found' });

    const price = packageData.price;
    const totalPrice = price * number_of_people;

    // Create customer
    const customer = await models.Customer.create({ name, email, cell });

    // Parse bookingDetails if it's a string
    let parsedBookingDetails = bookingDetails;
    if (typeof bookingDetails === 'string') {
      try {
        parsedBookingDetails = JSON.parse(bookingDetails);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid booking details format' });
      }
    }

    // Generate booking reference
    const bookingRef = generateBookingReference();

    // Create booking with bookingDetails
    const booking = await models.Booking.create({
      bookingRef,
      customerId: customer.customerId,
      packageId: packageData.packageId,
      numberOfPeople: number_of_people,
      totalPrice,
      status: 'pending',
      bookingDetails: parsedBookingDetails
    });

    res.json({ 
      booking_id: booking.bookingId, 
      booking_ref: bookingRef,
      totalPrice 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

