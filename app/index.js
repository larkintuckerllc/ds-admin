var DS_ADMIN_USER = 'larkintuckerllc';
var DS_ADMIN_REPO = 'ds-admin';
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
  var Error = require('./components/Error');
  var Loading = require('./components/Loading');
  var LogoutContainer = require('./containers/LogoutContainer');
  var Servers = require('./components/Servers');
  var AdminApps = require('./components/AdminApps');
  var UserApps = require('./components/UserApps');
  var filter = require('lodash/filter');
  var Home = React.createClass({
    getInitialState: function() {
      return({
        isErr: false,
        isServersLoading: true,
        isAppsLoading: true,
        servers: [],
        apps: []
      });
    },
    componentDidMount: function () {
      ds.getServerVersions(function(err, versions) {
        if (err !== null) {
          this.setState({
            isErr: true,
            isServersLoading: false,
            isAppsLoading: this.state.isAppsLoading,
            servers: [],
            apps: this.state.apps
          });
          return;
        }
        if (this.state.isErr) {
          this.setState({
            isErr: true,
            isServersLoading: false,
            isAppsLoading: this.state.isAppsLoading,
            servers: [],
            apps: this.state.apps
          });
          return;
        }
        this.setState({
          isErr: false,
          isServersLoading: false,
          isAppsLoading: this.state.isAppsLoading,
          servers: [
            {
              user: 'larkintuckerllc',
              repo: 'ds-server',
              version: versions.dsServerVersion
            },
            {
              user: 'larkintuckerllc',
              repo: 'thr0w-server',
              version: versions.thr0wServerVersion
            },
          ],
          apps: this.state.apps
        });
      }.bind(this));
      ds.list(function(err, list) {
        if (err !== null) {
          this.setState({
            isErr: true,
            isServersLoading: this.state.isServersLoading,
            isAppsLoading: false,
            servers: this.state.servers,
            apps: []
          });
          return;
        }
        if (this.state.isErr) {
          this.setState({
            isErr: true,
            isServersLoading: this.state.isServersLoading,
            isAppsLoading: false,
            servers: this.state.servers,
            apps: []
          });
          return;
        }
        this.setState({
          isErr: false,
          isServersLoading: this.state.isServersLoading,
          isAppsLoading: false,
          servers: this.state.servers,
          apps: list
        });
      }.bind(this));
    },
    render: function() {
      return (
        <div>
          <Navbar />
          <Error
            isErr={this.state.isErr} />
          <Loading
            isErr={this.state.isErr}
            isServersLoading={this.state.isServersLoading}
            isAppsLoading={this.state.isAppsLoading} />
          <Servers
            isErr={this.state.isErr}
            isServersLoading={this.state.isServersLoading}
            isAppsLoading={this.state.isAppsLoading}
            servers={this.state.servers} />
          <AdminApps
            isErr={this.state.isErr}
            isServersLoading={this.state.isServersLoading}
            isAppsLoading={this.state.isAppsLoading}
            apps={filter(
              this.state.apps,
              function(o) {
                return (o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
              }
            )} />
          <UserApps
            isErr={this.state.isErr}
            isServersLoading={this.state.isServersLoading}
            isAppsLoading={this.state.isAppsLoading}
            apps={filter(
              this.state.apps,
              function(o) {
                return !(o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
              }
            )} />
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
