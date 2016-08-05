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
      loadApp();
    }
  }
}
function loadApp() {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var HomeContainer = require('./containers/HomeContainer');
  var Application = React.createClass({
    render: function() {
      return(
        <HomeContainer />
      );
    }
  });
  ReactDOM.render(
    <Application />,
    document.getElementById('app')
  );
}
