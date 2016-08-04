var React = require('react');
var PropTypes = React.PropTypes;
function ServersUpToDate(props) {
  if (!props.isServersChecked || !props.isServersUpToDate) {
    return (
      <div></div>
    );
  }
  return (
    <div className="alert alert-success" role="alert"><strong>Servers up to date...</strong></div>
  )
}
ServersUpToDate.propTypes = {
  isServersChecked: PropTypes.bool.isRequired,
  isServersUpToDate: PropTypes.bool.isRequired
};
module.exports = ServersUpToDate;
