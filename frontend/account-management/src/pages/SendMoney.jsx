// import { useEffect, useState } from "react";

// function SendMoney() {

//   const [users, setUsers] = useState([]);
//   const [receiverEmail, setReceiverEmail] = useState("");
//   const [amount, setAmount] = useState("");
  

//   useEffect(() => {

//     fetch("http://localhost:5000/api/users", {
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("token")
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setUsers(data);
//       });

//   }, []);

//   const handleTransfer = async () => {

//     const res = await fetch("http://localhost:5000/api/account/transfer", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + localStorage.getItem("token")
//       },
//       body: JSON.stringify({
//         receiverEmail,
//         amount
//       })
//     });

//     const data = await res.json();

//     alert(data.message);

//   };

//   return (
//     <div>

//       <h1>Send Money</h1>

//       <h3>Select User</h3>

//       {/* <select onChange={(e) => setReceiverEmail(e.target.value)}>

//         <option>Select Receiver</option>

//         {users.map((user) => (
//           <option key={user.id} value={user.email}>
//             {user.name} ({user.email})
//           </option>
//         ))}

//       </select> */}
//       <select
//   value={receiverEmail}
//   onChange={(e) => setReceiverEmail(e.target.value)}
// >
//   <option value="">Select Receiver</option>

//   {users.map((user) => (
//     <option key={user.id} value={user.email}>
//       {user.name} ({user.email})
//     </option>
//   ))}

// </select>

//       <br /><br />

//       <input
//         type="number"
//         placeholder="Enter amount"
//         onChange={(e) => setAmount(e.target.value)}
//       />

//       <br /><br />

//       <button onClick={handleTransfer}>
//         Send Money
//       </button>

//     </div>
//   );
// }

// export default SendMoney;















import { useEffect, useState } from "react";

function SendMoney() {

  const [users, setUsers] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {

    const fetchUsers = async () => {
      try {

        const res = await fetch("http://localhost:5000/api/account/users", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });

        const data = await res.json();

        setUsers(data);

      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    fetchUsers();

  }, []);

  const handleTransfer = async () => {

    if (!receiverEmail || !amount) {
      alert("Please select receiver and enter amount");
      return;
    }

    try {

      const res = await fetch("http://localhost:5000/api/account/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          receiverEmail,
          amount
        })
      });

      const data = await res.json();

      alert(data.message);

    } catch (error) {
      console.log("Transfer error:", error);
    }

  };

  return (

    <div className="container">
    {/* <div style={{ padding: "30px" }}> */}

      <h1>Send Money</h1>

      <br />

      <h3>Select Receiver</h3>

      <select
        value={receiverEmail}
        onChange={(e) => setReceiverEmail(e.target.value)}
      >
        <option value="">Select Receiver</option>

        {users.map((user) => (
          <option key={user.id} value={user.email}>
            {user.name} ({user.email})
          </option>
        ))}

      </select>

      <br /><br />

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={handleTransfer}>
        Send Money
      </button>

    </div>

  );

}

export default SendMoney;