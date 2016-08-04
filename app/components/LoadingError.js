var React = require('react');
var PropTypes = React.PropTypes;
function LoadingError(props) {
  if (!props.isLoadingErr) {
    return (
      <div></div>
    );
  }
  return (
    <div className="alert alert-danger" role="alert"><strong>Failed to load...</strong></div>
  );
}
LoadingError.propTypes = {
  isLoadingErr: PropTypes.bool.isRequired
};
module.exports = LoadingError;
