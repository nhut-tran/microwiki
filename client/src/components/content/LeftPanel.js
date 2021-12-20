import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter, useRouteMatch } from 'react-router-dom'
import Loading from '../../utils/Loading'
import Download from '../../utils/dowload'
import { setSearch, clearSearch, startState, exportExcel } from '../../store/action/dataAction'
import CustomLink from './customLink'
import { getData, getisFetching, getErr, getTotalPage, getisDownload } from '../../store/configureStore/appStore'
import ErrorNotif from '../content/Error'
import keyTranslate from '../../utils/translateKey'

const LeftPanel = (props) => {

    const leftBody = useRef(null)
    let url
    if (useRouteMatch(`/lookup/${props.filter}/:page?/:id?`)) {
        url = '/lookup'
    } else if (useRouteMatch(`/edit/${props.filter}/:page?/:id?`) || useRouteMatch(`/admin/${props.filter}/:page?/:id?`)) {
        url = '/edit'
    }

    const [search, setSearchForm] = useState(props.search)
    const [download, setDownload] = useState(false)
    useEffect(() => {
        setSearchForm(props.search)
        props.dispatch(startState(props.filter, props.page, props.search))
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }, [props.filter, props.page])

    return (

        <div className={`leftpanel${props.id ? ' leftpanel--active' : ''}`}>
            <div className='leftpanel-fix'>
                <div className='leftpanel__header'>
                    <h3 className='header-secondary'>{keyTranslate(props.filter, props.filter)}</h3>
                    {
                        !props.id ?
                            <form className='form searchForm'>
                                <div className='searchForm__form-group '>
                                    <input type='text' className='searchForm__value' value={search} onChange={(e) => {
                                        setSearchForm(e.target.value)
                                    }} placeholder='Search...' name='search' />{search && <span onClick={() => {
                                        setSearchForm('')
                                        props.dispatch(clearSearch(props.filter))
                                    }} className='searchForm__clear'>x</span>}
                                    <Link onClick=
                                        {() => {
                                            //useEffect not depend on search => manually dispatch to fetch data
                                            if (search) {
                                                props.dispatch(startState(props.filter, props.page, search))
                                            }
                                        }}
                                        to={search ? `${url}/${props.filter}/1?name=${search}` : `${url}/${props.filter}/1`}
                                        className='btn btn-action'>Search
                            </Link>
                                </div>

                            </form> :
                            <Link
                                to={props.search ? `${url}/${props.filter}/${props.page}?name=${props.search}`
                                    : `${url}/${props.filter}/${props.page}`} className='btn btn-shuttle--left'>

                                <span>&#8592;</span> Quay Lai

                    </Link>

                    }

                </div>
                <div className='leftpanel__body' ref={leftBody}>
                    {props.error.message ?
                        <ErrorNotif action={() => {
                            props.dispatch(setSearch(props.filter, ''))
                            setSearchForm('')
                        }}
                            message={props.error.message === 'NOT FOUND' ? 'Not Found. Try another Search Term.' : props.error.message} to={props.error.message === 'Please Login!' ? '/user/login' : `${url}/${props.filter}`} />
                        : props.fetching ?
                            <Loading />

                            : props.data.map(el => {

                                return (

                                    <CustomLink
                                        url={url}
                                        filter={props.filter}
                                        id={el.id}
                                        to={props.search ? `${url}/${props.filter}/${props.page}/${el.id}?name=${props.search}` : `${url}/${props.filter}/${props.page}/${el.id}`}
                                    >{el.name} <span>&#8594;</span></CustomLink>
                                )
                            })



                    }

                    {props.filter === 'data' && <> {

                        !props.download && < Link className='btn btn-action btn-action--method-form' onClick={() => { props.dispatch(exportExcel(props.data)); setDownload(false) }}>Export</ Link>}
                        {props.download && <Link className='btn btn-action btn-action--method-form' onClick={() => {
                            setDownload(true)
                            props.dispatch({ type: 'DOWNLOAD_SUCCESS', filter: props.filter })

                        }}>Dowload</Link>}
                        {download && <Download />}</>
                    }
                </div>
                <div className='leftpanel__footer'>
                    {
                        props.totalPage.map(el => {
                            const to = props.search ? `${url}/${props.filter}/${el}?name=${props.search}` : `${url}/${props.filter}/${el}`
                            const className = el * 1 === props.page * 1 ? 'btn btn-pagination btn--selected' : 'btn btn-pagination'
                            return (
                                <Link id='right'
                                    onClick={() => {

                                        window.scrollTo(0, 0)
                                    }}

                                    className={className}
                                    to={to}>
                                    {el}
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div >
    )
}
const mapStateToProps = (state, { match, location }) => {
    //page, id, filter use source of truth from URL
    const filter = match.params.filter
    const id = match.params.id
    const search = new URLSearchParams(location.search).get('name') || ''
    const page = match.params.page || 1

    return {
        data: getData(state, filter),
        fetching: getisFetching(state, filter),
        download: getisDownload(state, filter),
        error: getErr(state, filter),
        totalPage: getTotalPage(state, filter),
        page,
        filter,
        id,
        search
    }

}


export default withRouter(connect(mapStateToProps)(LeftPanel))
