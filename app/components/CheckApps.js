var React = require('react');
var PropTypes = React.PropTypes;
function CheckApps(props) {
  if (!props.isServersChecked || !props.isServersUpToDate
    || props.isChecking || props.isAppsChecked) {
    return (
      <div></div>
    );
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xs-12">
          <div className="form-group">
            <button type="button" className="btn btn-default" onClick={props.onCheckApps}>Check Applications</button>
          </div>
        </div>
      </div>
    </div>
  )
}
CheckApps.propTypes = {
  isServersChecked: PropTypes.bool.isRequired,
  isServersUpToDate: PropTypes.bool.isRequired,
  isChecking: PropTypes.bool.isRequired,
  isAppsChecked: PropTypes.bool.isRequired,
  onCheckApps: PropTypes.func.isRequired
};
module.exports = CheckApps;
