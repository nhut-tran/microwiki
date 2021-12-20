import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link, withRouter } from 'react-router-dom'
import keyTranslate from '../../utils/translateKey'
import priceFormHook from '../../utils/priceFormHook'
import { checkFinalData } from '../../utils/priceFormHook'
import popupControl from '../../utils/popup'
import { startState } from '../../store/action/dataAction'
import Loading from '../../utils/Loading'
import { connect } from 'react-redux'
import { getDetailData } from '../../store/configureStore/appStore'
function LookupDetail({ data, filter, id, priceProp, dispatch }) {
    const [price, setPrice] = useState(priceProp)
    const [totalFee, setTotalFee] = useState()
    const [state, dispatchs] = priceFormHook()
    const [popup, setPopup] = useState()

    //prepare structure of state
    //if not 'data' delete some prop and set some to undefined
    const setDefState = () => {
        console.log(data)
        const shapeState = data.step.map(step => {
            ({ ...step }.media.forEach(el => {
                console.log(el)
                if (filter !== 'methods') {
                    delete el.temp
                    delete el.time
                    delete el.action
                }

                if (filter !== 'data') {
                    el.weight = undefined
                    el.package = undefined
                    el.unit = ''
                    el.price = undefined
                    el.tool = [{
                        toolPrice: 0,
                        toolQuantity: 0,
                        toolName: ' '
                    }]
                }
            }))

            return step

        })

        dispatchs({ type: 'SET_STATE', state: { data: shapeState, err: [] } })
    }

    useEffect(() => {

        if (filter === 'data' || filter === 'methods') {
            setDefState()
            setTotalFee() //id change => reset total fee => not display when id change
        }

    }, [id, data.name])
    const renderCondition = () => {
        if (filter === 'methods') {
            if (data.step.length > 0) {
                return true
            } else {
                return false
            }
        } else if (filter === 'media') {
            if (Object.keys(data).length > 0) {
                return true
            } else {
                return false
            }
        }

        else if (filter === 'data') {
            if (data.step.length > 0) {

                return true
            } else {
                return false
            }
        }
    }
    useMemo(() => {
        if (price === true) (false)
    }, [id])

    const calPrice = (media) => {
        let pricePerU, mediaWeight;
        if (media.unit === 'piece') {
            pricePerU = media.price / media.package // 1piece = ?VND
            mediaWeight = media.mediaQuantity //num of piece use === num input
        }
        else if (media.mediaUnit === 'mL' && media.unit === 'g') {
            pricePerU = media.price / media.package // 1g = ?VND
            mediaWeight = media.mediaQuantity * media.weight / 1000 // exp 15ml = ?g
        }
        else if (media.mediaUnit === 'mL' && media.unit === 'mL') {
            pricePerU = media.price / media.package // 1ml = ?VND
            mediaWeight = media.mediaQuantity //num of ml use === num input
        }
        const tool = media.tool.reduce((acc, curr) => {
            const toolFee = curr.toolPrice * curr.toolQuantity
            return acc + toolFee
        }, 0)
        return pricePerU * mediaWeight + tool

    }
    if (renderCondition()) { // check if data array >0 => render not just loading 
        const runDispatch = (key, value, ind, index) => {
            dispatchs({ type: 'SET', key, value, index, ind })

        }
        const runDispatchTool = (key, value, ind, index, toolIndex) => {
            dispatchs({ type: 'SET_TOOL', key, value, index, ind, toolIndex })

        }
        const Objkey = Object.keys(data)
        let key = Objkey.filter(el => !el.includes('id'))
        //sort obj key in methods in order
        if (filter === 'methods') {
            const name = []
            const duration = []
            const rest = []
            const type = []
            const useIn = []
            key.map((el) => {
                if (el === 'name') {
                    name.push(el)
                } else if (el.includes('type')) {
                    type.push(el)
                }
                else if (el.includes('Duration')) {
                    duration.push(el)
                } else {
                    rest.push(el)
                }
            })
            key = [...name, ...type, ...duration, ...useIn, ...rest]

        } else if (filter === 'media') {
            const useIn = []
            const rest = []
            key.map(el => {
                if (el === 'UseIn') {
                    useIn.push(el)
                } else {
                    rest.push(el)
                }
            })

            key = [...rest, ...useIn]

        }
        return (
            <>

                {
                    !price ? key.map(el => { //if not in set price

                        if (filter === 'methods' || filter === 'data') {
                            console.log(el)
                            return (

                                <div className='rightpanel__item'>

                                    <span className='rightpanel__key'>{keyTranslate(filter, el)}: </span>
                                    {
                                        el === 'step' ? <> <Link className='btn btn-action btn-action--method-form' onClick={() => { setPrice((prev) => !prev); window.scrollTo(0, 0); setDefState() }}>Ước lượng chi phí</Link>{data[el].map(step => {
                                            return (
                                                <div>
                                                    <span className='rightpanel__subkey'>{step.stepName}</span>
                                                    {
                                                        step.media.map((media, index) => {
                                                            return (
                                                                <ul className='rightpanel__sublist'>
                                                                    <li className='rightpanel__sublist-item rightpanel__sublist-item--action'>{media.action}</li>
                                                                    <li className='rightpanel__sublist-item rightpanel__sublist-item--order'>{step.stepName + '-' + (index + 1)}</li>
                                                                    <li className='rightpanel__sublist-item rightpanel__sublist-item--1'><span>Tên môi trường:</span><Link to={`/lookup/media/1?name=${media.displayName}`}>{media.displayName}</Link></li>
                                                                    <li className='rightpanel__sublist-item rightpanel__sublist-item--2'><span>Lượng môi trường:</span> {media.mediaQuantity}-{media.mediaUnit}</li>
                                                                    <li className='rightpanel__sublist-item rightpanel__sublist-item--3'><span>Nhiệt độ ủ:</span>{`${media.temp} ± ${media.tempRange}`}</li>
                                                                    <li className='rightpanel__sublist-item rightpanel__sublist-item--4'><span>Thời gian ủ:</span>{media.time}</li>
                                                                    <li className='rightpanel__sublist-item rightpanel__sublist-item--5'>Ghi chú: {media.note}</li>
                                                                </ul>
                                                            )
                                                        })}
                                                </div>
                                            )
                                        })}</>
                                            : keyTranslate(filter, data[el].toString(), el)

                                    }
                                </div>
                            )
                        } else if (filter === 'media') {


                            return (

                                <div className='rightpanel__item'>
                                    <span className='rightpanel__key'>{keyTranslate(filter, el)}: </span>
                                    {el === 'useIn' ? data[el].map(method => <><Link to={`/lookup/methods/1?name=${method}`}>{keyTranslate(filter, method, el)}</Link> &nbsp;</>) : keyTranslate(filter, data[el].toString(), el)}
                                </div>

                            )


                        }
                    })
                        : // ==================set price==================================
                        <>
                            {popup ? <div className={popup.class}>{popup.message}</div> : null}
                            {  filter !== 'data' && <Link className='btn btn-shuttle--left' onClick={() => setPrice((prev) => !prev)}><span>&#8592;</span> Quay lại</Link>}
                            {totalFee && <>
                                <h3 className='rightpanel__total-fee'>Tổng chi Phí: {totalFee}</h3>

                                {state.err.length === 0 && <Link className='btn btn-action btn-action--method-form'
                                    onClick={
                                        () => {
                                            const prevData = JSON.parse(localStorage.getItem('data'))

                                            const newData = { [id + 'idN' + data.name]: [...state.data] }

                                            let toSaveData
                                            if (prevData) {
                                                toSaveData = { ...prevData, ...newData }

                                            } else {
                                                toSaveData = { ...newData }
                                            }

                                            localStorage.setItem('data', JSON.stringify(toSaveData))
                                            setPopup(popupControl('success', 'fadeIn', 'Save sucess'))

                                            setTimeout(() => {
                                                setPopup()
                                            }, 1200)
                                            setTimeout(() => {

                                                setPopup(popupControl('success', 'fadeOut', 'Save sucess'))
                                            }, 1000)


                                            if (filter === 'data') dispatch(startState(filter))

                                        }
                                    }
                                >
                                    Save Data
                                </Link>}
                            </>}
                            {
                                state.data.map((step, ind) => {
                                    return (
                                        <div className='rightpanel__item'>

                                            <div className='rightpanel__box'>
                                                <span className='rightpanel__subkey'>{step.stepName}</span>
                                                {
                                                    step.media.map((media, index) => {
                                                        return (


                                                            <ul className='rightpanel__sublist--price'>
                                                                <li className='rightpanel__sublist-item-price rightpanel__sublist-item-price--order'><div>{step.stepName + '-' + (index + 1)}</div></li>
                                                                <li className='rightpanel__sublist-item-price rightpanel__sublist-item-price--media-name'>
                                                                    <h3>Tên môi trường: </h3>{media.displayName}
                                                                </li>


                                                                <li className='rightpanel__sublist-item-price rightpanel__sublist-item-price--media-input'>

                                                                    <div>
                                                                        <span>Lượng môi trường({media.mediaUnit})</span>
                                                                        {state.err.includes(`mediaQuantity-${ind + 1}-${index + 1}`)
                                                                            && <div className='error-notification'>
                                                                                Số không hợp hệ!
                                                                     </div>
                                                                        }

                                                                        <input value={state.data[ind].media[index].mediaQuantity} onChange={(e) => runDispatch('mediaQuantity', e.target.value * 1, ind, index)} /></div>


                                                                    <div>

                                                                        <span>Giá</span>
                                                                        {state.err.includes(`price-${ind + 1}-${index + 1}`)
                                                                            && <div className='error-notification'>
                                                                                Số không hợp hệ!
                                                                     </div>
                                                                        }
                                                                        <input value={state.data[ind].media[index].price} onChange={(e) => runDispatch('price', e.target.value * 1, ind, index)} /></div>
                                                                    <div>
                                                                        <span>Đóng gói</span>
                                                                        {state.err.includes(`package-${ind + 1}-${index + 1}`)
                                                                            && <div className='error-notification'>
                                                                                Số không hợp hệ!
                                                                     </div>
                                                                        }
                                                                        <input value={state.data[ind].media[index].package} onChange={(e) => runDispatch('package', e.target.value * 1, ind, index)} />
                                                                    </div>
                                                                    <div>
                                                                        <span>Lượng cân</span>
                                                                        {state.err.includes(`weight-${ind + 1}-${index + 1}`)
                                                                            && <div className='error-notification'>
                                                                                Số không hợp hệ!
                                                                        </div>
                                                                        }
                                                                        <input value={state.data[ind].media[index].weight} onChange={(e) => runDispatch('weight', e.target.value * 1, ind, index)} />
                                                                    </div>
                                                                    <div>
                                                                        <span>Đơn vị</span>
                                                                        {state.err.includes(`unit-${ind + 1}-${index + 1}`)
                                                                            && <div className='error-notification'>
                                                                                Vui lòng chọn đơn vị phù hợp
                                                                        </div>
                                                                        }
                                                                        <select value={state.data[ind].media[index].unit} onChange={(e) => runDispatch('unit', e.target.value, ind, index)}>
                                                                            <option disabled value=''>----</option>
                                                                            <option value='g'>g</option>
                                                                            <option value='mL'>mL</option>
                                                                            {state.data[ind].media[index].mediaUnit != 'mL' && <option value='piece'>miếng</option>}

                                                                        </select>
                                                                    </div>

                                                                </li>
                                                                <li className='rightpanel__sublist-item-price rightpanel__sublist-item-price--tool-title'>
                                                                    <h3>Thông tin vật tư &nbsp; &nbsp;<Link className='btn btn-action btn-action--method-form'
                                                                        onClick={() => {

                                                                            dispatchs({ type: 'ADD_TOOL', ind, index })
                                                                        }}
                                                                    >+</Link> <Link className='btn btn-action btn-action--method-form'
                                                                        onClick={() => {

                                                                            dispatchs({ type: 'REMOVE_TOOL', ind, index })
                                                                        }}
                                                                    >-</Link></h3>
                                                                </li>
                                                                { media.tool.map((tool, toolIndex) => {
                                                                    return (
                                                                        <>

                                                                            <li className='rightpanel__sublist-item-price rightpanel__sublist-item-price--tool-input'>

                                                                                <div><span>Tên vật tư </span>
                                                                                    {state.err.includes(`toolName-${ind + 1}-${index + 1}${toolIndex}`)
                                                                                        && <div className='error-notification'>
                                                                                            Chọn tên vật tư
                                                                                    </div>
                                                                                    }
                                                                                    <select value={tool.toolName} onChange={(e) => runDispatchTool('toolName', e.target.value, ind, index, toolIndex)}>
                                                                                        <option value=''>----</option>
                                                                                        <option value='petri'>Đĩa petri</option>
                                                                                        <option value='sterBag'>Túi vô trùng</option>
                                                                                        <option value='other'>Khác</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div>
                                                                                    <span>Số lượng</span>
                                                                                    {state.err.includes(`toolQuantity-${ind + 1}-${index + 1}${toolIndex}`)
                                                                                        && <div className='error-notification'>
                                                                                            Số không hợp hệ!
                                                                                    </div>
                                                                                    }
                                                                                    <input value={tool.toolQuantity} onChange={(e) => runDispatchTool('toolQuantity', e.target.value * 1, ind, index, toolIndex)} />

                                                                                </div>
                                                                                <div>
                                                                                    <span>Giá</span>
                                                                                    {state.err.includes(`toolPrice-${ind + 1}-${index + 1}${toolIndex}`)
                                                                                        && <div className='error-notification'>
                                                                                            Số không hợp hệ!
                                                                                    </div>
                                                                                    }
                                                                                    <input value={tool.toolPrice} onChange={(e) => runDispatchTool('toolPrice', e.target.value * 1, ind, index, toolIndex)} />
                                                                                </div>

                                                                            </li>

                                                                        </>
                                                                    )
                                                                })}
                                                            </ul>

                                                        )
                                                    })}
                                            </div>

                                        </div>

                                    )
                                })}
                            <Link className='btn btn-action btn-action--method-form'
                                onClick={() => {
                                    const err = checkFinalData(state)
                                    setTotalFee('Dữ liệu không hợp lệ. Vui lòng kiểm tra dữ liệu bạn đã nhập')
                                    if (err.length > 0) {
                                        dispatchs({ type: "SET_ERR", err })
                                    } else {

                                        let total = state.data.reduce((acc, curr) => {
                                            const value = curr.media.reduce((ac, cur) => {
                                                const val = calPrice(cur)
                                                return ac + val
                                            }, 0)

                                            return acc + value
                                        }, 0)
                                        const numFormat = Intl.NumberFormat()
                                        total = numFormat.format(total.toFixed(2))
                                        setTotalFee(`${total} VND`)
                                        dispatchs({ type: "REMOVE_ERR", err })

                                    }
                                    window.scrollTo({
                                        top: 0,
                                        left: 0,
                                        behavior: 'smooth'
                                    })
                                }}>Tính tổng chi phí</Link>
                        </>

                }
            </>
        )
    } else {
        return <Loading />
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


export default withRouter(connect(mapStateToProps)(LookupDetail))
