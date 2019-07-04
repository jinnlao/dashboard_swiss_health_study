import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import STRINGS from '../global/localizedStrings.json';


const propTypes = {
    classes: PropTypes.object.isRequired, // the CSS defined below with the outside theme applied
    formJustFinishedIds: PropTypes.arrayOf(PropTypes.number).isRequired, // A list of the form ids that have just been updated
    resetFormFinishedIds: PropTypes.func.isRequired, // remove all forms ids from the list, is called after the snackbar has been displayed
    language: PropTypes.string.isRequired, // the current language set by the user
}

/**
 * Display a Snackbar (animated discrete popup) when the user has just finished to fill in a form. 
 */
class CongratulationSnackbar extends React.Component {

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.props.resetFormFinishedIds();
    };

    constructCongratulationMessage() {
        let formIds = this.props.formJustFinishedIds;

        // Initialize text, based on language
        let strings = STRINGS.fr;
        if (this.props.language === 'de') {
            strings = STRINGS.de;
        }

        // If only 1 form has been finished, display the form title
        if (formIds.length === 1) {
            let titleForm = strings.dashboard.forms[formIds[0]].title;
            return strings.congratulationsnackbar.congrat1ElemStart + titleForm + strings.congratulationsnackbar.congrat1ElemEnd;
        } else if (formIds.length > 1) {
            // If more than 1 form have been finished, display the number of form finished
            return strings.congratulationsnackbar.congratMultElemStart + formIds.length + strings.congratulationsnackbar.congratMultElemEnd;
        } else {
            return "";
        }
    }

    /**
     * Renders the component.
     */
    render() {
        const classes = this.props.classes;
        let congratulationMsg = this.constructCongratulationMessage();

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.props.formJustFinishedIds.length > 0}
                autoHideDuration={8000}
                key={this.props.formJustFinishedIds}
                onClose={this.handleClose}
                ContentProps={{
                    'aria-describedby': 'client-snackbar',
                    'className': classes.snackbar,
                }}
                // aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                        <CheckCircleIcon className={classNames(classes.icon, classes.iconVariant)} />
                        {congratulationMsg}
                    </span>
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={this.handleClose}
                    >
                        <CloseIcon className={classes.icon} />
                    </IconButton>,
                ]}
            />
        );
    }
}

const styles = theme => ({
    snackbar: {
        backgroundColor: green[600],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});


CongratulationSnackbar.propTypes = propTypes;
export default withStyles(styles)(CongratulationSnackbar);