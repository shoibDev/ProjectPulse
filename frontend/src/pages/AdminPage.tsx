import api from '../utils/API';
import React, { useEffect, useState } from 'react';
import { User } from '../utils/types';
import Header from "../components/header/Header.tsx";
import UserTable from "../components/tables/UserTable.tsx";

const AdminPage = () => {

  return (
    <>
      <Header title={"Admin Page"}/>
        <UserTable/>

    </>
  );
};


export default AdminPage
