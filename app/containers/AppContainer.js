var React = require('react');
var PropTypes = React.PropTypes;
var App = require('../components/App');
var ds = require('../../bower_components/ds-client/dist/ds-base.js');
var findIndex = require('lodash/findIndex');
var AppContainer = React.createClass({
  handleUpdate: function() {
    var self = this;
    self.setState({
      isAppUpdating: true
    });
    ds.update(self.props.user, self.props.repo, function(updateErr) {
      if (updateErr !== null) {
        self.setState({
          isAppUpdating: false,
          isAppUpdatingErr: true
        });
        return;
      }
      var progressCount = 0;
      var updateProgressInterval =
        window.setInterval(updateProgress, 1000);
      function updateProgress() {
        progressCount++;
        if (progressCount === 20) {
          window.clearInterval(updateProgressInterval);
          self.setState({
            isAppUpdating: false,
            isAppUpdatingErr: true
          });
          return;
        }
        ds.list(function(listErr, list) {
          if (listErr !== null) {
            window.clearInterval(updateProgressInterval);
            self.setState({
              isAppUpdating: false,
              isAppUpdatingErr: true
            });
            return;
          }
          var updatedVersion;
          var index = findIndex(list, function(o) {
            return (o.user === self.props.user &&
              o.repo === self.props.repo);
          });
          // NOT IN LIST
          if (index === -1) {
            window.clearInterval(updateProgressInterval);
            self.setState({
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
            self.setState({
              isAppUpdating: false,
              isAppUpdatingErr: true
            });
            return;
          }
          window.clearInterval(updateProgressInterval);
          // SUCCESSFUL UPDATE
          self.setState({
            isAppUpdating: false,
            isAppUpdated: true,
            updatedVersion: updatedVersion
          });
        });
      }
    });
  },
  getInitialState: function() {
    var self = this;
    return {
      isAppUpdating: false,
      isAppUpdatingErr: false,
      isAppUpdated: false,
      updatedVersion: self.props.version
    };
  },
  render: function() {
    var self = this;
    return (
      <App
        user={self.props.user}
        repo={self.props.repo}
        updatedVersion={self.state.updatedVersion}
        isAppChecked={self.props.isAppChecked}
        isAppUpToDate={self.props.isAppUpToDate}
        isAppUpdating={self.state.isAppUpdating}
        isAppUpdatingErr={self.state.isAppUpdatingErr}
        isAppUpdated={self.state.isAppUpdated}
        onUpdate={self.handleUpdate} />
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
