var React = require('react');
var PropTypes = React.PropTypes;
function ServersOutOfDate(props) {
  if (!props.isServersChecked || props.isServersUpToDate) {
    return (
      <div></div>
    );
  }
  return (
    <div className="alert alert-warning" role="alert"><strong>Servers out of date...</strong></div>
  )
}
ServersOutOfDate.propTypes = {
  isServersChecked: PropTypes.bool.isRequired,
  isServersUpToDate: PropTypes.bool.isRequired
};
module.exports = ServersOutOfDate;
