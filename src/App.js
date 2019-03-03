import React, { Component } from 'react';
import './App.css';

import { SearchBar } from './components/SearchBar/SearchBar';
import { SearchResults } from './components/SearchResults/SearchResults';
import { Playlist } from './components/Playlist/Playlist';
import { Spotify } from './util/Spotify';


class App extends Component {
    constructor(props) {
        super(props);
        this.state= {
            searchResults: [
            ],
            playlistTracks: [
            ],
            playlistName: ''
        };  
        this.addTrack       = this.addTrack.bind(this);
        this.removeTrack    = this.removeTrack.bind(this);
        this.renamePlaylist = this.renamePlaylist.bind(this);
        this.savePlaylist   = this.savePlaylist.bind(this);
        this.searchTracks   = this.searchTracks.bind(this);
        this.playTrack      = this.playTrack.bind(this);
    }

    playTrack(track){

        // premium only
        // Spotify.playTrack(track.id);
    }

    addTrack(track){
        const pTracks = this.state.playlistTracks;
        if( !pTracks.find( pTrack => pTrack.id === track.id ) ){
            pTracks.push(track);
            this.setState({playlistTracks: pTracks});
        }else{
      
        }
        // const sTracks = this.state.searchResults.filter( sTrack => {
        //   return sTrack.id !== track.id;
        // });    
        // this.setState({searchResults: sTracks});
    }

    removeTrack(track){
        const pTracks = this.state.playlistTracks.filter( pTrack => {
            return pTrack.id !== track.id;
        });    
        this.setState({playlistTracks: pTracks});
    }

    renamePlaylist(playlistName){
        this.setState({playlistName: playlistName});
    }

    savePlaylist(){
        if( this.state.playlistName !== undefined && this.state.playlistName !== ''
        && Array.isArray(this.state.playlistTracks) && this.state.playlistTracks.length !== 0 ){                
            Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks.map(track => track.uri));
        }
    }
    
    searchTracks(searchString){
        if( searchString !== null && searchString !== '' ){
            Spotify.searchTracks(searchString).then((tracks) => {
                this.setState({searchResults: tracks});
            });
        }else{
            this.setState({searchResults: []});
        }
    }

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar 
                        onSearchTracks={this.searchTracks}  />          
                    <div className="App-playlist">
                        <SearchResults  
                            onTrackAction={this.addTrack}     
                            onPlayTrack={this.playTrack}                          
                            searchResults={this.state.searchResults} />
                        <Playlist       
                            onTrackAction={this.removeTrack} 
                            onRenamePlaylist={this.renamePlaylist}
                            onSavePlaylist={this.savePlaylist}
                            playlistTracks={this.state.playlistTracks}
                            playlistName={this.state.playlistName}  />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
