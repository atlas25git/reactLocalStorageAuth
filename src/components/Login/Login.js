import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const pwdReducer = (state,action) => {
  if(action.type === 'USER_INPUT'){
    return {value: action.val, isValid: action.val.trim().length >6 };
  }
  if(action.type === 'INPUT_BLUR'){
    return { value: state.value, isValid: state.value.trim().length>6};
  }
  return {value:'',isVald: false};
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [pwdState,dispatchPwd] = useReducer(pwdReducer, {
    value: '',
    isValid: null,
  });
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);


//This is a more optimal way to validate email and password here as useEffect will run
//everytime they change, whereas putting them under changeHandlers ascertained us no such
//garuntee.

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(
        emailState.isValid && pwdState.isValid
      );
    }, 50);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailState.isValid, pwdState.isValid]);//now only the validty change would trigger the useEffect

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});

    // setFormIsValid(
    //   event.target.value.includes('@') && pwdState.value.trim().length > 6
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPwd({type: 'USER_INPUT', val: event.target.value});

    // setFormIsValid(
    //   emailState.isValid && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'});
  };

  const validatePasswordHandler = () => {
    dispatchPwd({type: 'INPUT_BLUR'});
    //setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  //this fn passes the entered credentials to app.js wherre the credentials are persisted inside 
  //the local storage.
  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, pwdState);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            pwdState.valid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={pwdState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;