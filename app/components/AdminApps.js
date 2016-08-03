var React = require('react');
var AdminApp = require('./AdminApp');
var PropTypes = React.PropTypes;
function AdminApps(props) {
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
       <AdminApp
         key={app.user + '-' + app.repo}
         user={app.user}
         repo={app.repo}
         version={app.version} />
     );
   });
  return (
    <div className="panel panel-default">
      <div className="panel-heading"><h3 className="panel-title">Administration Applications</h3></div>
      <ul className="list-group">
        {apps}
      </ul>
    </div>);
}
AdminApps.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isErr: PropTypes.bool.isRequired,
  apps: PropTypes.array.isRequired
};
module.exports = AdminApps;
