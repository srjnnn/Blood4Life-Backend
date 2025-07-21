export function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // Validate token logic here (e.g., JWT verify)
  // If valid, attach user info to req.user
  next();
}

export function authorize(roles = []) {
  return (req, res, next) => {
    // Check req.user.role against allowed roles
    next();
  };
}