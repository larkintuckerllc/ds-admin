var React = require('react');
var PropTypes = React.PropTypes;
function App(props) {
  var appUpdatingEl = (props.isAppUpdating) ?
    <div>
      <p></p>
      <div className="progress">
        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"  style={{width: 100 + '%'}}></div>
      </div>
    </div> :
    null;
  var appUpdatingErrEl = (props.isAppUpdatingErr) ?
    <div>
      <p></p>
      <div className="alert alert-danger" role="alert"><strong>Failed to update.</strong></div>
    </div> :
    null;
  var appUpdatedEl = (props.isAppUpdated) ?
    <div>
      <p></p>
      <div className="alert alert-success" role="alert"><strong>App updated.</strong></div>
    </div> :
    null;
  var appOutOfDateEl = (props.isAppChecked && !props.isAppUpToDate
    && !props.isAppUpdating && !props.isAppUpdated) ?
    <div>
      <p></p>
      <div className="alert alert-warning" role="alert"><strong>App out of date...</strong></div>
      <div className="form-group">
        <button type="button" className="btn btn-default" onClick={props.onUpdate}>Update</button>
      </div>
    </div> :
    null;
  return(
    <div>
      <div>Version: {props.updatedVersion}</div>
      {appUpdatingEl}
      {appUpdatingErrEl}
      {appUpdatedEl}
      {appOutOfDateEl}
    </div>
  );
}
App.propTypes = {
  user: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  updatedVersion: PropTypes.string.isRequired,
  isAppChecked: PropTypes.bool.isRequired,
  isAppUpToDate: PropTypes.bool.isRequired,
  isAppUpdating: PropTypes.bool.isRequired,
  isAppUpdatingErr: PropTypes.bool.isRequired,
  isAppUpdated: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired
};
module.exports = App;
