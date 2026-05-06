import { getCustomerById } from "../services/customer.service";
import { getUserById } from "../services/profile.service";

const formatMoney = (num) => new Intl.NumberFormat().format(num);

export const formatApprovalData = async (approval) => {
  const data = approval.data;

  let customerName = "-";
  let userName = "-";
  let reviewerName = "-";

  if (data.customer_id) {
    const customer = await getCustomerById(data.customer_id);

    customerName = customer?.name || "-";
  }

  if (approval.created_by) {
    const user = await getUserById(approval.created_by);
    userName = user?.full_name || "-";
  }

  if (approval.reviewed_by) {
    const user = await getUserById(approval.reviewed_by);
    reviewerName = user?.full_name || "-";
  }

  if (approval.entity_type === "loan") {
    return {
      Customer: customerName,
      Amount: formatMoney(data.amount),
      Upfront: formatMoney(data.upfront_amount),
      "Total Loan": formatMoney(data.total_amount),
      Installment: formatMoney(data.installment_amount),
      "Duration (weeks)": data.duration,
      "Start Date": data.start_date,
      "Requested By": userName,
      "Reviewed By": reviewerName,
    };
  }

  if (approval.entity_type === "customer") {
    return {
      Name: data.full_name,
      Phone: data.phone,
      "NIDA / ID": data.nida,
      Address: data.address,
      "Requested By": userName,
      "Reviewed By": reviewerName,
    };
  }

  return data;
};
