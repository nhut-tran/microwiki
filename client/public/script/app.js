'use strict';

var getData = function getData() {
    return 'nhut';
};
var template = React.createElement(
    'div',
    null,
    React.createElement(
        'p',
        null,
        getData()
    )
);
var appRoot = document.getElementById('rootApp');
ReactDOM.render(template, appRoot);
