var React = require('react');
var PropTypes = React.PropTypes;
function Checking(props) {
  if (!props.isChecking) {
    return (
      <div></div>
    );
  }
  return (
    <div className="alert alert-info" role="alert"><strong>Checking...</strong></div>
  );
}
Checking.propTypes = {
  isChecking: PropTypes.bool.isRequired
};
module.exports = Checking;
