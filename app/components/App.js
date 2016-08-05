var React = require('react');
var AppUpdating = require('./AppUpdating');
var AppUpdatingError = require('./AppUpdatingError');
var AppUpdated = require('./AppUpdated');
var AppOutOfDate = require('./AppOutOfDate');
var PropTypes = React.PropTypes;
function App(props) {
  return(
    <li className="list-group-item">
      <span className="badge">{props.updatedVersion}</span>
      <strong>{props.repo}</strong> ({props.user})
      <AppUpdating
        isAppUpdating={props.isAppUpdating} />
      <AppUpdatingError
        isAppUpdatingErr={props.isAppUpdatingErr} />
      <AppUpdated
        isAppUpdated={props.isAppUpdated} />
      <AppOutOfDate
        isAppChecked={props.isAppChecked}
        isAppUpToDate={props.isAppUpToDate}
        isAppUpdating={props.isAppUpdating}
        isAppUpdated={props.isAppUpdated}
        onUpdate={props.onUpdate} />
    </li>
  );
}
App.propTypes = {
  user: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  updatedVersion: PropTypes.string.isRequired,
  isAppChecked: PropTypes.bool.isRequired,
  isAppUpToDate: PropTypes.bool.isRequired,
  isAppUpdating: PropTypes.bool.isRequired,
  isAppUpdatingErr: PropTypes.bool.isRequired,
  isAppUpdated: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired
};
module.exports = App;
