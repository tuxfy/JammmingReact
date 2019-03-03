import React from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

export class SearchBar extends React.Component{
    constructor(props) {
        super(props);
        this.state          = {searchString: ''};
        this.handleChange   = this.handleChange.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleKeyUp    = this.handleKeyUp.bind(this);
    }

    handleSearch (e){
        if( this.state.searchString === null || this.state.searchString === '' ){
            document.querySelector('.SearchBar input').focus();
        }else{
            this.props.onSearchTracks(this.state.searchString);
        }
        e.preventDefault();
    }

    handleChange (e){
        this.setState({searchString: e.target.value});
    }

    handleKeyUp(e){
        if (e.key === 'Enter') {
            document.querySelector('.SearchBar a').click();
        }
    }

    render(){
        return (
            <div className="SearchBar">
                <input autoFocus onKeyUp={this.handleKeyUp} onChange={this.handleChange} placeholder="Enter A Song Title" />
                <a onClick={this.handleSearch}>SEARCH</a>
            </div>
        );
    }
}


SearchBar.propTypes = {
    onSearchTracks:   PropTypes.func.isRequired,
};