var React = require('react');
var PropTypes = React.PropTypes;
function AppsOutOfDate(props) {
  if (!props.isAppsChecked || props.isAppsUpToDate) {
    return (
      <div></div>
    );
  }
  return (
    <div className="alert alert-warning" role="alert"><strong>Apps out of date...</strong></div>
  )
}
AppsOutOfDate.propTypes = {
  isAppsChecked: PropTypes.bool.isRequired,
  isAppsUpToDate: PropTypes.bool.isRequired
};
module.exports = AppsOutOfDate;
