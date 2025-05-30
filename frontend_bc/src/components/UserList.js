import React, {useState, useEffect} from "react";
//import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "../utils";
const UserList = () => {
const [users, setUser] = useState([]);
const [msg, setMsg] = useState("");

useEffect(()=>{
    getUsers();
},[]);

const getUsers = async () =>{
    const token = localStorage.getItem("accessToken");
      if (!token) {
        setMsg("Silakan login terlebih dahulu.");
        return;
      }
    const response = await API.get(`/users`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    setUser(response.data);
};

const deleteUser = async (id) =>{
    try {
        await API.delete(`/users/${id}`);
        getUsers();
    } catch (error) {
        console.log(error);
    }
}

  return (
    <div className="columns mt-5 is-centered">
    <div className="column is-half">
      <h1 className="title has-text-centered has-text-primary"> User List</h1>
      <div className="is-flex is-justify-content-space-between mb-4">
        <Link to={`add`} className="button is-success is-rounded">Add User</Link>
      </div>
      <table className="table is-striped is-fullwidth is-hoverable">
        <thead>
          <tr className="has-background-primary-light">
            <th className="has-text-centered">No</th>
            <th>Username</th>
            <th>Password</th>
            <th className="has-text-centered">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="has-text-centered">{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.password}</td>
                <button 
                  onClick={() => deleteUser(user.id)} 
                  className="button is-small is-danger is-light is-rounded"
                >
                   Delete
                </button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default UserList;
