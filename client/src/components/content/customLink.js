import React, { useEffect, useState } from 'react'
import { Link, useRouteMatch, Prompt, useLocation } from 'react-router-dom'
import { deleteData } from '../../store/action/dataAction'
import { connect } from 'react-redux'

const customLink = ({ id, to, filter, children, url, dispatch }) => {
    const match = useRouteMatch({
        path: to
    })
    return (
        <div className={match ? `leftpanel__box--selected` : 'leftpanel__box'}>
            <Link onClick={() => window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })} to={to} className='leftpanel__item'>
                {children}
            </Link>
            {

                url === '/edit'
                && <Link
                    className='btn btn-action'
                    onClick={() => {
                        if (confirm('You sure??? Delete??')) {
                            dispatch(deleteData(filter, id))
                        }
                    }}
                >
                    Delete
                    </Link>
            }

        </div>
    )
}

export default connect()(customLink)