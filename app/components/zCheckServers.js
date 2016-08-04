var React = require('react');
var PropTypes = React.PropTypes;
function CheckServers(props) {
  if (props.isChecking) {
    return (
      <div className="alert alert-info" role="alert">
        <strong>Checking...</strong>
      </div>);
  }
  if (props.isCheckingErr) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Failed to check...</strong>
      </div>);
  }
  if (props.isCheckingDone) {
    if (props.isUpToDate) {
      return (
        <div className="alert alert-success" role="alert">
          <strong>Up to date...</strong>
        </div>);
    } else {
        return (
        <div className="alert alert-warning" role="alert">
          <strong>Out of date...</strong>
        </div>);
    }
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xs-12">
          <div className="form-group">
            <button type="button" className="btn btn-default" onClick={props.onCheck}>Check Servers</button>
          </div>
        </div>
      </div>
    </div>
  )
}
CheckServers.propTypes = {
  isChecking: PropTypes.bool.isRequired,
  isCheckingErr: PropTypes.bool.isRequired,
  isCheckingDone: PropTypes.bool.isRequired,
  isUpToDate: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired
};
module.exports = CheckServers;
