require('bootstrap/dist/css/bootstrap.css');
require('./index.css');
var thr0w = require('../bower_components/thr0w-client/dist/thr0w-base.js');
var ds = require('../bower_components/ds-client/dist/ds-base.js');
var React = require('react');
var ReactDOM = require('react-dom');
// TODO: REMOVE DEBUG CODE
window.console.log(thr0w);
window.console.log(ds);
var HelloWorld = React.createClass({
  render: function() {
    return (
      <div>Hello World 4</div>
    );
  }
});
ReactDOM.render(
  <HelloWorld />,
  document.getElementById('app')
);
