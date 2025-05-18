import React, { useContext, useState, } from 'react'

import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElemnet/Input'
import Button from '../../shared/components/FormElemnet/Button'
import LodingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import Errormodel from '../../shared/components/UIElements/ErrorModal'
import { useHttpClient } from '../../shared/Hooks/http-hooks'
import { validate, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/Validators'
import { useForm } from '../../shared/Hooks/form-hook'
import { AuthContext } from '../../shared/Context/Auth-context'
import ImageUpload from '../../shared/components/FormElemnet/ImageUpload'
import './Auth.css';


function Auth() {

  const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    const [formstate, inputhandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const authnticatHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(baseUrl +'/users/login', 'POST',
                    JSON.stringify({
                        email: formstate.inputs.email.value,
                        password: formstate.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    },
                );
                auth.login(responseData.userId,responseData.token);
            } catch (err) { }

        } else {
            const formData = new FormData();
formData.append('name', formstate.inputs.name.value);
formData.append('email', formstate.inputs.email.value);
formData.append('password', formstate.inputs.password.value);
formData.append('image', formstate.inputs.image.value);

try {
  const responseData = await sendRequest(
     baseUrl+'/users/signup',
    'POST',
    formData
  );
  auth.login(responseData.userId,responseData.token);
} catch (err) {
  // no need to manually set error; sendRequest sets it
}
        }
    };


    const switchHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formstate.inputs,
                name: undefined,
                image: undefined
            },
                formstate.inputs.email.isValid && formstate.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formstate.inputs,
                    name: {
                        value: '',
                        isValid: false
                    },
                    image: {
                        value: null,
                        isValid: false
                    }
                },
                false
            );
        }
        setIsLoginMode((prevMode) => !prevMode)
    }

    return (
        <>
            <Errormodel error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LodingSpinner asOverplay />}
                <h2>{!isLoginMode ? 'Sign Up Required' : 'Login Required'}</h2>
                <hr />
                <form onSubmit={authnticatHandler}>
                    {!isLoginMode &&
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please Enter valid name"
                            onInput={inputhandler}
                        />
                    }
                    {!isLoginMode && <ImageUpload center id="image" onInput={inputhandler} errorText="Please provide an image." />}
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Enter valid email address."
                        onInput={inputhandler}
                    />
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Enter valid Password.at least 6 char"
                        onInput={inputhandler}
                    />
                    <Button type="submit" disabled={!formstate.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGN UP'}
                    </Button>
                </form>
                <Button inverse onClick={switchHandler}>SWITCH {isLoginMode ? 'SIGN UP' : 'LOGIN'}</Button>
            </Card>
        </>
    )
}

export default Auth
