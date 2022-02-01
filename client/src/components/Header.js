import React, { Fragment } from "react";

const Header = ({ user }) => {
  return (
    <Fragment>
      <div className="navbar">
        <div className="navbar-title-box">
          <h2>Mediee</h2>
        </div>
        <div className="user-info">
          <p className="username">{user.name}</p>
          <img src={user.image} alt={user.image} className="profile-image" />
        </div>
      </div>
      <div className="titlebox">
        <h2>{user.resthome}</h2>
      </div>
    </Fragment>
  );
};

export default Header;
