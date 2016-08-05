var DS_ADMIN_USER = 'larkintuckerllc';
var DS_ADMIN_REPO = 'ds-admin';
var DS_SERVER_USER = 'larkintuckerllc';
var DS_SERVER_REPO = 'ds-server';
var THR0W_SERVER_USER = 'larkintuckerllc';
var THR0W_SERVER_REPO = 'thr0w-server';
require('bootstrap/dist/css/bootstrap.css');
require('../bower_components/thr0w-client/dist/thr0w-base.css');
require('../bower_components/ds-client/dist/ds-base.css');
require('./index.css');
var thr0w = require('../bower_components/thr0w-client/dist/thr0w-base.js');
var ds = require('../bower_components/ds-client/dist/ds-base.js');
var Octokat = require('../bower_components/octokat/dist/octokat.js');
var find = require('lodash/find');
var octo = new Octokat();
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
  var LoadingError = require('./components/LoadingError');
  var Loading = require('./components/Loading');
  var LogoutContainer = require('./containers/LogoutContainer');
  var Servers = require('./components/Servers');
  var AdminApps = require('./components/AdminApps');
  var UserApps = require('./components/UserApps');
  var Checking = require('./components/Checking');
  var CheckingError = require('./components/CheckingError');
  var CheckServers = require('./components/CheckServers');
  var ServersUpToDate = require('./components/ServersUpToDate');
  var CheckApps = require('./components/CheckApps');
  var AppsUpToDate = require('./components/AppsUpToDate');
  var filter = require('lodash/filter');
  var Home = React.createClass({
    handleCheckServers: function() {
      var dsLatestVersion;
      var thr0wLatestVersion;
      this.setState({
        isChecking: true
      });
      getDsServerVersion.bind(this)();
      function getDsServerVersion() {
        octo.repos(DS_SERVER_USER, DS_SERVER_REPO)
          .releases.latest.fetch(
            function(err, release) {
              if (err) {
                this.setState({
                  isChecking: false,
                  isCheckingErr: true
                });
                return;
              }
              dsLatestVersion = release.tagName;
              getThr0wServerVersion.bind(this)();
            }.bind(this)
          );
      }
      function getThr0wServerVersion() {
        octo.repos(THR0W_SERVER_USER, THR0W_SERVER_REPO)
          .releases.latest.fetch(
            function(err, release) {
              this.setState({
                isChecking: false
              });
              if (err) {
                this.setState({
                  isCheckingErr: true
                });
                return;
              }
              thr0wLatestVersion = release.tagName;
              check.bind(this)();
            }.bind(this)
          );
      }
      function check() {
        var servers = this.state.servers;
        var dsUpToDate;
        var thr0wUpToDate;
        dsUpToDate = (dsLatestVersion === find(servers, function(o){
          return (o.user === DS_SERVER_USER && o.repo === DS_SERVER_REPO);
        }).version);
        thr0wUpToDate = (thr0wLatestVersion === find(servers, function(o){
          return (o.user === THR0W_SERVER_USER && o.repo === THR0W_SERVER_REPO);
        }).version);
        this.setState({
          isServersChecked: true,
          isServersUpToDate: dsUpToDate && thr0wUpToDate
        });
      }
    },
    handleCheckApps: function() {
      var i;
      var numberOfCheckedApps = 0;
      var appsOutOfDate = {};
      this.setState({
        isChecking: true
      });
      for (i = 0; i < this.state.apps.length; i++) {
        checkApp.bind(this)(i);
      }
      function checkApp(index) {
        var app = this.state.apps[index];
        octo.repos(app.user, app.repo).
          releases.latest.fetch(function(err, release) {
            if (this.state.isCheckingErr) {
              return;
            }
            if (err !== null) {
              this.setState({
                isChecking: false,
                isCheckingErr: true
              });
              return;
            }
            numberOfCheckedApps++;
            appsOutOfDate[app.user + '-' + app.repo] =
              (app.version !== release.tagName);
            if (numberOfCheckedApps === this.state.apps.length) {
              check.bind(this)();
            }
          }.bind(this));
      }
      function check() {
        var j;
        var app;
        var updatedApps = [];
        var appsUpToDate = true;
        for (j = 0; j < this.state.apps.length; j++) {
          app = this.state.apps[j];
          app.isAppChecked = true;
          app.isAppUpToDate = !appsOutOfDate[app.user + '-' + app.repo];
          updatedApps.push(app);
          appsUpToDate = !appsOutOfDate[app.user + '-' + app.repo] ?
            false : appsUpToDate;
        }
        this.setState({
          apps: updatedApps,
          isChecking: false,
          isAppsChecked: true,
          isAppsUpToDate: appsUpToDate
        });
      }
    },
    getInitialState: function() {
      return({
        isLoadingErr: false,
        isServersLoading: true,
        isAppsLoading: true,
        isChecking: false,
        isCheckingErr: false,
        isServersChecked: false,
        isServersUpToDate: false,
        isAppsChecked: false,
        isAppsUpToDate: false,
        servers: [],
        apps: []
      });
    },
    componentDidMount: function () {
      ds.getServerVersions(function(err, versions) {
        this.setState({
          isServersLoading: false
        });
        if (this.state.isLoadingErr) {
          return;
        }
        if (err !== null) {
          this.setState({
            isLoadingErr: true
          });
          return;
        }
        this.setState({
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
          ]
        });
      }.bind(this));
      ds.list(function(err, list) {
        this.setState({
          isAppsLoading: false,
        });
        if (this.state.isLoadingErr) {
          return;
        }
        if (err !== null) {
          this.setState({
            isLoadingErr: true
          });
          return;
        }

        this.setState({
          apps: list.map(function(o) {
            o.isAppChecked = false;
            o.isAppUpToDate = false;
            return o;
          })
        });
      }.bind(this));
    },
    render: function() {
      return (
        <div>
          <Navbar />
          <LoadingError
            isLoadingErr={this.state.isLoadingErr} />
          <Loading
            isLoadingErr={this.state.isLoadingErr}
            isServersLoading={this.state.isServersLoading}
            isAppsLoading={this.state.isAppsLoading} />
          <Servers
            isLoadingErr={this.state.isLoadingErr}
            isServersLoading={this.state.isServersLoading}
            isAppsLoading={this.state.isAppsLoading}
            servers={this.state.servers}
            isServersChecked={this.state.isServersChecked}
            isServersUpToDate={this.state.isServersUpToDate} />
          <AdminApps
            isLoadingErr={this.state.isLoadingErr}
            isServersLoading={this.state.isServersLoading}
            isAppsLoading={this.state.isAppsLoading}
            apps={filter(
              this.state.apps,
              function(o) {
                return (o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
              }
            )} />
          <UserApps
            isLoadingErr={this.state.isLoadingErr}
            isServersLoading={this.state.isServersLoading}
            isAppsLoading={this.state.isAppsLoading}
            apps={filter(
              this.state.apps,
              function(o) {
                return !(o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
              }
            )} />
          <ServersUpToDate
            isServersChecked={this.state.isServersChecked}
            isServersUpToDate={this.state.isServersUpToDate} />
          <AppsUpToDate
            isAppsChecked={this.state.isAppsChecked}
            isAppsUpToDate={this.state.isAppsUpToDate} />
          <Checking
            isChecking={this.state.isChecking} />
          <CheckingError
            isCheckingErr={this.state.isCheckingErr} />
          <CheckServers
            isLoadingErr={this.state.isLoadingErr}
            isServersLoading={this.state.isServersLoading}
            isAppsLoading={this.state.isAppsLoading}
            isChecking={this.state.isChecking}
            isServersChecked={this.state.isServersChecked}
            onCheckServers={this.handleCheckServers} />
          <CheckApps
            isServersChecked={this.state.isServersChecked}
            isServersUpToDate={this.state.isServersUpToDate}
            isChecking={this.state.isChecking}
            isAppsChecked={this.state.isAppsChecked}
            onCheckApps={this.handleCheckApps}
            />
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
