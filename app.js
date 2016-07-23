(function() {
  'use strict';
  var ADMIN_USER = 'larkintuckerllc';
  var ADMIN_REPO = 'ds-admin';
  var DS_SERVER_USER = 'larkintuckerllc';
  var DS_SERVER_REPO = 'ds-server';
  var THR0W_SERVER_USER = 'larkintuckerllc';
  var THR0W_SERVER_REPO = 'thr0w-server';
  var _ = window._;
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
          var apps;
          var app;
          var i;
          var octo = new Octokat();
          var authorizedFailEl = document
            .getElementById('authorized__fail');
          var authorizedServerOutOfDateEl = document
            .getElementById('authorized__server_out_of_date');
          var dsToken = ds.getToken();
          listApps(handleListApps);
          document.getElementById('authorized').style.display = 'block';
          document.getElementById('authorized__check__btn')
            .addEventListener('click', handleAuthorizedCheckClick);
          document.getElementById('authorized__logout')
            .addEventListener('click', handleAuthorizedLogoutClick);
          function handleListApps(listErr, list) {
            if (listErr !== null) {
              throw 500;
            }
            var appEl;
            var appsEl = document.getElementById('authorized__apps');
            var html = '';
            apps = list;
            for (i = 0; i < apps.length; i++) {
              app = apps[i];
              appEl = document.createElement('li');
              appEl.classList.add('panel');
              appEl.classList.add('panel-default');
              html = [
                '<div id="authorized__apps__' + app.user + '-' + app.repo +
                  '" class="panel-heading">',
                '<span class="badge pull-right">' + app.user + '</span>',
                '<h3 class="panel-title">' + app.repo + '</h3>',
                '</div>',
                '<div class="panel-body">',
                '<p>Version: <span id="authorized__apps__' +
                  app.user + '-' + app.repo + '__version">' +
                  app.version + '</span></p>',
                '<div id="authorized__apps__' + app.user + '-' +
                  app.repo + '__out_of_date" style="display: none;">',
                '<div class="alert alert-warning" role="alert">' +
                  'App out of date.</div>',
                '<div id="authorized__apps__' + app.user + '-' +
                  app.repo + '__out_of_date__progress" ' +
                  'style="display: none;" class="progress">',
                '<div class="progress-bar progress-bar-striped active"',
                'role="progressbar"  style="width: 100%"></div>',
                '</div>',
                '<div class="form-group">',
                '<button id="authorized__apps__' +
                  app.user + '-' + app.repo +
                  '__out_of_date__btn" class="btn btn-default" ' +
                  'data-user="' + app.user +
                  '" data-repo="' + app.repo + '">' +
                  'Update</button>',
                '</div>',
                '</div>'
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
              document.getElementById('authorized__apps__' +
                app.user + '-' + app.repo +
                '__out_of_date__btn')
                .addEventListener('click', handleAppOutOfDateClick);
            }
            function handleAppOutOfDateClick() {
              var user;
              var repo;
              /* jshint ignore:start */
              user = this.dataset.user;
              repo = this.dataset.repo;
              this.style.display = 'none';
              /* jshint ignore:end */
              var authorizedAppsAppOutOfDateProgressEl =
                document.getElementById('authorized__apps__' +
                user + '-' +
                repo + '__out_of_date__progress');
              authorizedAppsAppOutOfDateProgressEl.style.display = 'block';
              update(user, repo, handleAppUpdate);
              function handleAppUpdate(appUpdateErr) {
                var progressCount = 0;
                var updateProgressInterval;
                if (appUpdateErr) {
                  // TODO: IMPLEMENT ERROR UI
                  restoreAppUI();
                  return;
                }
                updateProgressInterval =
                  window.setInterval(updateProgress, 1000);
                function updateProgress() {
                  progressCount++;
                  if (progressCount === 10) {
                    failed();
                    return;
                  }
                  listApps(handleAppUpdateListApps);
                }
                function failed() {
                  window.clearInterval(updateProgressInterval);
                  // TODO: IMPLMENT ERROR UI
                }
                function handleAppUpdateListApps(appUpdateListErr, updateApps) {
                  if (appUpdateListErr) {
                    // TODO: IMPLEMENT ERROR UI
                    restoreAppUI();
                    return;
                  }
                  var index = _.findIndex(updateApps, isRepo);
                  if (index === -1) {
                    // TODO: IMPLEMENT ERROR UI
                    restoreAppUI();
                    return;
                  }
                  window.clearInterval(updateProgressInterval);
                  restoreAppUI();
                  document.getElementById('authorized__apps__' +
                    user + '-' +
                    repo + '__version').innerHTML = updateApps[index].version;
                  function isRepo(obj) {
                    return obj.user === user && obj.repo === repo;
                  }
                }
                function restoreAppUI() {
                  document.getElementById('authorized__apps__' +
                    user + '-' +
                    repo + '__out_of_date').style.display = 'none';
                  authorizedAppsAppOutOfDateProgressEl.style.display = 'none';
                  document.getElementById('authorized__apps__' +
                    user + '-' +
                    repo + '__out_of_date__btn').style.display = 'block';
                }
              }
            }
          }
          function handleAuthorizedCheckClick() {
            var authorizedCheckEl = document.getElementById(
              'authorized__check');
            var authorizedProgressEl = document.getElementById(
              'authorized__progress');
            authorizedCheckEl.style.display = 'none';
            authorizedProgressEl.style.display = 'block';
            getServerVersions(handleServerVersions);
            function handleServerVersions(serverVersionsErr,
              serverVersions) {
              if (serverVersionsErr !== null) {
                displayErr();
                return;
              }
              authorizedFailEl.style.display = 'none';
              octo.repos(DS_SERVER_USER, DS_SERVER_REPO)
                .releases.latest.fetch(handleDsLatestRelease);
              function handleDsLatestRelease(dsLatestReleaseErr,
                dsLatestRelease) {
                if (dsLatestReleaseErr !== null) {
                  displayErr();
                  return;
                }
                octo.repos(THR0W_SERVER_USER, THR0W_SERVER_REPO)
                  .releases.latest.fetch(handleThr0wLatestRelease);
                function handleThr0wLatestRelease(thr0wLatestReleaseErr,
                  thr0wLatestRelease) {
                  var i;
                  var appsLength = apps.length;
                  var appsChecked = 0;
                  var appCheckedErr = null;
                  var appsOutOfDate = {};
                  if (thr0wLatestReleaseErr !== null) {
                    displayErr();
                    return;
                  }
                  if (serverVersions.dsServerVersion !==
                    dsLatestRelease.tagName ||
                    serverVersions.thr0wServerVersion !==
                    thr0wLatestRelease.tagName) {
                    authorizedServerOutOfDateEl.style.display = 'block';
                    authorizedProgressEl.style.display = 'none';
                    // TODO: IMPLEMENT MECH TO UPDATE SERVER
                    return;
                  }
                  for (i = 0; i < appsLength; i++) {
                    checkAppVersion(apps[i]);
                  }
                  function checkAppVersion(app) {
                    octo.repos(app.user, app.repo)
                      .releases.latest.fetch(handleAppLatestRelease);
                    function handleAppLatestRelease(appLatestReleaseErr,
                      appLatestRelease) {
                      var j;
                      var appUserRepo;
                      if (appLatestReleaseErr !== null) {
                        appCheckedErr = true;
                      }
                      appsOutOfDate[app.user + '-' + app.repo] =
                        (app.version !== appLatestRelease.tagName);
                      ++appsChecked;
                      if (appsChecked === appsLength) {
                        if (appCheckedErr !== null) {
                          displayErr();
                          return;
                        }
                        authorizedProgressEl.style.display = 'none';
                        for (j = 0; j < apps.length; j++) {
                          appUserRepo = apps[j].user + '-' + apps[j].repo;
                          // TODO: REVERSE LOGIC HERE
                          if (!appsOutOfDate[appUserRepo]) {
                            document.getElementById(
                              'authorized__apps__' + appUserRepo +
                              '__out_of_date').style.display = 'block';
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            function displayErr() {
              authorizedFailEl.style.display = 'block';
              authorizedProgressEl.style.display = 'none';
              authorizedCheckEl.style.display = 'block';
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
          function handleAuthorizedLogoutClick() {
            window.localStorage.setItem('logout', true);
            ds.logout();
          }
          function listApps(callback) {
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
          function update(user, repo, callback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', base + ':3010/api/update', true);
            xmlhttp.setRequestHeader('Authorization',
              'bearer ' + dsToken);
            xmlhttp.setRequestHeader('Content-type',
              'application/json');
            xmlhttp.onreadystatechange = handleOnreadystatechange;
            xmlhttp.send(JSON.stringify({
              user: user,
              repo: repo
            }));
            function handleOnreadystatechange() {
              if (xmlhttp.readyState !== 4) {
                return;
              }
              if (xmlhttp.status !== 200) {
                return callback(xmlhttp.status ? xmlhttp.status : 500);
              }
              return callback(null);
            }
          }
        }
      }
    }
  }
})();
