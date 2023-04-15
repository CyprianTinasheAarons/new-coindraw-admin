import { useEffect, useState } from "react";

import AddUser from "../components/modal/addUser";
import Head from "next/head";
import Layout from "../components/Layout";
import UserService from "../api/user.service";
import UsersTable from "../components/tables/users";

function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    UserService.getAll().then((res) => {
      setUsers(res.data);
    });
  }, []);

  const fetchUsers = () => {
    UserService.getAll().then((res) => {
      setUsers(res.data);
    });
  };

  return (
    <div>
      <Head>
        <title>Coindraw Admin | Users</title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={"Users"}>
        <AddUser getUsers={fetchUsers} />
        <UsersTable data={users} fetchUsers={fetchUsers} />
      </Layout>
    </div>
  );
}

export default Users;
