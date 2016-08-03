var React = require('react');
var Server = require('./Server');
var PropTypes = React.PropTypes;
function Servers(props) {
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
  var servers = props.servers.map(function(server) {
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
      <div className="panel-heading"><h3 className="panel-title">Servers</h3></div>
      <ul className="list-group">
        {servers}
      </ul>
    </div>);
}
Servers.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isErr: PropTypes.bool.isRequired,
  servers: PropTypes.array.isRequired
};
module.exports = Servers;
