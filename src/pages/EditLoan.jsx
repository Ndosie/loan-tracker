import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateLoan, getLoanById } from "../services/loan.service";

export default function EditLoan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  useEffect(() => {
    loadLoan();
  }, []);

  const loadLoan = async () => {
    const data = await getLoanById(id);
    setForm(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateLoan(id, form);
    navigate("/loans");
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-xl font-bold mb-4">Edit Loan</h2>

        <input
          className="input mb-3"
          type="number"
          value={form.amount || ""}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          className="input mb-3"
          type="number"
          value={form.upfront_amount || ""}
          onChange={(e) =>
            setForm({
              ...form,
              upfront_amount: e.target.value,
            })
          }
        />

        <input
          className="input mb-4"
          type="number"
          value={form.duration || ""}
          onChange={(e) =>
            setForm({
              ...form,
              duration: e.target.value,
            })
          }
        />

        <div className="flex gap-2">
          <button className="btn btn-primary">Update</button>

          <button
            type="button"
            onClick={() => navigate("/loans")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
