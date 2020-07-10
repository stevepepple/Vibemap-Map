import React, { Component } from 'react'
import { Search, Form, Input, Label } from 'semantic-ui-react'

import debounce from 'lodash.debounce'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import VibeMap from '../../services/VibeMap.js'

class PlaceSearch extends Component {

    constructor(props) {
        super(props)

        // TODO: Move to database or it's own repository
        this.state = { 
            isLoading: false, 
            results: [], 
            search_results: [],
            value: '',
            api: 'https://api.vibemap.com'
        }
    }

    searchPlaces(name) {

        VibeMap.searchPlaces(name)
            .then(results => {
                
                this.setState(() => {
                    return {
                        address: null,
                        results: results.data,
                        search_results: results.search_results,
                        loaded: true
                    };
                });                
            })
    }

    resultRenderer = (result) => {
        console.log("Custom result: ", result)
        
        let label = <div className='result' key={result.title} content={result.title}>
            
            <div class='title'>
                {result.title}
                {result.new &&
                    <Label pointing='left' color='blue'>New</Label>
                }
            </div>
            <div class='description'>{result.description}</div>
        </div>
        return label
    } 

    handleResultSelect = (e, { result }) => {
        console.log('Selected this place: ', result )

        if (result.new === true) {
            console.log('Create NEW AND FILL NAME')
        }

        this.setState({ isLoading: false })        
        this.props.setDetailsShown(true)
        this.props.setDetailsId(result.id)
        this.props.setDetailsType('places')
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length > 2) this.searchPlaces(this.state.value)
            /*
            if (this.state.value.length < 1) return this.setState(initialState)

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = (result) => re.test(result.title)

            this.setState({
                isLoading: false,
                results: _.filter(this.state.result, isMatch),
            })
            */
        }, 300)
    }

    render() {
        const { isLoading, value, search_results } = this.state        

        return(
            <Form>
                <Form.Field>
                    <Search
                        input={{ fluid: true, iconPosition : 'left', placeholder: 'Add your spot now' }}
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={debounce(this.handleSearchChange, 500, {
                            leading: true,
                        })}
                        resultRenderer={this.resultRenderer}
                        results={search_results}
                        value={value}
                        key                   
                    />
                </Form.Field>
                <Form.Field>
                    <Input fluid icon='address card outline' iconPosition='left' placeholder='Or address' value={this.state.address} />
                </Form.Field>                

            </Form>

        )
    }
}

const mapStateToProps = state => {
    console.log('State in PlaceSearch mapping !!!', state)
    return {
        currentPlace: state.currentPlace,
        detailsId: state.places.detailsId,
        detailsType: state.detailsType,
        detailsShown: state.detailsShown
    }
}

export default connect(mapStateToProps, actions)(PlaceSearch)