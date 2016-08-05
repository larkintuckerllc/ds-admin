var React = require('react');
var PropTypes = React.PropTypes;
function App(props) {
  var appLinksEl = (props.type === 'user') ?
    <div>
      <a href={'/' + props.user + '-' + props.repo + '/dist/restart/'} target="_blank">Restart</a>
        &nbsp;|&nbsp;<a href={'/' + props.user + '-' + props.repo + '/dist/config/'} target="_blank">Configure</a>
        &nbsp;|&nbsp;<a href={'/' + props.user + '-' + props.repo + '/dist/control/'} target="_blank">Control</a>
    </div> :
    <div></div>;
  var appUpdatingEl = (props.isAppUpdating) ?
    <div>
      <p></p>
      <div className="progress">
        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"  style={{width: 100 + '%'}}></div>
      </div>
    </div> :
    <div></div>;
  var appUpdatingErrEl = (props.isAppUpdatingErr) ?
    <div>
      <p></p>
      <div className="alert alert-danger" role="alert"><strong>Failed to update.</strong></div>
    </div> :
    <div></div>;
  var appUpdatedEl = (props.isAppUpdated) ?
    <div>
      <p></p>
      <div className="alert alert-success" role="alert"><strong>App updated.</strong></div>
    </div> :
    <div></div>;
  var appOutOfDateEl = (props.isAppChecked && !props.isAppUpToDate
    && !props.isAppUpdating && !props.isAppUpdated) ?
    <div>
      <p></p>
      <div className="alert alert-warning" role="alert"><strong>App out of date...</strong></div>
      <div className="form-group">
        <button type="button" className="btn btn-default" onClick={props.onUpdate}>Update</button>
      </div>
    </div> :
    <div></div>;
  return(
    <li className="list-group-item">
      <span className="badge">{props.updatedVersion}</span>
      <div><strong>{props.repo}</strong> ({props.user})</div>
      {appLinksEl}
      {appUpdatingEl}
      {appUpdatingErrEl}
      {appUpdatedEl}
      {appOutOfDateEl}
    </li>
  );
}
App.propTypes = {
  type: PropTypes.string.isRequired,
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
