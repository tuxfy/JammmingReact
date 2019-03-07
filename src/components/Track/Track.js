import React from 'react';
import PropTypes from 'prop-types';
import './Track.css';

export class Track extends React.Component{
    constructor(props){
        super(props);
        this.handleClick    = this.handleClick.bind(this);
    }

    renderAction(){
        return this.props.isRemoval? '-' : '+';
    }    

    handleClick(e){
        this.props.onTrackAction(this.props.track);  
        e.preventDefault();
    }    

    render(){
        return (
            <div className="Track">        
                <iframe src={"https://open.spotify.com/embed/track/"+this.props.track.id} width="80" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
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