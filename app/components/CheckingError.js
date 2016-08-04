var React = require('react');
var PropTypes = React.PropTypes;
function CheckingError(props) {
  if (!props.isCheckingErr) {
    return (
      <div></div>
    );
  }
  return (
    <div className="alert alert-danger" role="alert"><strong>Failed to check...</strong></div>
  );
}
CheckingError.propTypes = {
  isCheckingErr: PropTypes.bool.isRequired
};
module.exports = CheckingError;
