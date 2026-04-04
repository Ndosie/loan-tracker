export const calculateTotalLoan = (amount, upfront_amount) => {
  return amount - upfront_amount;
};

export const calculateBalance = (total, payments) => {
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  return total - totalPaid;
};
