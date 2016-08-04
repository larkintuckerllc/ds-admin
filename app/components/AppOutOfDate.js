var React = require('react');
var PropTypes = React.PropTypes;
function AppOutOfDate(props) {
  if (!props.isAppChecked || props.isAppUpToDate
    || props.isAppUpdating || props.isAppUpdated) {
    return (
      <div></div>
    );
  }
  return (
    <div>
      <p></p>
      <div className="alert alert-warning" role="alert"><strong>App out of date...</strong></div>
      <div className="form-group">
        <button type="button" className="btn btn-default" onClick={props.onUpdate}>Update</button>
      </div>
    </div>
  );
}
AppOutOfDate.propTypes = {
  isAppChecked: PropTypes.bool.isRequired,
  isAppUpToDate: PropTypes.bool.isRequired,
  isAppUpdating: PropTypes.bool.isRequired,
  isAppUpdated: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired
};
module.exports = AppOutOfDate;
