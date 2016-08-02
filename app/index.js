require('bootstrap/dist/css/bootstrap.css');
require('../bower_components/thr0w-client/dist/thr0w-base.css');
require('../bower_components/ds-client/dist/ds-base.css');
require('./index.css');
var thr0w = require('../bower_components/thr0w-client/dist/thr0w-base.js');
var ds = require('../bower_components/ds-client/dist/ds-base.js');
var base = window.location.protocol + '//' +
      window.location.hostname;
thr0w.setBase(base);
ds.setBase(base);
if (window.localStorage.getItem('logout')) {
  window.localStorage.removeItem('logout');
  thr0w.logout();
}
thr0w.addLoginTools(document.body, handleThr0wLogin);
function handleThr0wLogin() {
  var thr0wToken = thr0w.getToken();
  ds.loginToken(thr0wToken, handleLoginToken);
  function handleLoginToken(loginTokenErr) {
    if (loginTokenErr !== null) {
      return ds.addAdminTools(document.body, handleDsLogin);
    }
    handleDsLogin();
    function handleDsLogin() {
      loadReact();
    }
  }
}
function loadReact() {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var Navbar = require('./components/Navbar');
  var LogoutContainer = require('./containers/LogoutContainer');
  var Home = React.createClass({
    render: function() {
      return (
        <div>
          <Navbar />
          <p>Below</p>
          <LogoutContainer />
        </div>
      );
    }
  });
  ReactDOM.render(
    <Home />,
    document.getElementById('app')
  );
}
