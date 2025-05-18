import React from 'react';
import { useContext } from 'react';
import Input from '../../shared/components/FormElemnet/Input';
import Button from '../../shared/components/FormElemnet/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/Validators';
import ImageUpload from '../../shared/components/FormElemnet/ImageUpload'
import { useForm } from '../../shared/Hooks/form-hook';
import { useHttpClient } from '../../shared/Hooks/http-hooks'
import { AuthContext } from '../../shared/Context/Auth-context'
import './PlaceForm.css';
import ErrorModel from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import {useNavigate} from 'react-router-dom';




const NewPlace = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const auth = useContext(AuthContext);
  const { clearError, sendRequest, isLoading, error } = useHttpClient();
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image: {
      value : null,
      isValid : false
    } 
  }, false);

  const navigate = useNavigate();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
 console.log('Auth token:', auth.token, 'User ID:', auth.userId);
    try {
      const fomData = new FormData();
      fomData.append('title',formState.inputs.title.value);
      fomData.append('description',formState.inputs.description.value);
      fomData.append('address',formState.inputs.address.value);
      fomData.append('image',formState.inputs.image.value);
      await sendRequest(baseUrl + '/places', 
        'POST',
        fomData,  
        {
          Authorization : "Bearer " + auth.token
        }
      )
      navigate('/'); 
    } catch (err) {}
  }
  return (
    <>
      <ErrorModel error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverplay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image." /> 
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;