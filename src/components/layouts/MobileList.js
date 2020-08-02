import React, { Component } from 'react'
import { Link } from "react-router-dom";

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

// TODO: Doesn't this even work or can it be done with a smaller library
import debounce from 'lodash.debounce'

import CardCarousel from './CardCarousel'
import ListItems from './ListItems.js'

import styles from '../../styles/ListItems.scss'

class MobileList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            category_options: [],
        }
    }

    handClick(e, id) {
        console.log('Clicked this id: ', id)
    }
    
    render() {

        const { isMobile, placesData } = this.props

        let has_items = placesData && placesData.length > 0
        let items = []

        if (has_items) {
            items = placesData.map((place, index) => {
                return <Link to={'/details/' + place.id}>
                    <ListItems 
                        key={place.id} 
                        id={place.id} 
                        type={place.properties.place_type} 
                        link={place.properties.url} 
                        onClick={this.handClick} 
                        properties={place.properties} 
                        index={index} />
                </Link>
            })
        }


        return (
            <div className='MobileCards ui items' style={{ position: 'absolute', bottom: '1em', width: '100%' }}>
                <CardCarousel 
                    items={items}
                    height='10em'
                    isMobile={isMobile}/>
            </div>
        );
    }
}

MobileList.defaultProps = {
    isMobile: true,
    showPagination: true
}

const mapStateToProps = state => {
    return {
        placeType: state.nav.placeType,
        placesData: state.placesData,
        totalPages: state.nav.totalPages
    }
}

export default connect(mapStateToProps, actions)(MobileList)