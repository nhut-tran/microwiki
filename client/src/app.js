import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './router/AppRouter'
import appStore from './store/configureStore/appStore'
import { Provider } from 'react-redux'
import './style/main.scss'
const store = appStore();
const App =
    (<Provider store={store}>
        <AppRouter />
    </Provider>)

ReactDOM.render(App, document.getElementById('rootApp'))

