import React, { useState, useContext } from 'react';


import './PlaceItem.css';
import Button from '../../shared/components/FormElemnet/Button';
import Card from '../../shared/components/UIElements/Card'
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/Context/Auth-context';
import ErrorModel from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/Hooks/http-hooks'

function PlaceItem(props) {
  const backendUrl = import.meta.env.VITE_ASSET_URL;

  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const { sendRequest, clearError, error, isLoading } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirModal] = useState(false)

  const openhandler = () => setShowMap(true);

  const closehandler = () => setShowMap(false);

  const showDeledteHandler = () => {
    setShowConfirModal(true);
  }

  const cancelDeleteHandler = () => {
    setShowConfirModal(false);
  }

  const confirmDeletehandler = async () => {
    setShowConfirModal(false)
    try {
      await sendRequest(baseUrl + `/places/${props.id}`, 
        'DELETE',
        null,
        {
                Authorization: "Bearer " + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) { }
  }


  return (
    <>
      <ErrorModel error={error} onClear={clearError} />
      <Modal show={showMap} onCancel={closehandler} header={props.address}
        contentClass="place-item__modal-content" footerClass="place-item__modal-actions"
        footer={<Button onClick={closehandler}>Close</Button>} >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place_item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeletehandler}>DELETE</Button>
          </>
        }>
        <p>Do you want to proceed and delete this place? Please note that it can't undone thereafter.</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${backendUrl}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openhandler}>VIEW ON MAP</Button>
            {auth.userId === props.creatorId &&
              <Button to={`/places/${props.id}`}>EDIT</Button>
            }
            {auth.userId === props.creatorId &&
              <Button danger onClick={showDeledteHandler}>DELETE</Button>
            }
          </div>
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
