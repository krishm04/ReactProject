import React, { useEffect, useState, useContext } from 'react'
import './PlaceForm.css';
import { useParams,useNavigate } from 'react-router-dom'
import Input from '../../shared/components/FormElemnet/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/Validators';
import Button from '../../shared/components/FormElemnet/Button';
import Card from '../../shared/components/UIElements/Card';
import { useForm } from '../../shared/Hooks/form-hook';
import ErrorModel from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/Hooks/http-hooks'
import {AuthContext} from '../../shared/Context/Auth-context'


function UpadtePlaces() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;


    const { isLoading, clearError, error, sendRequest } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const placeId = useParams().placeId;
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, true)

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`${baseUrl}/places/${placeId}`);
                
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
            } catch (err) {
                // handle error
            }
        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);


    const placeUpadtaeHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
            `${baseUrl}/places/${placeId}`,
            'PATCH',
            JSON.stringify({
                title : formState.inputs.title.value,
                description : formState.inputs.description.value,
            }),
            {
                'Content-Type' : 'application/json',
                Authorization: "Bearer " + auth.token   
            }
        );
        navigate('/' + auth.userId + '/places');
        } catch(err){

        }
        
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }



    if (!isLoading && !loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }


    return (
        <>
            <ErrorModel error={error} OnClear={clearError} />
            {!isLoading && loadedPlace && (<form className="place-form" onSubmit={placeUpadtaeHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title"
                    onInput={inputHandler}
                    initialValue={loadedPlace.title}
                    initialValid={true}
                />
                <Input
                    id="description"
                    element="textarea"
                    type="text"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description(please enetrn minimu 5 character)"
                    onInput={inputHandler}
                    initialValue={loadedPlace.description}
                    initialValid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form>)
            }
        </>
    )
}

export default UpadtePlaces
