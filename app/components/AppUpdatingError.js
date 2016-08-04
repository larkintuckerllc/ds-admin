var React = require('react');
var PropTypes = React.PropTypes;
function AppUpdatingError(props) {
  if (!props.isAppUpdatingErr) {
    return (
      <div></div>
    );
  }
  return (
    <div>
      <p></p>
      <div className="alert alert-danger" role="alert"><strong>Failed to update.</strong></div>
    </div>
  );
}
AppUpdatingError.propTypes = {
  isAppUpdatingErr: PropTypes.bool.isRequired
};
module.exports = AppUpdatingError;
