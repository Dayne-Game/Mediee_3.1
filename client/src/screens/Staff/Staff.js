import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { listStaff, deleteUser } from "../../actions/user_actions";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const Staff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword } = useParams();

  const staffList = useSelector((state) => state.staffList);
  const { loading, error, users } = staffList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listStaff(keyword));
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, keyword, successDelete, userInfo]);

  console.log(users);

  const deleteHandler = (id) => {
    if (window.confirm("This cannot be undone.")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Fragment>
          {userInfo ? (
            <Fragment>
              <Header user={userInfo} />
              <Sidebar />
              <div className="main-container">
                <div className="button-box">
                  {userInfo && userInfo.isAdmin && (
                    <Link to="/staff/add" className="btn btn-box">
                      <div className="icon-container">
                        <ion-icon
                          className="icon"
                          name="add-outline"
                          style={{ fontSize: "24px" }}
                        ></ion-icon>
                        <span className="icon-text btn-icon-text">
                          Add Staff
                        </span>
                      </div>
                    </Link>
                  )}
                </div>
                <div style={{ paddingLeft: "10px" }}>
                  {users.length === 0 ? (
                    <p>No Staff Members Found</p>
                  ) : (
                    <Fragment>
                      <p>Number of Staff Members: {users.length}</p>
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Title</th>
                            <th>Role</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td>
                                <img
                                  src={user.image}
                                  alt={user.image}
                                  className="table-profile-image"
                                />
                                <span className="line-one">
                                  <Link to={`/staffprofile/${user._id}`}>
                                    {user.name}
                                  </Link>
                                </span>
                                <span className="line-two">{user.email}</span>
                              </td>
                              <td>
                                <span className="line-one">{user.role}</span>
                                <span className="line-two">
                                  {user.resthome}
                                </span>
                              </td>
                              <td>
                                {user.isAdmin ? (
                                  <span className="role admin">Admin</span>
                                ) : (
                                  <span className="role user">User</span>
                                )}
                              </td>
                              <td>
                                <Link
                                  to={`/staff/edit/${user._id}`}
                                  style={{
                                    color: "skyblue",
                                    marginRight: "10px",
                                  }}
                                >
                                  Edit
                                </Link>
                                <Link
                                  to="#"
                                  onClick={() => deleteHandler(user._id)}
                                >
                                  DELETE
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Fragment>
                  )}
                </div>
              </div>
            </Fragment>
          ) : (
            <p>Not Logged In</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Staff;
