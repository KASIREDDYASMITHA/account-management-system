import { useEffect, useState } from "react";
import axios from "axios";

function Statement() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/account/statement",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTransactions(res.data);
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      {/* <h1>Transaction History</h1> */}

      <h1 style={{ textAlign: "center" }}>Transaction History</h1>

      <table>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.sender_id}</td>
              <td>{t.receiver_id}</td>
              <td>{t.amount}</td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Statement;
