var React = require('react');
var PropTypes = React.PropTypes;
var App = require('../components/App');
var ds = require('../../bower_components/ds-client/dist/ds-base.js');
var findIndex = require('lodash/findIndex');
var AppContainer = React.createClass({
  handleUpdate: function() {
    this.setState({
      isAppUpdating: true
    });
    ds.update(this.props.user, this.props.repo, function(updateErr) {
      if (updateErr !== null) {
        this.setState({
          isAppUpdating: false,
          isAppUpdatingErr: true
        });
        return;
      }
      var progressCount = 0;
      var updateProgressInterval =
        window.setInterval(updateProgress.bind(this), 1000);
      function updateProgress() {
        progressCount++;
        if (progressCount === 20) {
          window.clearInterval(updateProgressInterval);
          this.setState({
            isAppUpdating: false,
            isAppUpdatingErr: true
          });
          return;
        }
        ds.list(function(listErr, list) {
          if (listErr !== null) {
            window.clearInterval(updateProgressInterval);
            this.setState({
              isAppUpdating: false,
              isAppUpdatingErr: true
            });
            return;
          }
          var updatedVersion;
          var index = findIndex(list, function(o) {
            return (o.user === this.props.user &&
              o.repo === this.props.repo);
          }.bind(this));
          // NOT IN LIST
          if (index === -1) {
            window.clearInterval(updateProgressInterval);
            this.setState({
              isAppUpdating: false,
              isAppUpdatingErr: true
            });
            return;
          }
          updatedVersion = list[index].version;
          // STILL UPDATING
          if (updatedVersion === 'installing') {
            return;
          }
          // FAILED UPDATE
          if (updatedVersion === 'failed') {
            window.clearInterval(updateProgressInterval);
            this.setState({
              isAppUpdating: false,
              isAppUpdatingErr: true
            });
            return;
          }
          window.clearInterval(updateProgressInterval);
          // SUCCESSFUL UPDATE
          this.setState({
            isAppUpdating: false,
            isAppUpdated: true,
            updatedVersion: updatedVersion
          });
        }.bind(this));
      }
    }.bind(this));
  },
  getInitialState: function() {
    return {
      isAppUpdating: false,
      isAppUpdatingErr: false,
      isAppUpdated: false,
      updatedVersion: this.props.version
    };
  },
  render: function() {
    return (
      <App
        user={this.props.user}
        repo={this.props.repo}
        updatedVersion={this.state.updatedVersion}
        isAppChecked={this.props.isAppChecked}
        isAppUpToDate={this.props.isAppUpToDate}
        isAppUpdating={this.state.isAppUpdating}
        isAppUpdatingErr={this.state.isAppUpdatingErr}
        isAppUpdated={this.state.isAppUpdated}
        onUpdate={this.handleUpdate} />
    );
  },
  propTypes: {
    user: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    isAppChecked: PropTypes.bool.isRequired,
    isAppUpToDate: PropTypes.bool.isRequired
  }
});
module.exports = AppContainer;
