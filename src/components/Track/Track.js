import React from 'react';
import PropTypes from 'prop-types';
import './Track.css';

export class Track extends React.Component{
    constructor(props){
        super(props);
        this.handleClick    = this.handleClick.bind(this);
        this.handlePlay     = this.handlePlay.bind(this);
    }

    renderAction(){
        return this.props.isRemoval? '-' : '+';
    }

    renderPlay(){
        if( this.props.onPlayTrack !== undefined ){
            // return <a onClick={this.handlePlay} className="Track-action">&#9658; </a>
        }
    }

    handleClick(e){
        this.props.onTrackAction(this.props.track);  
        e.preventDefault();
    }

    handlePlay(e){
        this.props.onPlayTrack(this.props.track);
        e.preventDefault();
    }

    render(){
        return (
            <div className="Track">        
                {this.renderPlay()} 
                <div className="Track-information">
                <h3>{this.props.track.name}</h3>
                <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                <a onClick={this.handleClick} className="Track-action">{this.renderAction()}</a>
            </div>
        );
    }
}

Track.propTypes = {
    track:          PropTypes.object.isRequired,
    onTrackAction:  PropTypes.func.isRequired,
};