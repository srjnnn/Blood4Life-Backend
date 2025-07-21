import supabase from '../../../supabase/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Searching for user : ", email)
  let user = null;
  let role = null;
  let table = null;

  // Check admin table
  let { data: adminData } = await supabase
    .from('admin')
    .select('*')
    .eq('email', email)
    .single();
  if (adminData) {
    user = adminData;
    role = 'admin';
    table = 'admin';
  }

  // Check hospital table
  if (!user) {
    let { data: hospitalData } = await supabase
      .from('hospitals')
      .select('*')
      .eq('email', email)
      .single();
    if (hospitalData) {
      user = hospitalData;
      role = 'hospital';
      table = 'hospital';
    }
  }

  // Check clients table
  if (!user) {
    let { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();
    if (clientData) {
      user = clientData;
      role = 'client';
      table = 'clients';
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  // Check password
const{data,error} = await supabase.auth.signInWithPassword({email,password});
if(error){
    return res.status(401).json({error : "Invalid crediantials"})
}
 console.log(process.env.JWT_SECRET)
  // Create JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return res.status(200).json({ token, role, user: { id: user.id, email: user.email } });
};
