import supabase from "../../../../supabase/index.js"
export const newPassword = async (req, res)=>{
  console.log("Enter new password")
    const {newPassword} = req.body;
    const { error: updateError } = await supabase.auth.admin.updateUserById(
    data.user_id,
    {
      password: newPassword,
      email_confirm: true, 
    }
  );

  if (updateError) {
    return res.status(500).json({ error: "Failed to update password." });
  }

  await supabase
    .from("clients")
    .update({ code: null, verified: true })
    .eq("user_id", data.user_id);

  return res.status(200).json({ message: "Password updated and user verified." });
};
