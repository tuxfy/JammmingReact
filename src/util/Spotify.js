const heroku        = 'https://cors-anywhere.herokuapp.com/';
const accountURL    = 'https://accounts.spotify.com';
const apiURL        = 'https://api.spotify.com/v1';
const redirectURI   = window.location.href;
const clientID      = '72fba45ca3fe4adc999b405eba50b944';
const responseType  = 'token';
const expiresIn     = 3600;
const scopes        = ['playlist-modify-public'];


export const Spotify = {
    user:               null,
    accessToken:        null,
    state:              Math.round(Math.random() * 999999),
    clientIDParam:      'client_id='.concat(clientID),
    redirectParam:      'redirect_uri='.concat(encodeURIComponent(redirectURI)),
    stateParam:         'state=',
    expiresInParam:     'expires_in'.concat(expiresIn),
    responseTypeParam:  'response_type='.concat(responseType),
    scopeParam:         'scope='.concat(encodeURIComponent(scopes.join(' '))),

    getAuthorizationHeader(){
        return {
            'Authorization': 'Bearer '.concat(this.accessToken),
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

    getAccess(){        
        if( this.accessToken !== null ){
            if(this.user === null){                
                this.getUser().then((user) => {
                    this.user = user;
                });
            }         
        } else if( this.accessToken === null && window.location.href.match(/access_token=([^&]*)/) === null ){
            this.stateParam         = this.stateParam.concat(this.state);
            const endpoint          = this.buildEndpoint(accountURL, '/authorize', [this.clientIDParam, this.redirectParam, this.responseTypeParam, this.scopeParam, this.stateParam, this.expiresInParam]);
            window.location.href    = endpoint;
        } else if (window.location.href.match(/access_token=([^&]*)/) !== null && window.location.href.match(/expires_in=([^&]*)/) !== null){
            this.accessToken =  window.location.href.match(/access_token=([^&]*)/)[1];  
            this.getUser().then((user) => {
                this.user = user;
            });          
            const expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
            window.setTimeout(() => {
                this.accessToken    = null;     
                this.user           = null;                   
            }, expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        } 
    },
    getUser(){
        if( this.accessToken === null ){
            throw new Error('Not logged in!');
        }

        const endpoint = this.buildApiEndpoint(apiURL, '/me');

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
        if( this.accessToken === null ){
            throw new Error('Not logged in!');
        }
        if( playlistName === null || playlistName === '' ){
            throw new Error('Empty playlistName!');
        }
        if( !Array.isArray(playlistURIs) || playlistURIs.length === 0 ){
            throw new Error('Empty playlist!');
        }     

        this.createPlaylist(playlistName).then((playlist) => {
            this.addTracksToPlaylist(playlist.id, playlistURIs);
        });
    },
    createPlaylist(playlistName){
        if( this.accessToken === null ){
            throw new Error('Not logged in!');
        }
        if( playlistName === null || playlistName === '' ){
            throw new Error('Empty playlistName!');
        }

        const endpoint = this.buildApiEndpoint(apiURL, '/users/'.concat(this.user.id, '/playlists'));

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
        if( this.accessToken === null ){
            throw new Error('Not logged in!');
        }
        if( playlistId === null || playlistId === '' ){
            throw new Error('Empty playlistId!');
        }
        if( !Array.isArray(playlistURIs) || playlistURIs.length === 0 ){
            throw new Error('Empty playlist!');
        }    

        const endpoint = this.buildApiEndpoint(apiURL, '/playlists/'.concat(playlistId, '/tracks'));

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
            console.log(jsonResponse);
            // if(jsonResponse.type && jsonResponse.type === 'playlist'){
            //     return jsonResponse;
            // }
        })
    },

    // getPlaylist(playlistName){
    //     if( this.accessToken === null ){
    //         throw new Error('Not logged in!');
    //     }
    //     if( playlistName === null || playlistName === '' ){
    //         throw new Error('Empty playlistName!');
    //     }

    //     constUserParam = '&user_id='.concat(this.user.id);
    //     const endpoint = heroku.concat(apiURL,'/search'); 

    //     return fetch(endpoint, {
    //         headers: this.getAuthorizationHeader(),
    //     }).then((response) => {
    //         if(response.ok){
    //             return response.json();
    //         }
    //         throw new Error('Request failed!');
    //     }, (networkError) => {
    //         console.log(networkError.message);
    //     }).then((jsonResponse) => {
    //         // if(jsonResponse.tracks && jsonResponse.tracks.items){
    //         //     return jsonResponse.tracks.items.map((track) => 
    //         //     {  
    //         //         return {
    //         //             id:track.id,   
    //         //             uri: track.uri,
    //         //             artist: track.artists.map(a=>a.name).join(', '),
    //         //             album: track.album.name,
    //         //             name: track.name,
    //         //             // audio: this.getAudio(track.id),
    //         //         }                      
    //         //     });
    //         // }
    //     })
    // },

    searchTracks(searchString){
        this.getAccess();
        if( this.accessToken === null ){
            throw new Error('Not logged in!');
        }        
        if( searchString === null || searchString === '' ){
            throw new Error('Empty searchString!');
        }

        const types         = ['track'];        
        const queryParam    = 'q='.concat(searchString);  
        const typeParam     = 'type='.concat(encodeURIComponent(types.join(',')));
        const endpoint      = this.buildApiEndpoint(apiURL, '/search', [queryParam, typeParam]);

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
                        // audio: this.getAudio(track.id),
                    }                      
                });
            }
        })
    },

    // premium only
    playTrack(id){ 
        if( this.accessToken === null ){
            throw new Error('Not logged in!');
        }
        if( id === null || id === '' ){
            throw new Error('Empty id!');
        }

        const endpoint = heroku.concat(apiURL,'/me/player/play');  

        return fetch(endpoint, {
            method: 'PUT',
            headers: this.getAuthorizationHeader(),
            data: {
                "uris": [`spotify:track:${id}`],
                "position_ms": 0,
            }
        }).then((response) => {
            if(response.ok){
                return response.json();
            }
            throw new Error('Request failed!');
        }, (networkError) => {
            console.log(networkError.message);
        })
    },
    getAudio(id){
        if( id === null || id === '' ){
            throw new Error('Empty id!');
        }

        const endpoint = heroku.concat(apiURL,'/audio-features/', id);  

        return fetch(endpoint, {
            headers: {
                'Authorization': 'Bearer '.concat(this.accessToken),
            }
        }).then((response) => {
            if(response.ok){
                return response.json();
            }
            throw new Error('Request failed!');
        }, (networkError) => {
            console.log(networkError.message);
        }).then((jsonResponse) => {
            console.log(jsonResponse);
            // if(jsonResponse.tracks && jsonResponse.tracks.items){
            //     return jsonResponse.tracks.items.map((track) => 
            //     {  
            //         return {
            //             id:track.id,   
            //             uri: track.uri,
            //             artist: track.artists.map(a=>a.name).join(', '),
            //             album: track.album.name,
            //             name: track.name,
            //         }                      
            //     });
            // }
        })
    },

}