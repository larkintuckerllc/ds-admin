var React = require('react');
var Server = require('./Server');
var PropTypes = React.PropTypes;
var ServersOutOfDate = require('./ServersOutOfDate');
function Servers(props) {
  if (props.isServersLoading || props.isAppsLoading || props.isErr) {
    return (
      <div></div>
    );
  }
  var serverEls = props.servers.map(function(server) {
     return (
       <Server
         key={server.user + '-' + server.repo}
         user={server.user}
         repo={server.repo}
         version={server.version} />
     );
   });
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Servers</h3>
        <ServersOutOfDate
          isServersChecked={props.isServersChecked}
          isServersUpToDate={props.isServersUpToDate} />
      </div>
      <ul className="list-group">
        {serverEls}
      </ul>
    </div>);
}
Servers.propTypes = {
  isErr: PropTypes.bool.isRequired,
  isServersLoading: PropTypes.bool.isRequired,
  isAppsLoading: PropTypes.bool.isRequired,
  isServersChecked: PropTypes.bool.isRequired,
  isServersUpToDate: PropTypes.bool.isRequired,
  servers: PropTypes.array.isRequired,
};
module.exports = Servers;
