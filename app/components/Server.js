var React = require('react');
var PropTypes = React.PropTypes;
function Server(props) {
  return(
    <li className="list-group-item">
      <span className="badge">{props.version}</span>
      <strong>{props.repo}</strong> ({props.user})
    </li>
  );
}
Server.propTypes = {
  user: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired
};
module.exports = Server;
