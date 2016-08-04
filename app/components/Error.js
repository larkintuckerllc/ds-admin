var React = require('react');
var PropTypes = React.PropTypes;
function Error(props) {
  if (!props.isErr) {
    return (
      <div></div>
    );
  }
  return (
    <div className="alert alert-danger" role="alert"><strong>Failed to load...</strong></div>
  );
}
Error.propTypes = {
  isErr: PropTypes.bool.isRequired
};
module.exports = Error;
