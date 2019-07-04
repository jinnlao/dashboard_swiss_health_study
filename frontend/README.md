# Dashboard
## Setup
To setup this dashboard, go into the dashboard folder (containing the file `package-lock.json`) and run:

    npm ci

Then to run it locally:

    npm start

The server will start (usually at http://localhost:3000/). The page will reload if you make edits. You will also see any lint errors in the console.
## Build for production
To build the project for production run:

    npm run build

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

The file `package.json` contains the dependencies of the project. The field ```homepage``` should be modified accordingly to where the app will be located.

You should also update the variable ```URL_BACKEND``` in the file `Config.js`.

Note: This webapp was created with create-react-app and has not been ejected (which you can do if you aren’t satisfied with the build tool and configuration choices). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/available-scripts).


## App organization
The App code is located in the `src` folder. Each file contain detailed documentation that explains their role. I will try to give an overview of the component interactions here.

`index.js` is very short, it's the "entry file" that will render `App.js`. `App.js` role is to render the whole App, to store/retrieve the states in the browser cache and to handle the logic for the backend communication. It will render the footer (`components/AppFooter.js`), the header (`components/AppHeader.js`) and the main component which is either `components/SignIn.js` (if the user is not logged in) or `components/Dashboard.js` (is the user is logged in).

The AppFooter component is self-contained. The AppHeader will change depending if the user is connected or not, and display a language switch, a help menu (which is a component defined in `components/HelpMenu.js`), and a logout button.

The Dashboard role is to display information about the user progression and provide the links to the forms.

When it is detected that a user has just finished a form (an update from the backend shows that one of the progression value is 1, when it was currently <1), then a discrete notification windows appears to congratulate the participant. This is described in the `components/CongratulationSnackbar.js` class.

The file `global/Config.js` contains some parameters for the dashboard.

## Language and texts
The file `global/localizedStrings.json` contains all the text of the app in both german and french. It is used throughout the app, so each text can be defined here in french/german.

IMPORTANT: The "tree" (in the json structure) must have exactly the same keys for both french and german. Indeed, the roots of the dict is ```fr``` or ```de```. Below each root, all the keys must be exactly the same for both languages.<br>
**Example**:
As ```fr.login.title``` exists, then ```de.login.title``` must also exist!

A python jupyter notebook (located in `tools/json_excel_conversion.ipynb`) is used to create an excel spreadsheet that people without technical background can modify. The script can then take the modified excel sheet and generate the json from it.

## Material-ui
The library [*material-ui*](https://material-ui.com/) is used for the design of the app (it is similar to bootstrap).

In `App.js`, CssBaseline is set at the top level to create some theme baseline, and MuiThemeProvider to select the primary and secondary color of the app. In each component (AppHeader.js, SignIn.js, etc.) of the webapp, different components from @material-ui are used. A description of how to use the components and their API can be found at https://material-ui.com/.

### Style
Adding *style* to a component which uses material-ui is very similar to "classical" React. Indeed, a "styles" constant can be created which contain the styling choices, which are applied to component with the corresponding className. The only difference is that when exported, the component must be surounded by the styling method of material-ui. For example:

    export default withStyles(styles)(MyDashboardComponent);