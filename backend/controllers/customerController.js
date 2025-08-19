// controllers/customerController.js
export const getCustomers = (req, res) => {
  res.send('Get all customers');
};

export const createCustomer = (req, res) => {
  res.send('Create customer');
};

export const getCustomerById = (req, res) => {
  res.send(`Get customer with ID ${req.params.id}`);
};

export const updateCustomer = (req, res) => {
  res.send(`Update customer with ID ${req.params.id}`);
};

export const deleteCustomer = (req, res) => {
  res.send(`Delete customer with ID ${req.params.id}`);
};

