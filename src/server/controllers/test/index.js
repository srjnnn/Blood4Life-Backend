// import supabase client
import supabase from "../../../supabase/index.js";


export const getTestData = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("test")
      .select("*");

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
