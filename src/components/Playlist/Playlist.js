import React from 'react';
import PropTypes from 'prop-types';
import { TrackList } from '../TrackList/TrackList';
import './Playlist.css';

export class Playlist extends React.Component{
    constructor(props){
        super(props);
        this.handleChangeName   = this.handleChangeName.bind(this);
        this.handleClickSave    = this.handleClickSave.bind(this);
    }

    handleChangeName(e){
        this.props.onRenamePlaylist(e.target.value);
        e.preventDefault();
    }

    handleClickSave(e){
        if( this.props.playlistName === null || this.props.playlistName === '' ){
            document.querySelector('.Playlist input').focus();
        }else{
            this.props.onSavePlaylist(); 
        }               
        e.preventDefault();
    }

    render(){
        return (
            <div className="Playlist">
                <input onChange={this.handleChangeName} placeholder='New Playlist' value={this.props.playlistName} />
                <TrackList 
                    onTrackAction={this.props.onTrackAction} 
                    trackList={this.props.playlistTracks} 
                    isRemoval/>
                <a onClick={this.handleClickSave} className="Playlist-save">SAVE TO SPOTIFY</a>
            </div>
        );
    }
}

Playlist.propTypes = {
    playlistTracks:     PropTypes.array.isRequired,
    onTrackAction:      PropTypes.func.isRequired,
    onRenamePlaylist:   PropTypes.func.isRequired,
    onSavePlaylist:     PropTypes.func.isRequired,
};