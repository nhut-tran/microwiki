import React from 'react'
import { connect } from 'react-redux'
import { withRouter, useRouteMatch } from 'react-router-dom'
import LookupDetail from './lookupDetail'
import { getDetailData } from '../../store/configureStore/appStore'
import MethodForm from './MethodForm'
import MediaForm from './Mediaform'
const RightPanel = ({ data, id, filter, handleSubmit }) => {
    if (id) {
        let component
        if (filter === 'data') {
            component = (
                <LookupDetail
                    // data={data}
                    // id={id}
                    // filter={filter}
                    priceProp={true}
                />
            )
        } else if (filter === 'methods') {
            component = (
                <MethodForm
                    data={data}
                    id={id}
                    filter={filter}
                    handleSubmit={handleSubmit}
                />
            )
        } else if (filter === 'media') {
            component = (
                <MediaForm
                    data={data}
                    id={id}
                    filter={filter}
                    handleSubmit={handleSubmit}
                />
            )
        }
        return (
            <div className='rightpanel'>
                {

                    useRouteMatch(`/lookup/:filter/:page?/:id?`) ?
                        <LookupDetail
                        // data={data}
                        // id={id}
                        // filter={filter}
                        /> :
                        component
                }
            </div>
        )
    } else {
        return null
    }
}


const mapStateToProps = (state, { match }) => {

    const filter = match.params.filter
    const id = match.params.id
    return {
        data: getDetailData(state, filter, id),
        filter,
        id
    }
}


export default withRouter(connect(mapStateToProps)(RightPanel))