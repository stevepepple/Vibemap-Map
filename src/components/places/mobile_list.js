import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { List, Segment } from 'semantic-ui-react'

/* TODO: Remove emotion entirely; just use CSS modules */
import { Global } from '@emotion/core'

import MobileListItem from './mobile_list_item.js'

class MobileList extends Component {

    constructor(props) {
        super(props);
        //this.showDetails = this.showDetails.bind(this);

        this.handleButton = this.handleButton.bind(this);
    }

    // Pass the list tyep via button.
    handleButton = (e) => {
        let type = e.target.getAttribute('value')
        this.props.handleListType(type)
    }

    onClick = (event, id) => {
        this.props.setDetailsId(id)
        this.props.setDetailsShown(true)
    }

    render() {

        let has_items = this.props.data.length > 0;        
        let items = null;

        if (has_items) {
            // TODO: @cory, sorting should happen on the server. 
            let sorted = this.props.data.sort((a, b) => (a.properties.score > b.properties.score) ? -1 : 1)
            items = sorted.map((event) => {
                return <MobileListItem key={event.id} id={event.id} type={event.type} link={event.properties.link} onClick={this.onClick} content={event.properties} />
            })
            
        } else {
            // return <Dimmer active inverted><Loader inverted><h3>Have you ever stopped to smell the roses near Grand Avenue?</h3></Loader></Dimmer>
        }

        return (
            <Segment>
                <Global
                    styles={{
                        '.listContainer' : {
                            position: 'absolute',
                            bottom: '20px',
                            height: '180px',
                            
                            
                        },
                        '.mobileList' : {
                            display: 'flex !important',
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                            overflowY: 'hidden',
                            overflowX: 'scroll',
                            scrollSnapType: 'x mandatory',
                            background: '#FFFFFF',
                            width: '94vw',
                        }
                    }}
                />
                <div className='listContainer'>
                    <List horizontal className='mobileList'>
                        {items}
                    </List>
                </div>
                
            </Segment>
        );
    }
}

const mapStateToProps = state => {
    return {
        searchTerm: state.nav.searchTerm,
        detailsId: state.detailsId,
        detailsShown: state.detailsShown
    }
}

export default connect(mapStateToProps, actions)(MobileList);