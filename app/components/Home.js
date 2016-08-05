var DS_ADMIN_USER = 'larkintuckerllc';
var DS_ADMIN_REPO = 'ds-admin';
var React = require('react');
var LogoutContainer = require('../containers/LogoutContainer');
var AppContainer = require('../containers/AppContainer');
var filter = require('lodash/filter');
var PropTypes = React.PropTypes;
function Home(props) {
  var loadingEl = (!props.isLoadingErr && (props.isServersLoading || props.isAppsLoading)) ?
    <div className="alert alert-info" role="alert"><strong>Loading...</strong></div> :
    <div></div>;
  var loadingErrEl = props.isLoadingErr ?
    <div className="alert alert-danger" role="alert"><strong>Failed to load...</strong></div> :
    <div></div>;
  var serversUpToDateEl = props.isServersChecked && props.isServersUpToDate ?
    <div className="alert alert-success" role="alert"><strong>Servers up to date...</strong></div> :
    <div></div>;
  var appsUpToDateEl = props.isAppsChecked && props.isAppsUpToDate ?
    <div className="alert alert-success" role="alert"><strong>Apps up to date...</strong></div> :
    <div></div>;
  var checkingEl = props.isChecking ?
    <div className="alert alert-info" role="alert"><strong>Checking...</strong></div> :
    <div></div>;
  var checkingErrEl = props.isCheckingErr ?
    <div className="alert alert-danger" role="alert"><strong>Failed to check...</strong></div> :
    <div></div>;
  var serverEls = props.servers.map(function(server) {
    return (
      <li className="list-group-item" key={server.user + '-' + server.repo}>
        <span className="badge">{server.version}</span>
        <strong>{server.repo}</strong> ({server.user})
      </li>
    );
  });
  var serversOutOfDateEl = (props.isServersChecked && !props.isServersUpToDate) ?
    <div>
      <p></p>
      <div className="alert alert-warning" role="alert"><strong>Servers out of date...</strong></div>
    </div> :
    <div></div>;
  var serversEl = (!props.isServersLoading && !props.isAppsLoading && !props.isLoadingErr) ?
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Servers</h3>
        {serversOutOfDateEl}
      </div>
      <ul className="list-group">
        {serverEls}
      </ul>
    </div> :
    <div></div>;
  var adminAppEls = filter(
    props.apps,
    function(o) {
      return (o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
    }
  ).map(function(app) {
    return (
     <AppContainer
       key={app.user + '-' + app.repo}
       type="admin"
       user={app.user}
       repo={app.repo}
       version={app.version}
       isAppChecked={app.isAppChecked}
       isAppUpToDate={app.isAppUpToDate} />
    );
  });
  var adminAppsEl = (!props.isServersLoading && !props.isAppsLoading && !props.isLoadingErr) ?
    <div className="panel panel-default">
      <div className="panel-heading"><h3 className="panel-title">Administration Applications</h3></div>
      <ul className="list-group">
        {adminAppEls}
      </ul>
    </div> :
    <div></div>;
  var userAppEls = filter(
    props.apps,
    function(o) {
      return !(o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
    }
  ).map(function(app) {
    return (
     <AppContainer
       key={app.user + '-' + app.repo}
       type="user"
       user={app.user}
       repo={app.repo}
       version={app.version}
       isAppChecked={app.isAppChecked}
       isAppUpToDate={app.isAppUpToDate} />
    );
  });
  var userAppsEl = (!props.isServersLoading && !props.isAppsLoading && !props.isLoadingErr) ?
    <div className="panel panel-default">
      <div className="panel-heading"><h3 className="panel-title">User Applications</h3></div>
      <ul className="list-group">
        {userAppEls}
      </ul>
    </div> :
    <div></div>;
  var checkServersEl = (!props.isServersLoading && !props.isAppsLoading
    && !props.isLoadingErr && !props.isChecking && !props.isServersChecked) ?
    <div className="container-fluid">
      <div className="row">
        <div className="col-xs-12">
          <div className="form-group">
            <button type="button" className="btn btn-default" onClick={props.onCheckServers}>Check Servers</button>
          </div>
        </div>
      </div>
    </div> :
    <div></div>;
  var checkAppsEl = (props.isServersChecked && props.isServersUpToDate
    && !props.isChecking && !props.isAppsChecked) ?
    <div className="container-fluid">
      <div className="row">
        <div className="col-xs-12">
          <div className="form-group">
            <button type="button" className="btn btn-default" onClick={props.onCheckApps}>Check Applications</button>
          </div>
        </div>
      </div>
    </div> :
    <div></div>;
  return (
    <div>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Digital Signage Administration</h3>
        </div>
      </div>
      {loadingEl}
      {loadingErrEl}
      {serversEl}
      {adminAppsEl}
      {userAppsEl}
      {serversUpToDateEl}
      {appsUpToDateEl}
      {checkingEl}
      {checkingErrEl}
      {checkServersEl}
      {checkAppsEl}
      <LogoutContainer />
    </div>
  );
}
Home.propTypes = {
  isLoadingErr: PropTypes.bool.isRequired,
  isServersLoading: PropTypes.bool.isRequired,
  isAppsLoading: PropTypes.bool.isRequired,
  isChecking: PropTypes.bool.isRequired,
  isCheckingErr: PropTypes.bool.isRequired,
  isServersChecked: PropTypes.bool.isRequired,
  isServersUpToDate: PropTypes.bool.isRequired,
  isAppsChecked: PropTypes.bool.isRequired,
  isAppsUpToDate: PropTypes.bool.isRequired,
  servers: PropTypes.array.isRequired,
  apps: PropTypes.array.isRequired,
  onCheckServers: PropTypes.func.isRequired,
  onCheckApps: PropTypes.func.isRequired
};
module.exports = Home;
