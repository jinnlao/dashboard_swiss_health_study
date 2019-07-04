import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NotesIcon from '@material-ui/icons/BallotTwoTone';
import DoneIcon from '@material-ui/icons/Done';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import React from 'react';
import STRINGS from '../global/localizedStrings.json';
import trophyImage from '../images/trophy.png';


const propTypes = {
  classes: PropTypes.object.isRequired, // the CSS defined below with the outside theme applied
  progression: PropTypes.arrayOf(PropTypes.number).isRequired, // the progression percentage in all forms
  links: PropTypes.arrayOf(PropTypes.string).isRequired, // the user personal link to all forms
  language: PropTypes.string.isRequired,  // the current language set by the user
};

/**
 * Main page of the webapp. Shows the different forms that need to be completed, as well as thoses
 * that are already completed.
 * 
 * Merge and display text about the form (located in the LocalizedStrings) with personal information
 * of the user directly retrieved from the server (progression and personal url to the forms).
 */
class Dashboard extends React.Component {

  render() {
    const { classes, progression, links, language } = this.props;

    // Initialize text, based on language
    let strings = STRINGS.fr.dashboard;
    if (language === 'de') {
      strings = STRINGS.de.dashboard;
    }

    if (strings.forms.length !== progression.length || strings.forms.length !== links.length) {
      console.warn("The number of forms should match the length of the progress array of the user.")
    }

    // Generates 2 lists: the ongoing forms and the finished forms
    let ongoingForms = []; // list of object coming from strings.forms, where progression < 1
    let finishedForms = []; // list of object coming from strings.forms, where progression = 1

    for (let i = 0; i < strings.forms.length; i++) {
      const formTexts = strings.forms[i];
      formTexts["position"] = i; // saves the global position to retrieve correct progression/links later 

      if (progression[i] === 1.0) {
        finishedForms.push(formTexts);
      } else if (progression[i] >= 0) {
        ongoingForms.push(formTexts);
      }
    }


    // Stepper activate step is the first position in progression array that is < 1
    let stepperActiveStep = 0;
    for (let i = 0; i < progression.length; i++) {
      if (progression[i] < 1) {
        stepperActiveStep = i;
        break;
      }
    }


    return (
      <React.Fragment>
        <main>
          <div className={classes.layout}>

            {/* ------- INFO BOX ------- */}

            <div className={classes.infoBoxOutside}>
              <Card className={classes.infoBoxCard}>
                <div className={classes.infoBoxInside}>
                  <div><InfoIcon className={classes.infoBoxIcon} color='secondary' /></div>
                  <div>
                    <Typography variant="body2" color="textPrimary">
                      {strings.infoBox}
                    </Typography>
                  </div>
                </div>
              </Card>
            </div>

            {/* ------- STEPPER ------- */}

            <Stepper alternativeLabel nonLinear activeStep={stepperActiveStep}
              className={classes.stepper} >
              {progression.map((progress, index) => {
                let title = strings.forms[index].title
                return (
                  <Step key={title} completed={progress === 1} >
                    <StepLabel>{title}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            {/* -------  ONGOING FORMS ------- */}

            { // If there is at least 1 ongoing form, show this section:
              ongoingForms.length === 0 ? null :

                <React.Fragment>
                  <div className={classes.sectionTitle} >
                    <NotesIcon color='primary' />
                    <Typography variant="h5" color="primary" className={classes.sectionTitleText}>
                      {strings.title1}
                    </Typography>
                  </div>

                  <Grid container spacing={40}>
                    {ongoingForms.map(formInfo => ( // Map each elem of the list of ongoing forms to a card
                      <Grid item key={formInfo.position} sm={6} md={4} lg={4}>
                        <Card className={classes.card}>
                          <CardContent className={classes.cardContent}>
                            <Typography variant="caption" align="center" className={classes.progressText}>
                              {strings.progression_indicator} {Math.round(progression[formInfo.position] * 100)}%
                      </Typography>
                            <LinearProgress className={classes.cardProgress} variant="determinate" value={progression[formInfo.position] * 100} />
                            <Typography gutterBottom variant="h6" component="h3">
                              {formInfo.title}
                            </Typography>
                            <Typography>
                              {formInfo.description}
                            </Typography>
                          </CardContent>
                          <CardActions className={classes.cardActions}>
                            <Button size="medium"
                              color='secondary'
                              align="center"
                              variant={progression[formInfo.position] > 0 ? "outlined" : "contained"}
                              fullWidth
                              onClick={(e) => window.open(links[formInfo.position], '_blank')}
                            >
                              {progression[formInfo.position] > 0 ? strings.continue_form_button : strings.start_form_button}
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </React.Fragment>
            }

            { // If there are both at least 1 ongoing form and at least 1 finished form, show the section divider:
              finishedForms.length === 0 || ongoingForms.length === 0 ? null :
                <Divider className={classes.divider} />
            }

            {/* -------  PREVIOUS FORMS  ------- */}

            { // If there is at least 1 finished form, show this section:
              finishedForms.length === 0 ? null :

                <React.Fragment>
                  <div className={classes.sectionTitle} >
                    <DoneIcon className={classes.iconTitle2} />
                    <Typography variant="h5" color="primary" className={classes.sectionTitleText}>
                      {strings.title2}
                    </Typography>
                  </div>

                  <Grid container spacing={40}>
                    {finishedForms.map(formInfo => (  // Map each elem of the list of finished forms to a card
                      <Grid item key={formInfo.position} sm={6} md={4} lg={4}>
                        <Card className={classes.card}>
                          <CardMedia
                            className={classes.cardMedia}
                            image={trophyImage}
                            alt="reward image"
                          />
                          <CardContent className={classes.cardContent}>
                            <Typography variant="caption" align="center" className={classes.progressText}>
                              {strings.finished}
                            </Typography>
                            <LinearProgress className={classes.cardProgress} variant="determinate" value={100} classes={{ barColorPrimary: classes.progressFinished }} />
                            <Typography gutterBottom variant="h6" component="h3">
                              {formInfo.title}
                            </Typography>
                            <Typography>
                              {formInfo.rewardText}
                            </Typography>
                            <Divider className={classes.finishedFormDivider} />
                            <Typography variant="caption">
                              {formInfo.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                </React.Fragment>
            }
          </div>
        </main>
      </React.Fragment>
    );
  }
}


const styles = theme => ({
  infoBoxIcon: {
    marginRight: theme.spacing.unit * 2,
    // color: 'green',
  },
  infoBoxOutside: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit,
  },
  infoBoxCard: {
    maxWidth: 600,
  },
  infoBoxInside: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
    display: 'flex',
    flexDirection: 'row wrap',
    alignItems: 'center'
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    padding: `${theme.spacing.unit * 2}px 0`,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  sectionTitleText: {
    marginLeft: theme.spacing.unit,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardProgress: {
    margin: `${theme.spacing.unit * 0.5}px 0 ${theme.spacing.unit * 2}px 0`
  },
  progressFinished: {
    backgroundColor: '#004b75',
  },
  cardMedia: {
    paddingTop: '100%', // img format 1:1   (16:9 would be 56.25%)
  },
  cardContent: {
    flexGrow: 1,
    paddingTop: 0,
  },
  progressText: {
    marginTop: theme.spacing.unit,
  },
  divider: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 3}px 0`,
  },
  iconTitle2: {
    color: '#4BB543',
  },
  finishedFormDivider: {
    margin: `${theme.spacing.unit * 2}px 0 ${theme.spacing.unit}px 0`,
  },
  stepper: {
    backgroundColor: 'inherit',
    marginBottom: theme.spacing.unit * 2,
  },
});

Dashboard.propTypes = propTypes;

export default withStyles(styles)(Dashboard);
