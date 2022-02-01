import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/user_actions";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <Fragment>
      {userInfo ? (
        <div className="sidebar">
          <NavLink activeClassName="active" to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink activeClassName="active" to="/residents">
            Residents
          </NavLink>
          {userInfo && userInfo.isAdmin && (
            <NavLink activeClassName="active" to="/staff">
              Staff
            </NavLink>
          )}
          <NavLink activeClassName="active" to="/history">
            History
          </NavLink>
          <NavLink onClick={logoutHandler} className="logout" to="/logout">
            <div className="icon-container">
              <ion-icon name="log-out-outline" className="icon"></ion-icon>
              <span className="icon-text">Logout</span>
            </div>
          </NavLink>
        </div>
      ) : (
        <div></div>
      )}
    </Fragment>
  );
};

export default Sidebar;
