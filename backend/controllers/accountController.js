import supabase from "../config/supabaseClient.js"

// Get Account Balance
export const getBalance = async (req, res) => {

  const userId = req.user.id

  const { data, error } = await supabase
    .from("users")
    .select("balance")
    .eq("id", userId)
    .single()

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  res.json({
    balance: data.balance
  })
}
export const transferMoney = async (req, res) => {

  const senderId = req.user.id
  const { receiverEmail, amount } = req.body

  try {

    // 1️⃣ Find Sender
    const { data: sender, error: senderError } = await supabase
      .from("users")
      .select("*")
      .eq("id", senderId)
      .single()

    if (senderError || !sender) {
      return res.status(404).json({ message: "Sender not found" })
    }

    // 2️⃣ Find Receiver
    const { data: receiver, error: receiverError } = await supabase
      .from("users")
      .select("*")
      .eq("email", receiverEmail)
      .single()

    if (receiverError || !receiver) {
      return res.status(404).json({ message: "Receiver not found" })
    }

    // 3️⃣ Prevent sending money to yourself
    if (sender.id === receiver.id) {
      return res.status(400).json({ message: "Cannot transfer to yourself" })
    }

    // 4️⃣ Check balance
    if (Number(sender.balance) < Number(amount)) {
      return res.status(400).json({ message: "Insufficient balance" })
    }

    // 5️⃣ Calculate new balances
    const newSenderBalance = Number(sender.balance) - Number(amount)
    const newReceiverBalance = Number(receiver.balance) + Number(amount)

    // 6️⃣ Update sender balance (DEBIT)
    const { error: senderUpdateError } = await supabase
      .from("users")
      .update({ balance: newSenderBalance })
      .eq("id", sender.id)

    if (senderUpdateError) {
      return res.status(500).json({ message: senderUpdateError.message })
    }

    // 7️⃣ Update receiver balance (CREDIT)
    const { error: receiverUpdateError } = await supabase
      .from("users")
      .update({ balance: newReceiverBalance })
      .eq("id", receiver.id)

    if (receiverUpdateError) {
      return res.status(500).json({ message: receiverUpdateError.message })
    }

    // 8️⃣ Insert Debit Transaction
    await supabase.from("transactions").insert({
      sender_id: sender.id,
      receiver_id: receiver.id,
      amount: amount,
      transaction_type: "debit"
    })

    // 9️⃣ Insert Credit Transaction
    await supabase.from("transactions").insert({
      sender_id: sender.id,
      receiver_id: receiver.id,
      amount: amount,
      transaction_type: "credit"
    })

    res.json({
      message: "Transfer successful"
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const getStatement = async (req, res) => {

  const userId = req.user.id

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  res.json(data)
}
export const getUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email");

  if (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }

  res.json(data);
};
