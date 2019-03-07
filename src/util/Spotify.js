const heroku        = 'https://cors-anywhere.herokuapp.com/';
const accountURI    = 'https://accounts.spotify.com';
const apiURI        = 'https://api.spotify.com/v1';
const redirectURI   = window.location.href;
const clientID      = '72fba45ca3fe4adc999b405eba50b944';
const responseType  = 'token';
const scopes        = ['playlist-modify-public'];


export const Spotify = {
    user:               null,
    accessToken:        null,
    expiresIn:          null,
    state:              Math.round(Math.random() * 999999),
    clientIDParam:      'client_id='.concat(clientID),
    redirectParam:      'redirect_uri='.concat(encodeURIComponent(redirectURI)),
    stateParam:         'state=',
    responseTypeParam:  'response_type='.concat(responseType),
    scopeParam:         'scope='.concat(encodeURIComponent(scopes.join(' '))),   
    
    setSessionProp(propName, value) {
        window.sessionStorage.setItem(propName, value);
    },
    getSessionProp(propName){
        if (sessionStorage.getItem(propName)) {
            return window.sessionStorage.getItem(propName);
        }
        return null;
    },
    removeFromSession(propName){
        window.sessionStorage.removeItem(propName);
    },
    getAuthorizationHeader(){
        return {
            'Authorization': 'Bearer '.concat(this.getAccessToken()),
        };
    },
    buildEndpoint(url, entrypoint, params=null){
        if(params)
            return url.concat(entrypoint, '?', params.join('&'));
        else
            return url.concat(entrypoint);
    },
    buildApiEndpoint(url, entrypoint, params=null){
        if(params)
            return heroku.concat(url, entrypoint, '?', params.join('&'));
        else
            return heroku.concat(url, entrypoint);
    },

    getAccessToken(){           
        const expiresAt = new Date(parseInt(this.getSessionProp('expiresAt')));
        const now = new Date();
        console.log(expiresAt, expiresAt < now);
        if( expiresAt && expiresAt < now ){
            this.removeFromSession('accessToken');
            this.removeFromSession('user');
            this.removeFromSession('expiresAt');
        }
        if(this.getSessionProp('accessToken')){
            this.accessToken    = this.getSessionProp('accessToken'); 
            this.user           = JSON.parse(this.getSessionProp('user'));            
            return this.accessToken;      
        } else if( this.getSessionProp('accessToken') === null && window.location.href.match(/access_token=([^&]*)/) === null ){
            this.stateParam         = this.stateParam.concat(this.state);
            const endpoint          = this.buildEndpoint(accountURI, '/authorize', [this.clientIDParam, this.redirectParam, this.responseTypeParam, this.scopeParam, this.stateParam]);
            window.location.href    = endpoint;
        } else if (window.location.href.match(/access_token=([^&]*)/) !== null && window.location.href.match(/expires_in=([^&]*)/) !== null){            
            this.accessToken = window.location.href.match(/access_token=([^&]*)/)[1]; 
            this.expiresIn   = window.location.href.match(/expires_in=([^&]*)/)[1]
            this.setSessionProp('accessToken', this.accessToken);
            const expiresAt = new Date().getTime() + (this.expiresIn*1000);
            this.setSessionProp('expiresAt', expiresAt);
            this.getUser().then((user) => {
                this.setSessionProp('user', JSON.stringify(user));
            });  
            window.history.pushState('Access Token', null, '/');
        } 
    },
    getUser(){
        const endpoint = this.buildApiEndpoint(apiURI, '/me');

        return fetch(endpoint, {
            headers: this.getAuthorizationHeader(),
        }).then((response) => {
            if(response.ok){
                return response.json();
            }
            throw new Error('Request failed!');
        }, (networkError) => {
            console.log(networkError.message);
        }).then((jsonResponse) => {
            if(jsonResponse.type && jsonResponse.type === 'user'){
                return jsonResponse;
            }
        })
    },
    savePlaylist(playlistName, playlistURIs){
        if( playlistName === null || playlistName === '' ){
            throw new Error('Empty playlistName!');
        }
        if( !Array.isArray(playlistURIs) || playlistURIs.length === 0 ){
            throw new Error('Empty playlist!');
        }     

        this.createPlaylist(playlistName).then((playlist) => {
            return this.addTracksToPlaylist(playlist.id, playlistURIs);
        });
    },
    createPlaylist(playlistName){       
        if( playlistName === null || playlistName === '' ){
            throw new Error('Empty playlistName!');
        }

        const endpoint = this.buildApiEndpoint(apiURI, '/users/'.concat(this.user.id, '/playlists'));

        return fetch(endpoint, {
            method: 'POST',
            headers: this.getAuthorizationHeader(),
            body: JSON.stringify({ name: playlistName, description: "created by Jammming" }),      
        }).then((response) => {
            if(response.ok){
                return response.json();
            }
            throw new Error('Request failed!');
        }, (networkError) => {
            console.log(networkError.message);
        }).then((jsonResponse) => {
            if(jsonResponse.type && jsonResponse.type === 'playlist'){
                return jsonResponse;
            }
        })
    },
    addTracksToPlaylist(playlistId, playlistURIs) {
        if( playlistId === null || playlistId === '' ){
            throw new Error('Empty playlistId!');
        }
        if( !Array.isArray(playlistURIs) || playlistURIs.length === 0 ){
            throw new Error('Empty playlist!');
        }    

        const endpoint = this.buildApiEndpoint(apiURI, '/playlists/'.concat(playlistId, '/tracks'));

        return fetch(endpoint, {
            method: 'POST',
            headers: this.getAuthorizationHeader(),
            body: JSON.stringify({ uris: playlistURIs }),      
        }).then((response) => {
            if(response.ok){
                return response.json();
            }
            throw new Error('Request failed!');
        }, (networkError) => {
            console.log(networkError.message);
        }).then((jsonResponse) => {
            if(jsonResponse.snapshot_id){
                return jsonResponse;
            }
        })
    },

    searchTracks(searchString){                
        if( searchString === null || searchString === '' ){
            throw new Error('Empty searchString!');
        }        

        const types         = ['track'];        
        const queryParam    = 'q='.concat(searchString);  
        const typeParam     = 'type='.concat(encodeURIComponent(types.join(',')));
        const endpoint      = this.buildApiEndpoint(apiURI, '/search', [queryParam, typeParam]);
        this.setSessionProp('search', searchString);

        return fetch(endpoint, {
            headers: this.getAuthorizationHeader(),
        }).then((response) => {
            if(response.ok){
                return response.json();
            }
            throw new Error('Request failed!');
        }, (networkError) => {
            console.log(networkError.message);
        }).then((jsonResponse) => {
            if(jsonResponse.tracks && jsonResponse.tracks.items){
                return jsonResponse.tracks.items.map((track) => 
                {  
                    return {
                        id:     track.id,   
                        uri:    track.uri,
                        artist: track.artists.map(a=>a.name).join(', '),
                        album:  track.album.name,
                        name:   track.name,
                    }                      
                });
            }
        })
    },
}