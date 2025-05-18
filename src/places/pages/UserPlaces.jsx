import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom';
import empire1 from '../../assets/empier1.jpg'
import effile1 from '../../assets/effile1.jpg'
import taj1 from '../../assets/taj1.jpg'
import PlaceList from '../Component/PlaceList'
import { useHttpClient } from '../../shared/Hooks/http-hooks';
import ErrorModel from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'


function UserPlaces() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, clearError, error, sendRequest } = useHttpClient();
  const userId = useParams().userId;
  useEffect(() => {
    const ftechPlaces = async () => {
      try {
        const responseData = await sendRequest(`${baseUrl}/places/user/${userId}`);
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    ftechPlaces();
  }, [sendRequest, userId]);

  const plceDeleteHandler = (deletedPalceId) => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter((place =>  place.id !== deletedPalceId)))
  }

  return (
    <>
      <ErrorModel error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={plceDeleteHandler} />}
    </>
  )
}

export default UserPlaces
