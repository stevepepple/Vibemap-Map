import React, { Component } from 'react'
import { Button, Checkbox, Divider, Form } from 'semantic-ui-react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

class PlaceForm extends Component {

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

    render() {

        console.log("Current place: ", this.props.currentPlace)

        return (
            <Form>
                <Divider />
                <Form.Field>
                    <label>Place Name</label>
                    <input placeholder='Name of your place or venue' value={this.props.currentPlace.name} />
                </Form.Field>
                <Form.Field>
                    <label>About</label>
                    <input placeholder='Name of your place or venue' value={this.props.currentPlace.name} />
                </Form.Field>
                <Form.Field>
                    <label>Address</label>
                    <input placeholder='Enter address' value={this.props.currentPlace.address} />
                </Form.Field>
                <Form.Field>
                    <label>Website</label>
                    <input placeholder='Enter URL of your webiste' />
                </Form.Field>
                <Form.Field>
                    <label>Instagram</label>
                    <input placeholder='Enter Instagram username' />
                </Form.Field>
                <Form.Field>
                    <Checkbox toggle defaultChecked label='Open to the public' />
                </Form.Field>

                <Form.Field>
                    <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>
        )
    }
}


const mapStateToProps = state => {
    return {
        currentPlace: state.currentPlace,
        detailsId: state.detailsId,
        detailsType: state.detailsType,
        detailsShown: state.detailsShown
    }
}

export default connect(mapStateToProps, actions)(PlaceForm)