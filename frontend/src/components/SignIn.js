import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/LockOutlined';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import STRINGS from '../global/localizedStrings.json';


const propTypes = {
  // Style
  classes: PropTypes.object.isRequired, // the CSS defined below with the outside theme applied

  // Form fields
  participantCode: PropTypes.string.isRequired, // Field value for the participant code
  birthDate: PropTypes.string.isRequired, // Field value for the birthdate (format: "YYYY-MM-DD")
  rememberMe: PropTypes.bool.isRequired, // Checkbox value: true if the checkbox is checked, false otherwise

  // Error
  loginErrorCode: PropTypes.number.isRequired, // The error code if there was a problem when trying to login

  // Language
  language: PropTypes.string.isRequired, // the current language set by the user

  // Form handling
  handleSubmit: PropTypes.func.isRequired, // function to call when trying to login
  handleChangeParticipantCodeValue: PropTypes.func.isRequired, // handles changes in the participant id field
  handleChangeBirthDateValue: PropTypes.func.isRequired, // handles changes in the birthdate field
  handleChangeRememberMe: PropTypes.func.isRequired, // handles changes in the remember me checkbox
};


/**
 * Login page (one of the main page of the webapp), which will be shown if the user
 * is not logged in.
 * 
 * Contains the fields participantCode and birthDate: the state and methods to modify
 * them are given by the component above (as props).
 * 
 * MaterialUI library is used to create the form, with a "date" TextField for the birthdate.
 * 
 * In case of login error, an error field is displayed and the text is taken from the 
 * LocalizedStrings file.
 * 
 */
class SignIn extends Component {

  render() {
    const {
      classes, participantCode, birthDate, rememberMe, loginErrorCode,
      language, handleSubmit, handleChangeParticipantCodeValue,
      handleChangeBirthDateValue, handleChangeRememberMe
    } = this.props;

    // Initialize text, based on language
    let strings = STRINGS.fr.login;
    if (language === 'de') {
      strings = STRINGS.de.login;
    }

    // Transform the error code into a text (from the string list)
    let errorText = "";
    if (loginErrorCode >= 0) {
      errorText = strings.errors_description[loginErrorCode];
    }

    return (
      <React.Fragment>
        <main className={classes.main}>
          <Paper className={classes.paper}>

            {/* ------- INTRO ------- */}
            <Avatar className={classes.lockIcon}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {strings.title}
            </Typography>
            <Typography className={classes.description} variant="body2">
              {strings.description}
            </Typography>


            {/* ------- LOGIN FORM ------- */}
            <form className={classes.form} onSubmit={handleSubmit}>
              {/* --- participant id --- */}
              <FormControl margin="normal" required fullWidth>
                <InputLabel>{strings.field_participant}</InputLabel>
                <Input id="participantCode" name="participantCode" autoComplete="participantCode" autoFocus value={participantCode} onChange={handleChangeParticipantCodeValue} />
              </FormControl>
              {/* --- birthdate --- */}
              <FormControl margin="normal" required fullWidth>
                <TextField
                  id="date"
                  label={strings.field_birthdate}
                  required
                  type="date"
                  value={birthDate}
                  onChange={handleChangeBirthDateValue}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              {/* --- Remember me checkbox --- */}
              <FormControlLabel
                control={<Checkbox value="remember" checked={rememberMe} onChange={handleChangeRememberMe} color="primary" />}
                label={strings.remember_checkbox}
              />
              {/* --- login button --- */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {strings.login_button}
              </Button>
              {/* --- Error message: is displayed only if errorText is not empty  --- */}
              {errorText &&
                <FormHelperText error>
                  {errorText}
                </FormHelperText>
              }
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  lockIcon: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  description: {
    marginTop: theme.spacing.unit * 3,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});


SignIn.propTypes = propTypes;
export default withStyles(styles)(SignIn);
