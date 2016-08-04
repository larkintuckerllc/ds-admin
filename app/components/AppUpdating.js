var React = require('react');
var PropTypes = React.PropTypes;
function AppUpdating(props) {
  if (!props.isAppUpdating) {
    return (
      <div></div>
    );
  }
  return (
    <div>
      <p></p>
      <div className="alert alert-info" role="alert"><strong>Updating...</strong></div>
    </div>
  );
}
AppUpdating.propTypes = {
  isAppUpdating: PropTypes.bool.isRequired
};
module.exports = AppUpdating;
