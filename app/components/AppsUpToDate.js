var React = require('react');
var PropTypes = React.PropTypes;
function AppsUpToDate(props) {
  if (!props.isAppsChecked || !props.isAppsUpToDate) {
    return (
      <div></div>
    );
  }
  return (
    <div className="alert alert-success" role="alert"><strong>Apps up to date...</strong></div>
  )
}
AppsUpToDate.propTypes = {
  isAppsChecked: PropTypes.bool.isRequired,
  isAppsUpToDate: PropTypes.bool.isRequired
};
module.exports = AppsUpToDate;
