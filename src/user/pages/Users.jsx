import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/Hooks/http-hooks';

const Users = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;


  const {sendRequest,isLoding,error,clearError} = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(baseUrl +'/users');

        setLoadedUser(responseData.users);
      } catch (err) {
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return(
    <>
  <ErrorModal error={error} onClear={clearError} /> 
  {isLoding && (
    <div className="center">
      <LoadingSpinner/>
    </div>
  )}
  {!isLoding  && loadedUser  && <UsersList items={loadedUser} />}
  </> 
  );
};

export default Users;
