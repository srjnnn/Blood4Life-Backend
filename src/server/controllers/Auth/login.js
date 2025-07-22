import supabase from '../../../supabase/index.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;
  let user = null;
  let role = null;

  // 1. Check admin table
  const { data: adminData } = await supabase
    .from('admin')
    .select('*')
    .eq('email', email)
    .single();

  if (adminData) {
    user = adminData;
    role = 'admin';
  }

  // 2. Check hospital table
  if (!user) {
    const { data: hospitalData } = await supabase
      .from('hospitals')
      .select('*')
      .eq('email', email)
      .single();

    if (hospitalData) {
      user = hospitalData;
      role = 'hospital';
    }
  }

  // 3. Check clients table
  if (!user) {
    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (clientData) {
      // Check if email is verified
      if (!clientData.verified) {
        return res.status(403).json({ error: 'Email not verified. Please verify your account before logging in.' });
      }

      user = clientData;
      role = 'client';
    }
  }

  // 4. If no matching user
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // 5. Authenticate via Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 6. Generate JWT
  const token = jwt.sign(
    { id: user.id || user.uuid, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return res.status(200).json({
    token,
    role,
    user: {
      id: user.id || user.uuid,
      email: user.email,
      name: user.name || null,
    },
  });
};
