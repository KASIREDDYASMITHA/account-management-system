import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/api/account/balance", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Current Balance: ₹{balance}</h2>
      <button onClick={() => navigate("/statement")}>View Transactions</button>

      <br />

      <button onClick={() => (window.location.href = "/send-money")}>
        Send Money
      </button>

      <button>Account Statement</button>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
