import supabase from "../../../supabase/index.js";

export const verifyEmail = async (req, res) => {
  const { otp, email } = req.body;

  if (!otp) {
    return res.status(400).json({ error: "OTP cannot be empty" });
  }

  const { data, error } = await supabase
    .from("clients")
    .select("code")
    .eq("email", email);

  if (error) {
    return res.status(500).json({ error: "Internal error occurred" });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  const storedCode = data[0].code;

  if (storedCode !== otp) {
    return res.status(401).json({ error: "Wrong OTP" });
  }

  const { data: updatedData, error: updateError } = await supabase
    .from("clients")
    .update({ verified: true })
    .eq("email", email)
    .select();

  if (updateError) {
    return res.status(500).json({ error: "Failed to update verification" });
  }

  return res.status(200).json({ message: "Verified successfully", data: updatedData });
};
