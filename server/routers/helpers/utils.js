import jwt from 'jsonwebtoken';


const generateToken = (id, userRole) => {
  const token = jwt.sign({
    _id: id, role: userRole,
  }, 'jwtPrivateKey');
  return token;
};

export default generateToken;
