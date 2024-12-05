import auth0 from "auth0-js";

export default class Auth {
    constructor(history) {
        this.history = history;
        this.userProfile = null;

        const dmn = process.env.REACT_APP_AUTH0_DOMAIN;
        const cid = process.env.REACT_APP_AUTH0_CLIENT_ID;
        const uri = process.env.REACT_APP_CALLBACK_URL;
        const rtyp = "token id_token";
        const scp = "openid profile email";

        this.auth0 = new auth0.WebAuth({
            domain: dmn,
            clientID: cid,
            redirectUri: uri,
            responseType: rtyp,
            scope: scp,
        });
    }

    login = () => {
        this.auth0.authorize();
    }

    handleAuthentication = (history) => {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                this.history.push("/");
            } else if (err) {
                this.history.push("/");
                alert(`Error: ${err.error}. Check the console for further details.`);
                console.log(err);
            }
        })
    }

    setSession = (authResult) => {
        console.log(authResult);

        const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())

        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("expires_at", expiresAt);
    }

    isAuthenticated = () => {
        const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        return new Date().getTime() < expiresAt;
    }

    logOut = () => {
        const cid = process.env.REACT_APP_AUTH0_CLIENT_ID;

        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        this.userProfile = null;
        this.history.push("/");
        this.auth0.logout({
            clientID: cid,
            returnTo: "http://localhost:3000"
        })
    }

    getAccessToken = () => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            throw new Error("No access token found.")
        }
        return accessToken;
    }

    getProfile = (callBack) => {
        if (this.userProfile) return callBack(this.userProfile);
        this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
            if (profile) this.userProfile = profile;
            callBack(profile, err);
        })
    }
} 