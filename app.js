(function() {
  'use strict';
  var ADMIN_USER = 'larkintuckerllc';
  var ADMIN_REPO = 'ds-admin';
  var DS_SERVER_USER = 'larkintuckerllc';
  var DS_SERVER_REPO = 'ds-server';
  var THR0W_SERVER_USER = 'larkintuckerllc';
  var THR0W_SERVER_REPO = 'thr0w-server';
  var thr0w = window.thr0w;
  var ds = window.ds;
  var Octokat = window.Octokat;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    var base = window.location.protocol + '//' +
      window.location.hostname;
    thr0w.setBase(base);
    ds.setBase(base);
    if (window.localStorage.getItem('logout')) {
      window.localStorage.removeItem('logout');
      thr0w.logout();
    }
    thr0w.addLoginTools(document.body, handleThr0wLogin);
    function handleThr0wLogin() {
      var thr0wToken = thr0w.getToken();
      ds.loginToken(thr0wToken, handleLoginToken);
      function handleLoginToken(loginTokenErr) {
        if (loginTokenErr !== null) {
          return ds.addAdminTools(document.body, handleDsLogin);
        }
        handleDsLogin();
        function handleDsLogin() {
          var _apps;
          var app;
          var i;
          var octo = new Octokat();
          var authorizedFailEl = document
            .getElementById('authorized__fail');
          var authorizedServerOutOfDateEl = document
            .getElementById('authorized__server_out_of_date');
          var dsToken = ds.getToken();
          list(handleList);
          document.getElementById('authorized').style.display = 'block';
          document.getElementById('authorized__check')
            .addEventListener('click', handleAuthorizedCheck);
          document.getElementById('authorized__logout')
            .addEventListener('click', handleAuthorizedLogout);
          function handleList(listErr, apps) {
            if (listErr !== null) {
              throw 500;
            }
            var appEl;
            var appsEl = document.getElementById('authorized__apps');
            var html = '';
            _apps = apps;
            for (i = 0; i < _apps.length; i++) {
              app = _apps[i];
              appEl = document.createElement('li');
              appEl.classList.add('panel');
              appEl.classList.add('panel-default');
              html = [
                '<div class="panel-heading">',
                '<span class="badge pull-right">' + app.user + '</span>',
                '<h3 class="panel-title">' + app.repo + '</h3>',
                '</div>',
                '<div class="panel-body">',
                '<p>Version: ' + app.version + '</p>'
              ].join('\n');
              if (!(app.user === ADMIN_USER && app.repo === ADMIN_REPO)) {
                html += [
                  '<a href="/' + app.user + '-' + app.repo +
                    '/config/" target="_blank">Configure</a>',
                  '|',
                  '<a href="/' + app.user + '-' + app.repo +
                    '/control/" target="_blank">Control</a>',
                ].join('\n');
              }
              html += [
                '</div>'
              ].join('\n');
              appEl.innerHTML = html;
              appsEl.appendChild(appEl);
            }
          }
          function handleAuthorizedCheck() {
            getServerVersions(handleServerVersions);
            function handleServerVersions(serverVersionsErr,
              serverVersions) {
              if (serverVersionsErr !== null) {
                authorizedFailEl.style.display = 'block';
                return;
              }
              authorizedFailEl.style.display = 'none';
              octo.repos(DS_SERVER_USER, DS_SERVER_REPO)
                .releases.latest.fetch(handleDsLatestRelease);
              function handleDsLatestRelease(dsLatestReleaseErr,
                dsLatestRelease) {
                if (dsLatestReleaseErr !== null) {
                  authorizedFailEl.style.display = 'block';
                  return;
                }
                octo.repos(THR0W_SERVER_USER, THR0W_SERVER_REPO)
                  .releases.latest.fetch(handleThr0wLatestRelease);
                function handleThr0wLatestRelease(thr0wLatestReleaseErr,
                  thr0wLatestRelease) {
                  var i;
                  var app;
                  if (thr0wLatestReleaseErr !== null) {
                    authorizedFailEl.style.display = 'block';
                    return;
                  }
                  if (serverVersions.dsServerVersion !==
                    dsLatestRelease.tagName ||
                    serverVersions.thr0wServerVersion !==
                    thr0wLatestRelease.tagName) {
                    authorizedServerOutOfDateEl.style.display = 'block';
                    // TODO: IMPLEMENT MECH TO UPDATE SERVER
                    return;
                  }
                  // TODO CHECK EACH APP
                  for (i = 0; i < _apps.length; i++) {
                    app = _apps[i];
                    window.console.log(app);
                  }
                }
              }
            }
            function getServerVersions(callback) {
              var xmlhttp = new XMLHttpRequest();
              xmlhttp.open('POST', base + ':3010/api/server_versions', true);
              xmlhttp.setRequestHeader('Authorization',
                'bearer ' + dsToken);
              xmlhttp.setRequestHeader('Content-type',
                'application/json');
              xmlhttp.onreadystatechange = handleOnreadystatechange;
              xmlhttp.send(JSON.stringify({}));
              function handleOnreadystatechange() {
                if (xmlhttp.readyState !== 4) {
                  return;
                }
                if (xmlhttp.status !== 200) {
                  return callback(xmlhttp.status ? xmlhttp.status : 500);
                }
                try {
                  return callback(null, JSON.parse(xmlhttp.responseText));
                } catch (error) {
                  return callback(500);
                }
              }
            }
          }
          function handleAuthorizedLogout() {
            window.localStorage.setItem('logout', true);
            ds.logout();
          }
          function list(callback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', base + ':3010/api/list', true);
            xmlhttp.setRequestHeader('Authorization',
              'bearer ' + dsToken);
            xmlhttp.setRequestHeader('Content-type',
              'application/json');
            xmlhttp.onreadystatechange = handleOnreadystatechange;
            xmlhttp.send(JSON.stringify({}));
            function handleOnreadystatechange() {
              if (xmlhttp.readyState !== 4) {
                return;
              }
              if (xmlhttp.status !== 200) {
                return callback(xmlhttp.status ? xmlhttp.status : 500);
              }
              var apps;
              try {
                apps = JSON.parse(xmlhttp.responseText);
              } catch (error) {
                return callback(500);
              }
              // TODO: SORT ALPHA ON REPO
              return callback(null, apps);
            }
          }
        }
      }
    }
  }
})();
