var React = require('react');
var ds = require('../../bower_components/ds-client/dist/ds-base.js');
var AdminApps= require('../components/AdminApps');
var UserApps = require('../components/UserApps');
var filter = require('lodash/filter');
var AppsContainer = React.createClass({
  getInitialState: function () {
    return {
      isLoading: true,
      isErr: false,
      apps: []
    }
  },
  componentDidMount: function () {
    ds.list(function(listErr, list) {
      if (listErr !== null) {
        this.setState({
          isLoading: false,
          isErr: true,
          apps: []
        });
        return;
      }
      this.setState({
        isLoading: false,
        isErr: false,
        apps: list
      });
    }.bind(this));
  },
  render: function() {
    var DS_ADMIN_USER = 'larkintuckerllc';
    var DS_ADMIN_REPO = 'ds-admin';
    var userApps = filter(
      this.state.apps,
      function(o) {
        return !(o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
      }
    );
    var adminApps = filter(
      this.state.apps,
      function(o) {
        return (o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
      }
    );
    return (
      <div>
        <AdminApps
          isLoading={this.state.isLoading}
          isErr={this.state.isErr}
          apps={adminApps} />
        <UserApps
          isLoading={this.state.isLoading}
          isErr={this.state.isErr}
          apps={userApps} />
      </div>
    );
  }
});
module.exports = AppsContainer;
