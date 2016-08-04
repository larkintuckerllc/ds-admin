var React = require('react');
var UserAppContainer = require('../containers/UserAppContainer');
var PropTypes = React.PropTypes;
function UserApps(props) {
  if (props.isServersLoading || props.isAppsLoading || props.isLoadingErr) {
    return (
      <div></div>
    );
  }
  var appEls = props.apps.map(function(app) {
     return (
       <UserAppContainer
         key={app.user + '-' + app.repo}
         user={app.user}
         repo={app.repo}
         version={app.version}
         isAppChecked={app.isAppChecked}
         isAppUpToDate={app.isAppUpToDate} />
     );
   });
  return (
    <div className="panel panel-default">
      <div className="panel-heading"><h3 className="panel-title">User Applications</h3></div>
      <ul className="list-group">
        {appEls}
      </ul>
    </div>);
}
UserApps.propTypes = {
  isLoadingErr: PropTypes.bool.isRequired,
  isServersLoading: PropTypes.bool.isRequired,
  isAppsLoading: PropTypes.bool.isRequired,
  apps: PropTypes.array.isRequired
};
module.exports = UserApps;
