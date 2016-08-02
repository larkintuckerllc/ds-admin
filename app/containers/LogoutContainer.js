var React = require('react');
var Logout = require('../components/Logout');
var ds = require('../../bower_components/ds-client/dist/ds-base.js');
var LogoutContainer = React.createClass({
  handleLogout: function() {
    window.localStorage.setItem('logout', true);
    ds.logout();
  },
  render: function() {
    return (
      <Logout
        onLogout={this.handleLogout}/>
    );
  }
});
module.exports = LogoutContainer;
