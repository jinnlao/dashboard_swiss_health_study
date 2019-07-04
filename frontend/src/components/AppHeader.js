import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import STRINGS from '../global/localizedStrings.json';
import logo_de from '../images/logo/logo_de.svg';
import logo_fr from '../images/logo/logo_fr.svg';
import HelpMenu from './HelpMenu';

const propTypes = {
  classes: PropTypes.object.isRequired, // the CSS defined below with the outside theme applied
  loggedIn: PropTypes.bool.isRequired, // true if the user is logged-in, false otherwise
  language: PropTypes.string.isRequired, // the current language set by the user
  changeLanguage: PropTypes.func.isRequired, // function to change the language to the selected one
  logoutAction: PropTypes.func.isRequired // function to logout from the webapp
};

/**
 * Represents the header bar above the main screen.
 * 
 * Contains the logo of the study, the title, a language switch (fr, de), a help menu and a logout button when connected.
 */
class AppHeader extends React.Component {

  render() {
    const { classes, loggedIn, language, changeLanguage, logoutAction } = this.props;

    // Initialize text and logo, based on language
    let strings = STRINGS.fr.appbar;
    let logo_img = logo_fr;
    if (language === 'de') {
      strings = STRINGS.de.appbar;
      logo_img = logo_de;
    }

    return (
      <React.Fragment>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <div>
              <img src={logo_img} alt="logo" height="60px" className={classes.logo} />
            </div>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              {strings.title}
            </Typography>

            <div className={classes.languageSelection} >
              <Tooltip title="Français" placement="bottom" enterDelay={300} >
                <span>
                  <Button className={classes.languageButton} color="inherit" disabled={language === "fr"} onClick={() => changeLanguage('fr')}>
                    fr
                  </Button>
                </span>
              </Tooltip>
              <span color="default">|</span>
              <Tooltip title="Deutsch" placement="bottom" enterDelay={300} >
                <span>
                  <Button className={classes.languageButton} color="inherit" disabled={language === "de"} onClick={() => changeLanguage('de')}>
                    de
                  </Button>
                </span>
              </Tooltip>
            </div>

            {loggedIn ? <HelpMenu language={language} /> : null}
            {loggedIn ? <Button color="secondary" variant="contained" onClick={() => logoutAction()}>{strings.logout}</Button> : null}
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}


const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  logo: {
    backgroundColor: 'white',
    marginTop: 5,
    marginRight: 16,
    marginBottom: 5,
    padding: 5,
    borderRadius: 3,
    border: '1px solid rgba(0, 0, 0, 0.7)'
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  languageSelection: {
    marginRight: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  languageButton: {
    padding: 0,
    margin: '0 1px',
    minHeight: 25,
    minWidth: 38
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing.unit,
  },
});


AppHeader.propTypes = propTypes;
export default withStyles(styles)(AppHeader);
