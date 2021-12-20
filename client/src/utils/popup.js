function popupControl(state, fadeEffect, message) {
    return {
        class: `popup popup--${state} popup__${fadeEffect}`,
        message
    }


}

export default popupControl