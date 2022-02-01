import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { login } from "../../actions/user_actions";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  let navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="container">
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <form onSubmit={submitHandler} className="form-container">
        <div className="form-title-box">
          <h2 className="form-title">Login Account</h2>
        </div>
        <div className="input-container">
          <input
            type="email"
            className="form-input"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="input-container">
          <input
            type="password"
            className="form-input"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className="input-container">
          <button type="submit" className="form-button">
            Submit
          </button>
        </div>
        <p className="form-subtitle text-center mt-2">
          Don't have an account? Register <Link to="/register">HERE</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
