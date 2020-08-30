import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

// TODO: Doesn't this even work or can it be done with a smaller library
import debounce from 'lodash.debounce'

import helpers from '../../helpers';
import * as Constants from '../../constants.js'

import { Dimmer, Dropdown, Form, Input, Item, Loader, Pagination, Segment } from 'semantic-ui-react'

import ListItems from '../layouts/ListItems.js'
import DatePicker from '../elements/DatePicker.js'

import styles from '../../styles/ListItems.scss'


class PlacesList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            category_options: [],
            selected_activity: Constants.main_categories[0],
        }

        this.onClick = this.onClick.bind(this)
        this.onSavePlace = this.onSavePlace.bind(this)
        this.handleSortChange = this.handleSortChange.bind(this)
    }
    
    onChange = (e, { value }) => {
        console.log('Search changd: ', value)
        this.props.setSearchTerm(value)
    }

    handleSortChange = ( value ) => {
        console.log("handleOrdering: ", value)
        this.props.setOrdering(value)
    }
    
    handlePage = (e, { activePage }) => {
        console.log('setCurrentPage: ', activePage)
        this.props.setCurrentPage(activePage)
    }

    onClick = (event, id, type) => { 
        this.props.setDetails(id, type)
    }

    onSavePlace = (event, place) => {

        const { handleSavedPlace } = this.props

        const isSaved = handleSavedPlace(place)
        
    }

    render() {
        let has_items = this.props.data && this.props.data.length > 0
        let items = null

        const { currentPage, ordering, ordering_options, searchTerm, totalPages, t }  = this.props

        if (has_items) {
            // TODO: @cory, sorting should happen on the server. 
            let max = helpers.getMax(this.props.data, 'score')
            items = this.props.data.map((place, index) => {
                return <ListItems 
                        key={place.id} 
                        id={place.id} 
                        type={place.properties.place_type} 
                        link={place.properties.url} 
                        onClick={this.onClick} 
                        onSavePlace={this.onSavePlace}
                        properties={place.properties} 
                        index={index} max={max}/>
            })
        }

        const sort = <Dropdown
            className='ordering tiny basic'
            onChange={this.handleSortChange}
            text={t(ordering)}>
            <Dropdown.Menu>
                {ordering_options.map((value) => (
                    <Dropdown.Item                          
                        key={value}
                        onClick={this.handleSortChange.bind(this, value)} 
                        text={t(value)} 
                        value={t(ordering)} />
                ))}
            </Dropdown.Menu>
        </Dropdown>

        return (
            <Segment id='list' className={styles.list} compact>
                {/* TODO: Move to style sheet */}
                
                <Segment vertical basic>
                    <Form>                        
                        <Form.Field widths='equal'>
                            <Input
                                className='listSearch'
                                fluid
                                label={sort}
                                labelPosition='right'
                                placeholder={t('Search')}
                                icon='search'
                                iconPosition='left'
                                onChange={debounce(this.onChange, 500, {
                                    leading: true,
                                })}
                                size='large'
                                value={searchTerm} />
                        </Form.Field>                        
                    </Form>
                </Segment>
                
                {has_items? (
                    <Item.Group divided relaxed size='small' className='events_list'>
                        {items}

                        <Pagination
                            className='list_pagination'
                            fluid   
                            pointing
                            secondary
                            onPageChange={this.handlePage}
                            boundaryRange={1}
                            siblingRange={1}
                            totalPages={totalPages}
                            firstItem={false}
                            lastItem={false}
                            activePage={currentPage}
                        />
                    </Item.Group>
                ) : (
                    <Segment placeholder basic>
                        <Dimmer active inverted><Loader inverted><h3>Have you ever stopped to smell the roses near Grand Avenue?</h3></Loader></Dimmer>
                    </Segment>
                )}
                
            </Segment>
        );
    }
}

PlacesList.defaultProps = {
    showPagination: true
}

const mapStateToProps = state => {
    return {
        activity: state.nav.activity,
        allCategories: state.nav.allCategories,
        days: state.nav.days,
        currentPage: state.nav.currentPage,
        ordering: state.nav.ordering,
        ordering_options: state.nav.ordering_options,
        searchTerm: state.nav.searchTerm,
        detailsId: state.places.detailsId,
        detailsType: state.detailsType,
        detailsShown: state.detailsShown,
        placeType: state.nav.placeType,
        totalPages: state.nav.totalPages
    }
}

export default connect(mapStateToProps, actions)(withTranslation()(PlacesList))