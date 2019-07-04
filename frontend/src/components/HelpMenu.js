import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import PropTypes from 'prop-types';
import React from 'react';
import STRINGS from '../global/localizedStrings.json';


const propTypes = {
    classes: PropTypes.object.isRequired, // the CSS defined below with the outside theme applied
    language: PropTypes.string.isRequired, // the current language set by the user
}

/**
 * Help menu component.
 * The menu dynamically opens/closes (which is tracked by the state).
 * Inside, the list of options as well as the urls come from the LocalizedStrings.
 */
class HelpMenu extends React.Component {
    constructor() {
        super();
        this.state = { anchorMenu: null };
    }


    openMenu = event => {
        this.setState({ anchorMenu: event.currentTarget }); // opens menu
    };

    /**
     * Closes the help menu, and launch a url in a new tab if one is provided
     * 
     * @param {String or undefined} url A url to open in a new tab, or undefined to simply close the menu.
     */
    handleClose(url) {
        this.setState({ anchorMenu: null }); // closes menu
        if (typeof (url) !== "undefined") {
            window.open(url, '_blank');
        }
    }

    /**
     * Renders the component.
     */
    render() {
        const { anchorMenu } = this.state;
        const { classes, language } = this.props;

        // Initialize text, based on language
        let strings = STRINGS.fr.helpmenu;
        if (language === 'de') {
            strings = STRINGS.de.helpmenu;
        }

        return (
            <div className={classes.topContainer}>
                <Button
                    aria-owns={anchorMenu ? 'help-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.openMenu}
                    variant='text'
                >
                    <HelpIcon className={classes.icon} />
                    <Typography className={classes.buttonTitle}>{strings.title}</Typography>
                </Button>
                <Menu
                    id="help-menu"
                    anchorEl={anchorMenu}
                    open={Boolean(anchorMenu)}
                    onClose={() => this.handleClose()}
                >
                    <MenuItem onClick={(e) => this.handleClose(strings.studyInformationLink)}>
                        {strings.studyInformation}
                    </MenuItem>
                    <MenuItem onClick={() => this.handleClose(strings.faqLink)}>
                        {strings.faq}
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            this.handleClose();
                            window.location.href = strings.contactEmailLink; // starts email app
                        }}>
                        {strings.contactUs}
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

const styles = theme => ({
    topContainer: {
        marginRight: theme.spacing.unit * 2,
    },
    buttonTitle: {
        color: 'white'
    },
    icon: {
        color: 'white',
        marginRight: 10
    },
});

HelpMenu.propTypes = propTypes;
export default withStyles(styles)(HelpMenu);