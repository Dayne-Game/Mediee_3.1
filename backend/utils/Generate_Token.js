import jwt from "jsonwebtoken";

const Generate_Token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default Generate_Token;
