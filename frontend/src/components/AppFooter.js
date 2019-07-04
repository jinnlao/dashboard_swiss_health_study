import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import STRINGS from '../global/localizedStrings.json';


const propTypes = {
    classes: PropTypes.object.isRequired, // the CSS defined below with the outside theme applied
    language: PropTypes.string.isRequired, // the current language set by the user
};

/**
 * Defines the bottom (footer) of the webapp, which contains some links and a copyright text.
 * 
 * The links and text can be modified via the LocalizedStrings.language.appfooter.
 */
class AppFooter extends React.Component {

    render() {
        const { classes, language } = this.props;

        // Initialize text, based on language
        let strings = STRINGS.fr.appfooter;
        if (language === 'de') {
            strings = STRINGS.de.appfooter;
        }

        return (
            <React.Fragment>
                <footer className={classes.footer}>
                    <div className={classes.linkList}>
                        <Typography variant="body2">
                            <a className={classes.link} target="_blank" rel="noopener noreferrer" href={strings.homePageLink}>{strings.homePageText}</a>
                        </Typography>
                        <Typography variant="body2">
                            <a className={classes.link} href={strings.contactEmailLink}>{strings.contactUs}</a>
                        </Typography>
                    </div>
                    <Typography variant="body1" align="center" color="textSecondary" component="p">
                        {strings.copyrightText}
                    </Typography>
                </footer>
            </React.Fragment>
        );
    }
}


const styles = theme => ({
    footer: {
        marginTop: theme.spacing.unit * 6,
        marginBottom: theme.spacing.unit * 2,
    },
    linkList: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: theme.spacing.unit / 2,
    },
    link: {
        textDecoration: 'none',
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

AppFooter.propTypes = propTypes;
export default withStyles(styles)(AppFooter);
