import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React, { Component } from 'react';
import IdleTimer from 'react-idle-timer';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import CongratulationSnackbar from './components/CongratulationSnackbar';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import Config from './global/Config';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#004b75',
    },
    secondary: {
      main: '#54bbb9',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {
  /**
   * Starting class of the webapp. Its role is to render the whole App and to handle the logic for the backend communication.
   * 
   * The render method will render 3 components: the footer, the header and the "main page". This "main page" will be the login
   * screen if the user is not logged in, or the dashboard if the user is logged in. It is defined in the method renderMain().
   * 
   * When the user tries to signin, the method handleSubmit() will be called. The role of this method is to contact the backend
   * to check if the user logins are correct, and retrieve the progression and form links if it is the case. If there is any
   * problem or the login ids are incorrect, an error message is shown, otherwise a token is received which will be used
   * for further communication.
   * 
   * The token will be stored in the browser local storage (if the user authorize it), or in the session storage otherwise.
   * 
   * The method fetchEndpointWithToken() will be use later to communicate with the backend without any user interaction, using
   * the token that was saved. It will retrieve any update on the progression of the user.
   * When detecting user interaction (using the component IdleTimer), and if some time has passed (> Config.REFRESH_SECOND), then
   * this method will be called again to be able to update the dashboard of the user.
   * 
   * When the app starts, it will try to retrieve a token from the browser cache. If a token is detected, it will try to automatically
   * login with the token (and get the user progression/links) using the method fetchEndpointWithToken().
   * 
   * 
   * It is possible to provide the participant code and the birth date in the url to pre-fill the login forms. To do so, add
   * the values as parameters in the url. Example: http://localhost:3000/?participantCode=abc&birthDate=2015-02-23. When the component
   * is mounted, the parameters will be removed from the url, so that if the user bookmarks the url, the participant code/birthdate are 
   * protected (not in the bookmark).
   * 
   * 
   * STATE DESCRIPTION:
   * - loggedIn (boolean): True if the user is logged in, false otherwise.
   * - loading (boolean): True when the loading wheel must be shown instead of the login screen or dashboard.
   * - useLocalStorage (boolean): The textfield value in the login form containing the remember me checkbox option.
   *   When the user connects with the checkbox set to true, then when making any request, the token will 
   *   be stored in the localStorage. If false, the token is set in the sessionStorage (which should be destroyed when the browser is closed).
   * 
   * - progression (array[Number]): Array of float storing the progress of the user in each form (with position in array = form id).
   *   Values in this array: 0 = the form has not been started, 1 = the form is finished, any value between 0 and 1 being the progress percentage in the form.
   * - links (array[string]): Array of the personalized links pointing to each form (with position in array = form id).
   * - token (string): token that allows to fetch the backend without the user having to provide its login information again.
   *   It is updated at each new request to the backend.
   * 
   * - language (string): possible values: ["de", "fr"]. Always stored in localStorage when changed.
   * 
   * - participantCode (string): The textfield value in the login form containing the participant code or the OFSP code.
   * - birthDate (string): The textfield value in the login form containing the birthdate. It is a string in the form: YYYY-MM-DD.
   *   True if the user has checked the box, false otherwise.
   * 
   * - loginErrorCode (int): Error codes relative to the login. -1 means no erro, 0..3 means different kind of errors with different types of text to show.
   *   The texts related to the error codes can be found in LocalizedStrings.language.login.errors_description.
   * 
   * - formJustFinishedIds (array(int)): Ids of form(s) that have just been finished by the user (if a change was detected between the last call to the backend
   *   and the current call)
   * 
   */
  constructor() {
    super();
    this.state = {
      // App state:
      loggedIn: true,
      loading: true,

      // User information:
      progression: [0, 0.1, 1],
      links: ["a", "b", "c"],
      token: null,

      // Appbar:
      language: 'fr',

      // Login form fields:
      participantCode: "",
      birthDate: "",
      useLocalStorage: false,

      // Login errors:
      loginErrorCode: -1,

      // Other
      formJustFinishedIds: [],
    };
  }


  /**
   * Built-in function. It is executed each time the app "starts" or any overall page refresh is happening.
   * 
   * It will try to get logins ids from the url parameters to fill-in the login form.
   * It will load the information stored in the browser (language, useLocalStorage, token).
   * If a token was stored, make a request to the endpoint and directly show dahsboard (instead of login) if
   * it was correct
   */
  componentDidMount() {
    console.log(localStorage);
    console.log(sessionStorage);
    // Try to get logins ids from url to fill-in the login form
    const searchParams = new URLSearchParams(window.location.search);
    const pc = searchParams.get('participantCode');
    if (pc !== null) {
      this.setState({ participantCode: pc });
    }
    const bd = searchParams.get('birthDate');
    if (bd !== null) {
      this.setState({ birthDate: bd });
    }
    // Remove parameters from the url, so that if the user bookmarks the url, the  
    // participant code/birthdate are not in the bookmark
    if (pc !== null || bd !== null) {
      window.history.replaceState(null, null, window.location.pathname);
    }

    // Get language from local storage
    let language = localStorage.getItem('language');
    if (language !== null) {
      this.setState({ language: language });
    }

    // Check if the session or the local storage must be used 
    let useLocalStorage = localStorage.getItem('useLocalStorage');
    if (useLocalStorage !== null) {
      useLocalStorage = JSON.parse(useLocalStorage);
      this.setState({ useLocalStorage: useLocalStorage });
    }

    // Load token
    let token = this.getItemFromStorage('token', useLocalStorage);
    console.log("Loaded token:" + token);
    if (token !== null) {
      this.setState({ token: token },
        () => this.fetchEndpointWithToken()
      );
    } else {
      this.setState({ loading: false });
    }
  }


  /**
   * Method that connects to the backend with the given identification ids to obtain (or refresh) the information
   * that is displayed on the dashboard.
   * 
   * @param {object} loginIds: The identification message to send to the backend. Must be one of the following:
   *  - {"participantCode": participantCode, "birthDate": birthDate}
   *  - {"token": token}
   * 
   * @returns The json object with the response form the backend, or null if the operation failed (which can be due
   * to network error, a wrong server output error or json decoding error).
   */
  async fetchEndpoint(loginIds) {
    try {
      const response = await fetch(Config.URL_BACKEND, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginIds)
      });
      if (!response.ok) { // error with server output (not 200)
        return null;
      } else {
        const json = await response.json();
        return json;
      }
    } catch (error) { // can be: fetch function error (network probably), json coding/decoding error
      return null;
    }
  }

  /**
   * Try to login in the app from the login screen.
   * 
   * @param event: form event
   */
  async handleSubmit(event) {
    console.log('handleSubmit');
    event.preventDefault(); // avoid "changing" (reloading) page, because of the form submit button
    this.setState({ loginErrorCode: -1, loading: true });
    let json = await this.fetchEndpoint({
      participantCode: this.state.participantCode,
      birthDate: this.state.birthDate,
    });
    console.log("Received:" + json);
    if (json === null) { // network/server output error, etc.
      this.setState({ loginErrorCode: 0 });
    } else if (!json.ok) { // login error
      this.setState({ loginErrorCode: 1 });
    } else { // login successful
      this.setState({
        progression: json.progression,
        links: json.formLinks,
        token: json.token,
        loggedIn: true,
      });
      console.log("set token local:" + json.token + "  -> " + typeof (json.token));

      localStorage.setItem('useLocalStorage', JSON.stringify(this.state.useLocalStorage));
      this.setItemInStorage('token', json.token, this.state.useLocalStorage);
    }
    this.setState({ loading: false });
  }


  /**
   * Fetch the endpoint for an update (with the token).
   * 
   * In case of failure:
   *   - Show login screen (with error msg) if token has expired.
   *   - Keep loggedIn if the user is currently using the dashboard (to avoid 
   *     disconnecting the user, if there is a short network error for example).
   *   - Disconnect and show login screen if other errors.
   * 
   * In case of success: update progression, links, token and log-in user.
   */
  async fetchEndpointWithToken() {
    console.log('Fetching endpoint with token');
    this.setState({ loginErrorCode: -1 });
    let json = await this.fetchEndpoint({ token: this.state.token });
    // if failed to connect to backend or incorrect token
    if (json === null || (!json.ok && json.reason !== 0)) {
      console.log('Connexion error.');
      // if in a session with data to show, keep in session and show update error message (or try again later)
      if (this.state.progression.length > 0 && this.state.links.length > 0) {
        this.setState({ loginErrorCode: 4 }); // TODO: test this
      } else { // no data to show => go to login screen with no error
        this.setState({
          loggedIn: false,
          loading: false,
        });
      }
      // If token has expired
    } else if (!json.ok && json.reason === 0) {
      this.setState({ loginErrorCode: 3 });
    } else { // if able to connect to backend successfully
      this.updateStateFromEndpoint(json);
    }
  }


  /**
   * Update the state based on the data retrieved from the backend.
   * 
   * @param {json} json The successful data retrieval from the backend
   */
  updateStateFromEndpoint(json) {
    // Compute the number of forms that have been finished exactly during this update.
    // (to show a congratulation windows if a form has just been finished during this update)
    this.setState((prevState, props) => {
      let formJustFinishedIds = [];

      if (prevState.progression !== null && prevState.progression.constructor.name === "Array" &&
        prevState.progression.length > 0 && prevState.progression.length === json.progression.length) {
        for (let i = 0; i < prevState.progression.length; i++) {
          if (json.progression[i] === 1 && prevState.progression[i] < 1) {
            formJustFinishedIds.push(i);
          }
        }
      }

      // update state
      return {
        progression: json.progression,
        links: json.formLinks,
        token: json.token,
        loggedIn: true,
        loading: false,
        formJustFinishedIds: formJustFinishedIds,
      }
    });
    console.log("set fetched token local:" + json.token + "  -> " + typeof (json.token));
    this.setItemInStorage('token', json.token, this.state.useLocalStorage);
  }


  /**
   * Set an item in the browser storage, by selecting the local or session storage.
   * 
   * @param {String} key The key at which to set the object.
   * @param {String} value The value to save in the browser storage.
   * @param {boolean} useLocalStorage True to save the item in the local storage false
   *        to save it in the session storage.
   */
  setItemInStorage(key, value, useLocalStorage) {
    console.log('setitem in storage:', key, '  uselocal:', useLocalStorage);
    if (useLocalStorage) {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  }

  /**
   * Retrieve an item from the browser storage, by selecting the local or session storage.
   * 
   * @param {String} key The key at which to retrieve the object.
   * @param {boolean} useLocalStorage True to retrieve the item from the local storage false
   *        to retrieve it from the session storage.
   * 
   * @returns {String} The value contained at key in the browser storage.
   */
  getItemFromStorage(key, useLocalStorage) {
    console.log("get item", key, "from storage. Use local storage:", useLocalStorage);

    if (useLocalStorage) {
      return localStorage.getItem(key);
    } else {
      return sessionStorage.getItem(key);
    }
  }

  /**
   * Logout of the app and removes all information about user. (except lang choice)
   */
  handleLogout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('useLocalStorage');
    this.setState({
      loggedIn: false, token: null, participantCode: "", birthDate: "",
      progression: [], links: [], useLocalStorage: false
    });
  }


  /**
   * Render the main part of the app (below the appbar, and above the appfooter).
   * If the screen is loading show a loading wheel, otherwise shows the login screen
   * if the user is not connected, or the dashboard if the user is connected.
   */
  renderMain() {
    if (this.state.loading) {
      // Show loading wheel
      return (<div style={{ textAlign: 'center', marginTop: '32px' }}><CircularProgress size={40} /></div>);
    } else if (this.state.loggedIn) {
      return (
        <Dashboard
          progression={this.state.progression}
          links={this.state.links}
          language={this.state.language}
        />
      );
    } else {
      return (
        <SignIn
          participantCode={this.state.participantCode}
          birthDate={this.state.birthDate}
          rememberMe={this.state.useLocalStorage}
          loginErrorCode={this.state.loginErrorCode}
          language={this.state.language}
          handleSubmit={(e) => this.handleSubmit(e)}
          handleChangeParticipantCodeValue={(e) => this.setState({ participantCode: e.target.value })}
          handleChangeBirthDateValue={(e) => this.setState({ birthDate: e.target.value })}
          handleChangeRememberMe={(e) => this.setState({ useLocalStorage: e.target.checked })}
        />
      );
    }
  }

  /**
   * Function that controls what to do when user activity is detected.
   * Fetch endpoint for any progression update.
   * 
   * @param {Object} e Event (mouse move, clicks, keyboard, etc.) generated by the user.
   */
  async onUserAction(e) {
    console.log('User action detected.');
    if (this.state.token !== null) {
      await this.fetchEndpointWithToken();
    }
  }

  /**
   * Renders the App (appheader + main component + appfooter).
   * 
   * Uses MuiThemeProvider to customize the style (color) of the app with Material UI.
   * Uses CSSBaseline to kickstart a consistent and simple baseline to build upon.
   * Uses IdleTimer to detect user activity and fetch endpoint for potential update
   * Uses CongratulationSnackbar to show a message when the user has just finished completing a
   * after some time has passed.
   */
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <IdleTimer
          onAction={(e) => this.onUserAction(e)} // function to fire when a user action is detected
          throttle={1000 * Config.REFRESH_SECOND} // after an action, wait for throttle miliseconds to be able to fire another action
        />
        <CongratulationSnackbar
          formJustFinishedIds={this.state.formJustFinishedIds}
          resetFormFinishedIds={() => this.setState({ formJustFinishedIds: [] })}
          language={this.state.language}
        />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppHeader
            loggedIn={this.state.loggedIn}
            language={this.state.language}
            changeLanguage={(l) => { this.setState({ language: l }); localStorage.setItem('language', l) }}
            logoutAction={() => this.handleLogout()}
          />
          <div style={{ flex: 1 }}>
            {this.renderMain()}
          </div>
          <AppFooter loggedIn={this.state.loggedIn} language={this.state.language} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
