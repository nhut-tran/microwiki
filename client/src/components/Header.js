import React, { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout, clearErr } from '../store/action/userAction'
import { getCurrentPage } from '../store/configureStore/appStore'
import checkRole from '../utils/checkRole'
const Header = (props) => {
    const [smallNav, setSmallNav] = useState(false)
    const location = useLocation()
    useEffect(() => {
        if (smallNav) {
            setSmallNav((prev) => !prev)
        }
    }, [location])
    return (
        <React.Fragment>
            <header className='header'>

                <div className='header__logo-box'><NavLink to='/'><img className='header__logo' src='/img/logo.png' /></NavLink></div>
                {!smallNav && <div className='nav'>
                    <NavLink className="nav__link" to={`/lookup/methods/1`} >Phương pháp</NavLink>
                    <NavLink className="nav__link" to={`/lookup/media/1`}>Môi trường</NavLink>

                    {checkRole(['admin'], props.user.userRole) ? <NavLink className="nav__link" to={`/admin`} activeClassName='method'>
                        Admin page</NavLink> : null
                    }


                    {(props.user.isLogined) ?

                        (
                            <React.Fragment>
                                <NavLink className="nav__link--userImg" to='/user/myAccount' >{props.user.userStatus ? <img className='nav__userImg' src={`./img/${props.user.photo}`} onError={(e) => e.target.src = '/img/avatar.jpeg'} /> : 'Account not activated'}</NavLink>
                                <NavLink id="nav__link-data" className="nav__link" to={`/edit/data/1`}>Data</NavLink>
                                <NavLink className="nav__link" to='/' onClick={() => { props.dispatch(logout()) }}>Log Out</NavLink>
                            </React.Fragment>

                        )
                        :
                        (
                            <>
                                <NavLink className="nav__link nav__link--login-control" to='/user/login'
                                    onClick={() => { if (props.user.error) props.dispatch(clearErr()) }}
                                >Dang Nhap</NavLink>
                                <NavLink className="nav__link" to='/user/newSignup' onClick={() => { if (props.user.error) props.dispatch(clearErr()) }} >Dang Ky</NavLink>
                            </>
                        )
                    }
                    <div onClick={() => {
                        setSmallNav((prev) => !prev)
                    }}><span className='nav__small-nav'></span></div>
                </div>}

                {
                    smallNav &&
                    <>
                        <div className='nav-small'>
                            <div className='header__logo-box--small-nav'><NavLink to='/'><img className=' header__logo header__logo--small-nav' src='/img/logo.png' /></NavLink></div>
                            <span onClick={() => setSmallNav((prev) => !prev)} className="nav-small__close">X</span>
                            <div className='nav-small__box'>

                                <NavLink onClick={() => setSmallNav((prev) => !prev)}
                                    className="nav-small__link" to='/' >Trang Chu</NavLink>

                                <NavLink onClick={() => setSmallNav((prev) => !prev)}
                                    className="nav-small__link" to={`/lookup/methods/1`} >Phương pháp</NavLink>

                                <NavLink onClick={() => setSmallNav((prev) => !prev)}
                                    className="nav-small__link" to={`/lookup/media/1`}>Môi trường</NavLink>

                                {checkRole(['admin'], props.user.userRole) ? <NavLink className="nav-small__link" to={`/admin`} onClick={() => setSmallNav((prev) => !prev)} activeClassName='method'>
                                    Admin page</NavLink> : null
                                }
                                {(props.user.isLogined) ?

                                    (
                                        <React.Fragment>
                                            <NavLink className="nav-small__link" to={`/edit/data/1`}>Data</NavLink>
                                            <NavLink className="nav-small__link nav-small__link--userImg" to='/user/myAccount' onClick={() => setSmallNav((prev) => !prev)} >{props.user.userStatus ? <img className='nav__userImg' src={`./img/${props.user.photo}`} onError={(e) => e.target.src = '/img/avatar.jpeg'} /> : 'Account not activated'}</NavLink>
                                            <NavLink className="nav-small__link" to='/' onClick={() => { props.dispatch(logout()); setSmallNav((prev) => !prev) }}>Log Out</NavLink>
                                        </React.Fragment>

                                    )
                                    :
                                    (
                                        <>
                                            <Link className="nav-small__link nav-small__link--login-control" to='/user/login' onClick={() => { if (props.user.error) { props.dispatch(clearErr()) }; setSmallNav((prev) => !prev) }}>Dang Nhap</Link>
                                            <Link className="nav-small__link" to='/user/newSignup' onClick={() => { if (props.user.error) { props.dispatch(clearErr()) }; setSmallNav((prev) => !prev) }} >Dang Ky</Link>
                                        </>
                                    )
                                }


                            </div>
                        </div>
                    </>
                }
            </header>
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {

    return {
        user: state.user,
        mediaPage: getCurrentPage(state, 'media'),
        methodPage: getCurrentPage(state, 'methods')

    }
}
export default connect(mapStateToProps)(Header)
