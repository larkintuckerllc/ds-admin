var React = require('react');
var AppContainer = require('../containers/AppContainer');
var PropTypes = React.PropTypes;
function AdminApps(props) {
  if (props.isServersLoading || props.isAppsLoading || props.isLoadingErr) {
    return (
      <div></div>
    );
  }
  var appEls = props.apps.map(function(app) {
     return (
       <AppContainer
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
      <div className="panel-heading"><h3 className="panel-title">Administration Applications</h3></div>
      <ul className="list-group">
        {appEls}
      </ul>
    </div>);
}
AdminApps.propTypes = {
  isLoadingErr: PropTypes.bool.isRequired,
  isServersLoading: PropTypes.bool.isRequired,
  isAppsLoading: PropTypes.bool.isRequired,
  apps: PropTypes.array.isRequired
};
module.exports = AdminApps;
