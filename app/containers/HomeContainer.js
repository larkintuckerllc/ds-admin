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
    return(
      <Home
        isLoadingErr={this.state.isLoadingErr}
        isServersLoading={this.state.isServersLoading}
        isAppsLoading={this.state.isAppsLoading}
        isChecking={this.state.isChecking}
        isCheckingErr={this.state.isCheckingErr}
        isServersChecked={this.state.isServersChecked}
        isServersUpToDate={this.state.isServersUpToDate}
        isAppsChecked={this.state.isAppsChecked}
        isAppsUpToDate={this.state.isAppsUpToDate}
        servers={this.state.servers}
        apps={this.state.apps}
        onCheckServers={this.handleCheckServers}
        onCheckApps={this.handleCheckApps} />
    );
  }
});
module.exports = HomeContainer;
