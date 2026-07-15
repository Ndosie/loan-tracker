import { getCustomerById } from "../services/customer.service";
import { getLoanById } from "../services/loan.service";
import { getUserById } from "../services/profile.service";

const formatMoney = (num) => new Intl.NumberFormat().format(num);

export const formatApprovalData = async (
  approval,
  { usersMap = {}, customersMap = {} } = {},
) => {
  const data = approval.data;

  let customerName = "-";
  let userName = "-";
  let reviewerName = "-";

  if (data?.customer_id) {
    const customer =
      customersMap[data.customer_id] ||
      (await getCustomerById(data.customer_id));
    customerName = customer?.name || "-";
  }

  if (approval?.created_by) {
    const user =
      usersMap[approval.created_by] || (await getUserById(approval.created_by));
    userName = user?.full_name || "-";
  }

  if (approval?.reviewed_by) {
    const user =
      usersMap[approval.reviewed_by] ||
      (await getUserById(approval.reviewed_by));
    reviewerName = user?.full_name || "-";
  }

  if (approval.entity_type === "loan") {
    let loan = {};
    if (approval.action_type === "update") {
      loan = await getLoanById(approval.entity_id);
      const customer = await getCustomerById(loan.customer_id);
      customerName = customer.name;
    }
    return {
      Customer: customerName,
      Amount: formatMoney(data.amount || loan.amount),
      Upfront: formatMoney(data.upfront_amount || loan.upfront_amount),
      "Total Loan": formatMoney(
        data.amount - data.upfront_amount || loan.amount - loan.upfront_amount,
      ),
      Installment: formatMoney(
        data.installment_amount || loan.installment_amount,
      ),
      "Duration (weeks)": data.duration || loan.duration,
      "Start Date": data.start_date || loan.start_date,
      "Loan Status": data.status || loan.status,
      "Requested By": userName,
      "Reviewed By": reviewerName,
    };
  }

  if (approval.entity_type === "customer") {
    return {
      Name: data.name,
      Phone: data.phone,
      "NIDA / ID": data.nida,
      Address: data.address,
      Documents: data.documents,
      "Requested By": userName,
      "Reviewed By": reviewerName,
    };
  }

  return data;
};
