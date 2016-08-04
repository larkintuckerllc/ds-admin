var DS_SERVER_USER = 'larkintuckerllc';
var DS_SERVER_REPO = 'ds-server';
var THR0W_SERVER_USER = 'larkintuckerllc';
var THR0W_SERVER_REPO = 'thr0w-server';
var React = require('react');
var CheckServers = require('../components/CheckServers');
var Octokat = require('../../bower_components/octokat/dist/octokat.js');
var find = require('lodash/find');
var PropTypes = React.PropTypes;
var octo = new Octokat();
var CheckServersContainer = React.createClass({
  handleCheck: function() {
    var dsLatestVersion;
    var thr0wLatestVersion;
    getDsServerVersion.bind(this)();
    function getDsServerVersion() {
      octo.repos(DS_SERVER_USER, DS_SERVER_REPO)
        .releases.latest.fetch(
          function(err, release) {
            if (err) {
              this.setState({
                isChecking: false,
                isCheckingErr: true,
                isCheckingDone: false,
                isUpToDate: false
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
            if (err) {
              this.setState({
                isChecking: false,
                isCheckingErr: true,
                isCheckingDone: false,
                isUpToDate: false
              });
              return;
            }
            thr0wLatestVersion = release.tagName;
            check.bind(this)();
          }.bind(this)
        );
    }
    function check() {
      var servers = this.props.servers;
      var dsUpToDate;
      var thr0wUpToDate;
      dsUpToDate = dsLatestVersion === find(servers, function(o){
        return (o.user === DS_SERVER_USER && o.repo === DS_SERVER_REPO);
      }).version;
      thr0wUpToDate = thr0wLatestVersion === find(servers, function(o){
        return (o.user === THR0W_SERVER_USER && o.repo === THR0W_SERVER_REPO);
      }).version;
      this.setState({
        isChecking: false,
        isCheckingErr: false,
        isCheckingDone: true,
        isUpToDate: dsUpToDate && thr0wUpToDate
      });
    }
  },
  getInitialState: function () {
    return {
      isChecking: false,
      isCheckingErr: false,
      isCheckingDone: false,
      isUpToDate: false
    }
  },
  render: function() {
    if (this.props.isLoading) {
        return (
          <div></div>
        );
      }
    if (this.props.isLoadingErr) {
      return (
        <div>
        </div>
      );
    }
    return(
      <CheckServers
        isChecking={this.state.isChecking}
        isCheckingErr={this.state.isCheckingErr}
        isCheckingDone={this.state.isCheckingDone}
        isUpToDate={this.state.isUpToDate}
        onCheck={this.handleCheck} />
    );
  },
  propTypes: {
    isLoading: PropTypes.bool.isRequired,
    isLoadingErr: PropTypes.bool.isRequired,
    servers: PropTypes.array.isRequired
  }
});
module.exports = CheckServersContainer;
