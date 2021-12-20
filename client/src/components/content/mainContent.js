import React from 'react'
import { Link } from 'react-router-dom'
function mainContent(props) {
   return (
      <>
         <div className='main_content'>
            <div className='hero'>
               <div className='text-box'>
                  <span className='header-primary--main'>MicroWiki</span>
                  <span className='header-primary--sub'>Informative-Fast Look up-Up to Date</span>
                  {/* <Link to='' className="btn btn-white animation-button">Discover</Link> */}
               </div>
               <div></div>
            </div>

         </div>

         <div className="feature">
            <div className="feature__box">Tra cuu phuong phap</div>
            <div className="feature__box">Tra cuu moi truong</div>
            <div className="feature__box">Blog</div>
            <div className="feature__box">Phuong tien</div>

         </div>
      </>
   )

}


export default mainContent