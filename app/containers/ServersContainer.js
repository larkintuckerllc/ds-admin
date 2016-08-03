var React = require('react');
var ds = require('../../bower_components/ds-client/dist/ds-base.js');
var Servers = require('../components/Servers');
var ServersContainer = React.createClass({
  getInitialState: function () {
    return {
      isLoading: true,
      isErr: false,
      servers: []
    }
  },
  componentDidMount: function () {
    ds.getServerVersions(function(getServerVersionsErr, versions) {
      if (getServerVersionsErr !== null) {
        this.setState({
          isLoading: false,
          isErr: true,
          servers: []
        });
        return;
      }
      this.setState({
        isLoading: false,
        isErr: false,
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
  },
  render: function() {
    return (
      <Servers
        isLoading={this.state.isLoading}
        isErr={this.state.isErr}
        servers={this.state.servers} />
    );
  }
});
module.exports = ServersContainer;
