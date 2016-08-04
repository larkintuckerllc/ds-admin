var React = require('react');
var PropTypes = React.PropTypes;
function UserApp(props) {
  return(
    <li className="list-group-item">
      <span className="badge">{props.version}</span>
      <strong>{props.repo}</strong> ({props.user})
    </li>
  );
}
UserApp.propTypes = {
  user: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  isAppChecked: PropTypes.bool.isRequired,
  isAppUpToDate: PropTypes.bool.isRequired
};
module.exports = UserApp;
