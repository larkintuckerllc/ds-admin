var React = require('react');
var PropTypes = React.PropTypes;
function AppUpdating(props) {
  if (!props.isAppUpdating) {
    return (
      <div></div>
    );
  }
  return (
    <div>
      <p></p>
      <div className="progress">
        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"  style={{width: 100 + '%'}}></div>
      </div>
    </div>
  );
}
AppUpdating.propTypes = {
  isAppUpdating: PropTypes.bool.isRequired
};
module.exports = AppUpdating;
