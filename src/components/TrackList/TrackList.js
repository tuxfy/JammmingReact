import React from 'react';
import PropTypes from 'prop-types';
import {Track} from '../Track/Track'
import './TrackList.css';

export class TrackList extends React.Component{

    render(){
        return (
            <div className="TrackList">
                {this.props.trackList.map(track => {
                    return <Track 
                        key={track.id} 
                        track={track}
                        onTrackAction={this.props.onTrackAction} 
                        isRemoval={this.props.isRemoval!==undefined}  />
                })}                
            </div>            
        )
    }
}

TrackList.propTypes = {
    trackList:   PropTypes.array.isRequired,
    onTrackAction: PropTypes.func.isRequired,
};