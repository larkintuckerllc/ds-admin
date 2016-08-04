var React = require('react');
var PropTypes = React.PropTypes;
function AppUpdated(props) {
  if (!props.isAppUpdated) {
    return (
      <div></div>
    );
  }
  return (
    <div>
      <p></p>
      <div className="alert alert-success" role="alert"><strong>App updated.</strong></div>
    </div>
  );
}
AppUpdated.propTypes = {
  isAppUpdated: PropTypes.bool.isRequired
};
module.exports = AppUpdated;
