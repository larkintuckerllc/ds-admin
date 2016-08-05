var DS_SERVER_USER = 'larkintuckerllc';
var DS_SERVER_REPO = 'ds-server';
var THR0W_SERVER_USER = 'larkintuckerllc';
var THR0W_SERVER_REPO = 'thr0w-server';
var React = require('react');
var Octokat = require('../../bower_components/octokat/dist/octokat.js');
var find = require('lodash/find');
var ds = require('../../bower_components/ds-client/dist/ds-base.js');
var Home = require('../components/Home');
var octo = new Octokat();
var HomeContainer = React.createClass({
  handleActivate: function(user, repo) {
    var self = this;
    ds.setStartup(user + '-' + repo + '/dist/', function(err) {
      if (err !== null) {
        self.setState({
          isLoadingErr: true
        });
        return;
      }
      self.setState({
        apps: self.state.apps.map(function(o) {
          o.isActive = (o.user === user && o.repo === repo);
          return o;
        })
      });
    });
  },
  handleCheckServers: function() {
    var self = this;
    var dsLatestVersion;
    var thr0wLatestVersion;
    self.setState({
      isChecking: true
    });
    getDsServerVersion();
    function getDsServerVersion() {
      octo.repos(DS_SERVER_USER, DS_SERVER_REPO)
        .releases.latest.fetch(
          function(err, release) {
            if (err) {
              self.setState({
                isChecking: false,
                isCheckingErr: true
              });
              return;
            }
            dsLatestVersion = release.tagName;
            getThr0wServerVersion();
          }
        );
    }
    function getThr0wServerVersion() {
      octo.repos(THR0W_SERVER_USER, THR0W_SERVER_REPO)
        .releases.latest.fetch(
          function(err, release) {
            self.setState({
              isChecking: false
            });
            if (err) {
              self.setState({
                isCheckingErr: true
              });
              return;
            }
            thr0wLatestVersion = release.tagName;
            check()
          }
        );
    }
    function check() {
      var servers = self.state.servers;
      var dsUpToDate;
      var thr0wUpToDate;
      dsUpToDate = (dsLatestVersion === find(servers, function(o){
        return (o.user === DS_SERVER_USER && o.repo === DS_SERVER_REPO);
      }).version);
      thr0wUpToDate = (thr0wLatestVersion === find(servers, function(o){
        return (o.user === THR0W_SERVER_USER && o.repo === THR0W_SERVER_REPO);
      }).version);
      self.setState({
        isServersChecked: true,
        isServersUpToDate: dsUpToDate && thr0wUpToDate
      });
    }
  },
  handleCheckApps: function() {
    var self = this;
    var i;
    var numberOfCheckedApps = 0;
    var appsOutOfDate = {};
    self.setState({
      isChecking: true
    });
    for (i = 0; i < self.state.apps.length; i++) {
      checkApp(i);
    }
    function checkApp(index) {
      var app = self.state.apps[index];
      octo.repos(app.user, app.repo).
        releases.latest.fetch(function(err, release) {
          if (self.state.isCheckingErr) {
            return;
          }
          if (err !== null) {
            self.setState({
              isChecking: false,
              isCheckingErr: true
            });
            return;
          }
          numberOfCheckedApps++;
          appsOutOfDate[app.user + '-' + app.repo] =
            (app.version !== release.tagName);
          if (numberOfCheckedApps === self.state.apps.length) {
            check();
          }
        });
    }
    function check() {
      var j;
      var app;
      var updatedApps = [];
      var appsUpToDate = true;
      for (j = 0; j < self.state.apps.length; j++) {
        app = self.state.apps[j];
        app.isAppChecked = true;
        app.isAppUpToDate = !appsOutOfDate[app.user + '-' + app.repo];
        updatedApps.push(app);
        appsUpToDate = !appsOutOfDate[app.user + '-' + app.repo] ?
          false : appsUpToDate;
      }
      self.setState({
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
    var self = this;
    ds.getServerVersions(function(err, versions) {
      self.setState({
        isServersLoading: false
      });
      if (self.state.isLoadingErr) {
        return;
      }
      if (err !== null) {
        self.setState({
          isLoadingErr: true
        });
        return;
      }
      self.setState({
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
    });
    ds.getStartup(function(getStartupErr, startupUrl) {
      if (self.state.isLoadingErr) {
        return;
      }
      if (getStartupErr !== null) {
        self.setState({
          isAppsLoading: false,
          isLoadingErr: true
        });
      }
      ds.list(function(listErr, list) {
        self.setState({
          isAppsLoading: false,
        });
        if (self.state.isLoadingErr) {
          return;
        }
        if (listErr !== null) {
          self.setState({
            isLoadingErr: true
          });
          return;
        }
        self.setState({
          apps: list.map(function(o) {
            o.isAppChecked = false;
            o.isAppUpToDate = false;
            o.isActive = (startupUrl === o.user + '-' + o.repo + '/dist/');
            return o;
          })
        });
      });
    });
  },
  render: function() {
    var self = this;
    return(
      <Home
        isLoadingErr={self.state.isLoadingErr}
        isServersLoading={self.state.isServersLoading}
        isAppsLoading={self.state.isAppsLoading}
        isChecking={self.state.isChecking}
        isCheckingErr={self.state.isCheckingErr}
        isServersChecked={self.state.isServersChecked}
        isServersUpToDate={self.state.isServersUpToDate}
        isAppsChecked={self.state.isAppsChecked}
        isAppsUpToDate={self.state.isAppsUpToDate}
        servers={self.state.servers}
        apps={self.state.apps}
        onCheckServers={self.handleCheckServers}
        onCheckApps={self.handleCheckApps}
        onActivate={self.handleActivate} />
    );
  }
});
module.exports = HomeContainer;
