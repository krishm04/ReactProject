import React,{useEffect, useReducer} from 'react'
import './Input.css';
import { validate } from '../../util/Validators';

const inputReducer = (state,action) => {

  switch(action.type){
    case 'CHANGE' :
    return {
      ...state,
      value : action.val,
      isValid :validate(action.val,action.validators)
    };
    case 'TOUCH':
      return{
        ...state,
        isTouched : true
      }
    default : 
    return state;
  }
};
function Input(props) {

  const [inputState,dispatch] = useReducer(inputReducer,
    {
      value :  props.initialValue || '' , 
      isValid : props.initialValid || false,
      isTouched : false
    });

  const { id, onInput } = props;
const { value, isValid } = inputState;

useEffect(() => {
  onInput(id,value,isValid);
}, [value, isValid, onInput, id]);


  const changeHandler = (event) =>{
    dispatch(
      {
      type : 'CHANGE' , 
      val : event.target.value ,
      isTouched : false,
      validators : props.validators
    })
  }

  const tochHandler = () => {
    dispatch({
      type : 'TOUCH'
    })
  }
    const element = props.element === 'input' ? 
    (
        <input type={props.type} 
        placeholder={props.placeholder} 
        id={props.id} 
        onBlur={tochHandler}
        value={inputState.value}
        onChange={changeHandler} />
    ) : (
        <textarea id={props.id} 
        rows={props.row || 3} 
        onChange={changeHandler} 
        onBlur={tochHandler}
        value={inputState.value} />
    );
  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
        <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid  && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input
