var React = require('react');
var PropTypes = React.PropTypes;
function Logout(props) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xs-12">
          <button type="button" className="btn btn-default" onClick={props.onLogout}>Logout</button>
        </div>
      </div>
    </div>
  )
}
Logout.propTypes = {
  onLogout: PropTypes.func.isRequired
};
module.exports = Logout;
