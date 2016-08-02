var React = require('react');
var ReactDOM = require('react-dom');
require('bootstrap/dist/css/bootstrap.css');
require('./index.css');
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
