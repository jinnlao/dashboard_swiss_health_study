# Dashboard endpoint API
It works in a REST-like API. Each time the user wants an update on his data, his request must contain its authentication information (login ids or token) and these are validated before sending back the data.

## Challenges
The backend has to be integrated to the study backend system (REDCap). Because of this requirement, a real authentication system (login + password) is not possible . To overcome this challenge, while still providing some security, an ad-hoc authentication system using the unique and secret code of the study participant in combination with their birthdate was developed. The documention below details this system.

## User identification
The login used here that will be compared with the information in the REDCap database are:
 * participant_code or fso_code
 * dob (date of birth)

### Token: how it works
The first time that the user logins (with his ids: typically the participant id/ofsp id + birth date), he will be given a token that is stored in the browser local storage. During his whole session, the token can be used to request information at the endpoint (here) without having to provide the login ids again.

If the user decides to click on the "remember me" button at login, the information will be conserved for further sessions, ortherwise it will be destroyed at the end of the current session and the user will need to reconnect with his login ids on the next session. If the user does not connect on the dashboard for a long period, he will need to authenticate again using his login ids.

### Token generation
The token is not saved on the server, but in the user browser. The token in itself is a json (encoded in a string) that contains 3 informations:
 * the participant code (participant id/ofsp id)
 * the birth date
 * the unix timestamp of its last login
 
To avoid keeping this information in clear in the browser and avoid a modification of the timestamp (by a malicious user), this information will be encrypted. The encryption will take place on the server (in the file *dashboard_endpoint.php*) and use symmetric encryption (AES-256) provided by OpenSSL (available in PHP).

The timestamp will be checked each time a token is received, and the token will be refused if it has exceeded some time (MAX_TIME_LOGIN_SAVED variable).

With this system, the server does not need to conserve a "state" for the user, but it can be sure of the authenticity of the token. Furthermore the login ids (particpant code + date of birth) are not kept in the browser, which provides an additional layer of security.

## Other
### Key generation
The file *generate_symmetric_keys.php* can be used to generate a symmetric key that can be used in *dashboard_endpoint.php*.