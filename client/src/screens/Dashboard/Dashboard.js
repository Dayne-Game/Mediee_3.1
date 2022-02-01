import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <Fragment>
      {userInfo ? (
        <Fragment>
          <Header user={userInfo} />
          <Sidebar />
          <div className="main-container">
            <div className="button-box">
              <p>Good as</p>
            </div>
          </div>
        </Fragment>
      ) : (
        <p>Not Logged In</p>
      )}
    </Fragment>
  );
};

export default Dashboard;
