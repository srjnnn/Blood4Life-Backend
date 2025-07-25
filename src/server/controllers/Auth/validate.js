import jwt from 'jsonwebtoken';

export const validate = async (req, res) => {
    const {token} = req.body
  if (!token) {
    return res.status(200).json({ authenticated: false });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ authenticated: true });
  } catch {
    return res.status(200).json({ authenticated: false });
  }
};
