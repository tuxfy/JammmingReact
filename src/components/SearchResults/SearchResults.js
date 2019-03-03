import React from 'react';
import PropTypes from 'prop-types';
import {TrackList} from '../TrackList/TrackList';
import './SearchResults.css';

export class SearchResults extends React.Component{

    render(){
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList 
                    onTrackAction={this.props.onTrackAction} 
                    onPlayTrack={this.props.onPlayTrack} 
                    trackList={this.props.searchResults} />
            </div>
        );
    }
}

SearchResults.propTypes = {
    searchResults:      PropTypes.array.isRequired,
    onTrackAction:      PropTypes.func.isRequired,
    onPlayTrack:        PropTypes.func.isRequired,
};