import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getErr } from '../../store/configureStore/appStore'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
// import popupControl from '../../utils/popup'

function LookUpContent(props) {
  //const [popup, setPopup] = useState()
  // popupControl('success', 'fadeIn', 'Save sucess')
  return (
    <div className='lookup'>
      {/* {props.err.message && <div className={`popup popup--success popup__fadeIn`}>{props.err.message}</div>} */}
      <LeftPanel />
      <RightPanel />
    </div>
  )

}
const mapStateToProps = (state, { match }) => {
  const filter = match.params.filter
  return {
    err: getErr(state, filter)
  }
}
export default withRouter(connect(mapStateToProps)(LookUpContent))