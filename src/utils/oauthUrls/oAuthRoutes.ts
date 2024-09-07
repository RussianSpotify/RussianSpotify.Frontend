export const oAuthRoutes = {
    OAuthGoogleUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_Google_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_Google_Redirect_URL}&response_type=${process.env.REACT_APP_Google_ResponseType}&scope=${process.env.REACT_APP_Google_Scope}&access_type=offline`
};