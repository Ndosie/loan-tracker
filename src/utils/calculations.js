export const calculateTotalLoan = (amount, upfront_amount) => {
  return amount - upfront_amount;
};

export const calculateBalance = (total, payments) => {
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  return total - totalPaid;
};


export const calculateCollections = (payments) => {
  if (!payments) return;

  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();

  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  ).toISOString();

  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
  ).toISOString();

  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);

  const startOfWeek = new Date(now.setDate(diff)).toISOString();

  let thisMonth = 0;
  let lastMonth = 0;
  let thisWeek = 0;

  payments.forEach((p) => {
    const date = new Date(p.payment_date);
    const amount = Number(p.amount);

    if (date >= new Date(startOfMonth)) {
      thisMonth += amount;
    }

    if (
      date >= new Date(startOfLastMonth) &&
      date <= new Date(endOfLastMonth)
    ) {
      lastMonth += amount;
    }

    if (date >= new Date(startOfWeek)) {
      thisWeek += amount;
    }
  });

  return { lastMonth, thisMonth, thisWeek };
};
