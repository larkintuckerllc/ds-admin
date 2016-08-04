var React = require('react');
var PropTypes = React.PropTypes;
function Loading(props) {
  if (props.isLoadingErr || !(props.isServersLoading || props.isAppsLoading)) {
    return (
      <div></div>
    );
  }
  return (
    <div className="alert alert-info" role="alert"><strong>Loading...</strong></div>
  );
}
Loading.propTypes = {
  isLoadingErr: PropTypes.bool.isRequired,
  isServersLoading: PropTypes.bool.isRequired,
  isAppsLoading: PropTypes.bool.isRequired
};
module.exports = Loading;
