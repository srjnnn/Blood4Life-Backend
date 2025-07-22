import supabase from '../../../supabase/index.js';

export const signup = async (req, res) => {
  const { email, password, name,location,phone } = req.body;
  // Sign up user with Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Store user role in user_roles table
  const userId = data.user.id;
  const { error: roleError } = await supabase
    .from('clients')
    .insert([{ uuid: userId, email : email,name : name, location : location , phone : phone }]);

  if (roleError) {
    return res.status(400).json({ error: 'User created, but role assignment failed.' });
  }

  return res.status(201).json({ message: 'User registered successfully', user: { id: userId, email, role } });
};
