var React = require('react');
var UserApp = require('./UserApp');
var PropTypes = React.PropTypes;
function UserApps(props) {
  if (props.isLoading) {
    return (
      <div className="alert alert-info" role="alert">
        <strong>Loading...</strong>
      </div>);
  }
  if (props.isErr) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Failed to load...</strong>
      </div>);
  }
  var apps = props.apps.map(function(app) {
     return (
       <UserApp
         key={app.user + '-' + app.repo}
         user={app.user}
         repo={app.repo}
         version={app.version} />
     );
   });
  return (
    <div className="panel panel-default">
      <div className="panel-heading"><h3 className="panel-title">User Applications</h3></div>
      <ul className="list-group">
        {apps}
      </ul>
    </div>);
}
UserApps.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isErr: PropTypes.bool.isRequired,
  apps: PropTypes.array.isRequired
};
module.exports = UserApps;
