var React = require('react');
var PropTypes = React.PropTypes;
var UserApp = require('../components/UserApp');
var UserAppContainer = React.createClass({
  handleUpdate: function() {
    window.console.log('UPDATE');
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
      <UserApp
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
module.exports = UserAppContainer;
