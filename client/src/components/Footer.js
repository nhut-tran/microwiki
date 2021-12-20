import React from 'react'
import {NavLink, Link} from 'react-router-dom'
import FacebookIncon from '../img/facebook.svg'
import ZaloIcon from '../img/zalo.svg'

const Footer = () => {
    return (
            
            <footer className='footer'>
                        <div className='footer__nav'>
                            <NavLink className="footer__nav-link" to={`/lookup/methods/1`} >Phương pháp</NavLink>
                            <NavLink className="footer__nav-link" to={`/lookup/media/1` }>Môi trường</NavLink>
                            <NavLink className="footer__nav-link" to={`/contact` }>Liên hệ</NavLink>
                        </div>
                        <div className='footer__logo-box'>
                            <img className='footer__logo' src='/img/logo.png' />
                            <div className="footer__nav-link footer__copy">Microwiki 2020 &#169; </div>
                        </div>
        
                        <div className='footer__nav footer__social'>
                            <Link className="footer__nav-link"><FacebookIncon className='footer__icon' /></Link>
                            <Link className="footer__nav-link"><ZaloIcon className='footer__icon' /></Link>
                        </div>
            </footer>

    )
}

export default Footer

{/* <Link to='/'><img src='./img/logo.png' className='header__logo' /></Link> */}