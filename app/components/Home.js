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
    null;
  var loadingErrEl = props.isLoadingErr ?
    <div className="alert alert-danger" role="alert"><strong>Failed to load...</strong></div> :
    null;
  var serversUpToDateEl = props.isServersChecked && props.isServersUpToDate ?
    <div className="alert alert-success" role="alert"><strong>Servers up to date...</strong></div> :
    null;
  var appsUpToDateEl = props.isAppsChecked && props.isAppsUpToDate ?
    <div className="alert alert-success" role="alert"><strong>Apps up to date...</strong></div> :
    null;
  var checkingEl = props.isChecking ?
    <div className="alert alert-info" role="alert"><strong>Checking...</strong></div> :
    null;
  var checkingErrEl = props.isCheckingErr ?
    <div className="alert alert-danger" role="alert"><strong>Failed to check...</strong></div> :
    null;
  var serverEls = props.servers.map(function(server) {
    return (
      <li className="list-group-item" key={server.user + '-' + server.repo}>
        <strong>{server.repo}</strong> ({server.user})
        <div>Version: {server.version}</div>
      </li>
    );
  });
  var serversOutOfDateEl = (props.isServersChecked && !props.isServersUpToDate) ?
    <div>
      <p></p>
      <div className="alert alert-warning" role="alert"><strong>Servers out of date...</strong></div>
    </div> :
    null;
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
    null;
  var adminAppEls = filter(
    props.apps,
    function(o) {
      return (o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
    }
  ).map(function(app) {
    return (
      <li className="list-group-item"
        key={app.user + '-' + app.repo}>
        <div><strong>{app.repo}</strong> ({app.user})</div>
        <AppContainer
         key={app.user + '-' + app.repo}
         user={app.user}
         repo={app.repo}
         version={app.version}
         isAppChecked={app.isAppChecked}
         isAppUpToDate={app.isAppUpToDate} />
      </li>
    );
  });
  var adminAppsEl = (!props.isServersLoading && !props.isAppsLoading && !props.isLoadingErr) ?
    <div className="panel panel-default">
      <div className="panel-heading"><h3 className="panel-title">Administration Applications</h3></div>
      <ul className="list-group">
        {adminAppEls}
      </ul>
    </div> :
    null;
  var userAppEls = filter(
    props.apps,
    function(o) {
      return !(o.user === DS_ADMIN_USER && o.repo === DS_ADMIN_REPO);
    }
  ).map(function(app) {
    var appLinksEl = app.isActive ?
      <div>
        <a href={'/' + app.user + '-' + app.repo + '/dist/restart/'} target="_blank">Restart</a>
          &nbsp;|&nbsp;<a href={'/' + app.user + '-' + app.repo + '/dist/config/'} target="_blank">Configure</a>
        &nbsp;|&nbsp;<a href={'/' + app.user + '-' + app.repo + '/dist/control/'} target="_blank">Control</a>
      </div> :
      null;
    var appActivateEl = !app.isActive ?
      <button type="button" className="pull-right btn btn-default btn-sm" onClick={props.onActivate.bind(null, app.user, app.repo)}>Activate</button> :
      null;
    return (
      <li className="list-group-item"
        key={app.user + '-' + app.repo}>
        {appActivateEl}
        <div><strong>{app.repo}</strong> ({app.user})</div>
        {appLinksEl}
         <AppContainer
           user={app.user}
           repo={app.repo}
           version={app.version}
           isAppChecked={app.isAppChecked}
           isAppUpToDate={app.isAppUpToDate} />
      </li>
    );
  });
  var userAppsEl = (!props.isServersLoading && !props.isAppsLoading && !props.isLoadingErr) ?
    <div className="panel panel-default">
      <div className="panel-heading"><h3 className="panel-title">User Applications</h3></div>
      <ul className="list-group">
        {userAppEls}
      </ul>
    </div> :
    null;
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
    null;
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
    null;
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
  onCheckApps: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired
};
module.exports = Home;
