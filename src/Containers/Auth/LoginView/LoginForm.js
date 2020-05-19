import React from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { Formik } from "formik";
import {
  Box,
  Button,
  TextField,
  makeStyles,
  Typography
} from "@material-ui/core";
import {
  login,
  loginWithGoogle,
  loginAnonymously,
  resetAccountState
} from "../../../Redux/account";
import { Alert } from "@material-ui/lab";
import LoginButton from "../../../Components/Misc/LoginButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useLocation, useHistory } from "react-router-dom";
import routes from "../../../Config/routes";

const useStyles = makeStyles((theme) => ({
  root: {},
  googleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(3)
  },
  link: {
    cursor: "pointer",
    "&:hover": {
      color: "#1e70bf",
      textDecoration: "underline"
    }
  }
}));

function LoginForm({ className, onSubmitSuccess, loginWithEmail, ...rest }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const [loginFailed, setLoginFailed] = React.useState(false);

  const denyAnonymous = React.useMemo(
    () => location.state && location.state.denyAnonymous,
    [location.state]
  );

  const handleOnSubmit = React.useCallback(
    async (values, { setSubmitting }) => {
      try {
        setLoginFailed(false);

        const user = await dispatch(login(values.email, values.password));
        if (user) {
          onSubmitSuccess(user);
        } else {
          setLoginFailed(true);
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        setLoginFailed(true);
        setSubmitting(false);
      }
    },
    [dispatch, onSubmitSuccess]
  );

  const handleGoogleClick = React.useCallback(async () => {
    try {
      setLoginFailed(false);
      const user = await dispatch(loginWithGoogle());
      if (user) {
        onSubmitSuccess(user);
      } else {
        setLoginFailed(true);
      }
    } catch (error) {
      setLoginFailed(true);
    }
  }, [dispatch, onSubmitSuccess]);

  const handleGuestClick = React.useCallback(async () => {
    try {
      setLoginFailed(false);
      const user = await dispatch(loginAnonymously());
      if (user) {
        onSubmitSuccess(user);
      } else {
        setLoginFailed(true);
      }
    } catch (error) {
      setLoginFailed(true);
    }
  }, [dispatch, onSubmitSuccess]);

  const handleMailClick = React.useCallback(async () => {
    try {
      setLoginFailed(false);
      dispatch(resetAccountState());
      history.push(routes.LOGIN_EMAIL(), { ...location.state });
    } catch (error) {
      setLoginFailed(true);
    }
  }, [history, location.state, dispatch]);
  return (
    <>
      {loginFailed && (
        <Box mt={2} mb={2}>
          <Alert severity="error">We couldn't recognize yourself</Alert>
        </Box>
      )}
      {!loginWithEmail && (
        <>
          <Box className={classes.googleContainer}>
            <LoginButton
              variant="google"
              label="Sign in with Google"
              type="light"
              onClick={handleGoogleClick}
            />
          </Box>
          <Box className={classes.googleContainer}>
            <LoginButton
              variant="mail"
              label="Sign in with Email"
              type="light"
              onClick={handleMailClick}
            />
          </Box>
          {!denyAnonymous && (
            <Box className={classes.googleContainer}>
              <LoginButton
                variant="guest"
                label="Sign in as Guest"
                type="light"
                onClick={handleGuestClick}
              />
            </Box>
          )}
        </>
      )}
      {loginWithEmail && (
        <>
          <Typography
            className={classes.link}
            variant="body2"
            color="textSecondary"
            onClick={() => {
              setLoginFailed(false);
              history.push(routes.LOGIN(), { ...location.state });
            }}
          >
            <ArrowBackIosIcon
              style={{
                fontSize: "0.7em"
              }}
            />
            Different login method
          </Typography>
          <Formik
            initialValues={{
              email: "",
              password: ""
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              password: Yup.string().max(255).required("Password is required")
            })}
            onSubmit={handleOnSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form
                noValidate
                className={clsx(classes.root, className)}
                onSubmit={handleSubmit}
                {...rest}
              >
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  // autoFocus
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box mt={3} mb={1}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Log In
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </>
      )}
    </>
  );
}

LoginForm.propTypes = {
  className: PropTypes.string,
  onSubmitSuccess: PropTypes.func
};

LoginForm.defaultProps = {
  onSubmitSuccess: () => {}
};

export default LoginForm;
