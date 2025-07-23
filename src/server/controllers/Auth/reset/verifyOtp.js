import supabase from "../../../../supabase/index.js";
import { newPassword } from "./newPassword.js";

export const verifyAndUpdatePassword = async (req, res) => {
  const { email, otp,} = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const { data, error } = await supabase
    .from("clients")
    .select("uuid, code") 
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "User not found." });
  }

  if (data.code !== otp) {
    return res.status(401).json({ error: "Invalid OTP." });
  }

newPassword()
return res.status(200).json({
  message: "OTP Verified",
  user_id: data.user_id, 
});
}