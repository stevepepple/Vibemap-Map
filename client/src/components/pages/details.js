import React, { Fragment } from 'react';
import { connect } from 'react-redux'
/* TODO: Only require needed actions */
import * as actions from '../../redux/actions'

import { Helmet } from 'react-helmet-async'

function Details(props) {
    console.log('Details props: ', props)
    return (
        <Fragment>
            <Helmet>
                <title>{props.location.name}</title>
                <link rel="canonical" href="https://www.tacobell.com/" />
            </Helmet>
            <div>
                Details page goes here.
            </div>
        </Fragment>
    );
}

const mapStateToProps = state => {
    return {
        currentItem: state.currentItem,
        detailsId: state.detailsId,
        detailsType: state.detailsType
    }
}


export default connect(mapStateToProps, actions)(Details)