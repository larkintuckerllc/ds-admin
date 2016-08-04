var React = require('react');
var PropTypes = React.PropTypes;
function CheckServers(props) {
  if (props.isServersLoading || props.isAppsLoading
    || props.isLoadingErr || props.isChecking || props.isServersChecked) {
    return (
      <div></div>
    );
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xs-12">
          <div className="form-group">
            <button type="button" className="btn btn-default" onClick={props.onCheckServers}>Check Servers</button>
          </div>
        </div>
      </div>
    </div>
  )
}
CheckServers.propTypes = {
  isLoadingErr: PropTypes.bool.isRequired,
  isServersLoading: PropTypes.bool.isRequired,
  isAppsLoading: PropTypes.bool.isRequired,
  isChecking: PropTypes.bool.isRequired,
  isServersChecked: PropTypes.bool.isRequired,
  onCheckServers: PropTypes.func.isRequired
};
module.exports = CheckServers;
