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
          var failEl = document
            .getElementById('fail');
          var serverOutOfDateEl = document
            .getElementById('server_out_of_date');
          var dsToken = ds.getToken();
          listApps(handleListApps);
          document.getElementById('authorized').style.display = 'block';
          document.getElementById('check__btn')
            .addEventListener('click', handleAuthorizedCheckClick);
          document.getElementById('logout')
            .addEventListener('click', handleAuthorizedLogoutClick);
          function handleListApps(listErr, list) {
            if (listErr !== null) {
              throw 500;
            }
            var appEl;
            var appsEl = document.getElementById('apps');
            var html = '';
            apps = list;
            for (i = 0; i < apps.length; i++) {
              app = apps[i];
              appEl = document.createElement('li');
              appEl.classList.add('panel');
              appEl.classList.add('panel-default');
              html = [
                '<div id="apps__' + app.user + '-' + app.repo +
                  '" class="panel-heading">',
                '<span class="badge pull-right">' + app.user + '</span>',
                '<h3 class="panel-title">' + app.repo + '</h3>',
                '</div>',
                '<div class="panel-body">',
                '<div id="apps__' +
                  app.user + '-' + app.repo + '__current">',
                '<p>Version: <span id="apps__' +
                  app.user + '-' + app.repo + '__current__version">' +
                  app.version + '</span></p>',
                '<div id="apps__' + app.user + '-' +
                  app.repo + '__current__out_of_date" style="display: none;">',
                '<div class="alert alert-warning" role="alert">' +
                  'App out of date.</div>',
                '<div id="apps__' + app.user + '-' +
                  app.repo +
                  '__current__out_of_date__fail" style="display: none;" ' +
                  'class="alert alert-danger" role="alert" ',
                  '>Update failed.</div>',
                '<div class="form-group">',
                '<button id="apps__' +
                  app.user + '-' + app.repo +
                  '__current__out_of_date__btn" class="btn btn-default" ' +
                  'data-user="' + app.user +
                  '" data-repo="' + app.repo + '">' +
                  'Update</button>',
                '</div>',
                '</div>',
                '</div>',
                '<div id="apps__' +
                  app.user + '-' + app.repo + '__progress" class="progress" ' +
                  'style="display: none;">',
                '<div class="progress-bar progress-bar-striped active"',
                'role="progressbar" style="width: 100%"></div>',
                '</div>',
                '</div>',
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
              document.getElementById('apps__' +
                app.user + '-' + app.repo +
                '__current__out_of_date__btn')
                .addEventListener('click', handleAppCurrentOutOfDateClick);
            }
            function handleAppCurrentOutOfDateClick() {
              var user;
              var repo;
              /* jshint ignore:start */
              user = this.dataset.user;
              repo = this.dataset.repo;
              /* jshint ignore:end */
              var appsAppCurrentEl =
                document.getElementById('apps__' +
                user + '-' +
                repo + '__current');
              var appsAppProgressEl =
                document.getElementById('apps__' +
                user + '-' +
                repo + '__progress');
              appsAppCurrentEl.style.display =
                'none';
              appsAppProgressEl.style.display =
                'block';
              update(user, repo, handleAppUpdate);
              function handleAppUpdate(appUpdateErr) {
                if (appUpdateErr !== null) {
                  displayAppUpdateErr();
                  return;
                }
                var progressCount = 0;
                var updateProgressInterval =
                  window.setInterval(updateProgress, 1000);
                function updateProgress() {
                  progressCount++;
                  if (progressCount === 20) {
                    window.clearInterval(updateProgressInterval);
                    displayAppUpdateErr();
                    return;
                  }
                  listApps(handleAppUpdateListApps);
                  function handleAppUpdateListApps
                    (appUpdateListErr, updateApps) {
                    if (appUpdateListErr !== null) {
                      window.clearInterval(updateProgressInterval);
                      displayAppUpdateErr();
                      return;
                    }
                    var index = _.findIndex(updateApps, isRepo);
                    if (index === -1) {
                      window.clearInterval(updateProgressInterval);
                      displayAppUpdateErr();
                      return;
                    }
                    if (updateApps[index].version === 'failed') {
                      window.clearInterval(updateProgressInterval);
                      displayAppUpdateErr();
                      return;
                    }
                    if (updateApps[index].version === 'installing') {
                      return;
                    }
                    window.clearInterval(updateProgressInterval);
                    document.getElementById(
                      'apps__' + user + '-' + repo +
                      '__current__out_of_date').style.display = 'none';
                    document.getElementById(
                      'apps__' + user + '-' + repo +
                      '__current__version').innerHTML =
                      updateApps[index].version;
                    appsAppProgressEl.style.display =
                      'none';
                    appsAppCurrentEl.style.display =
                      'block';
                    function isRepo(obj) {
                      return obj.user === user && obj.repo === repo;
                    }
                  }
                }
              }
              function displayAppUpdateErr() {
                appsAppProgressEl.style.display =
                  'none';
                document.getElementById('apps__' +
                  user + '-' +
                  repo + '__current__out_of_date__fail').
                  style.display = 'block';
                appsAppCurrentEl.style.display =
                  'block';
              }
            }
          }
          function handleAuthorizedCheckClick() {
            var checkEl = document.getElementById(
              'check');
            var progressEl = document.getElementById(
              'progress');
            checkEl.style.display = 'none';
            progressEl.style.display = 'block';
            getServerVersions(handleServerVersions);
            function handleServerVersions(serverVersionsErr,
              serverVersions) {
              if (serverVersionsErr !== null) {
                displayErr();
                return;
              }
              failEl.style.display = 'none';
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
                    serverOutOfDateEl.style.display = 'block';
                    progressEl.style.display = 'none';
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
                        progressEl.style.display = 'none';
                        for (j = 0; j < apps.length; j++) {
                          appUserRepo = apps[j].user + '-' + apps[j].repo;
                          if (appsOutOfDate[appUserRepo]) {
                            document.getElementById(
                              'apps__' + appUserRepo +
                              '__current__out_of_date').style.display = 'block';
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            function displayErr() {
              failEl.style.display = 'block';
              progressEl.style.display = 'none';
              checkEl.style.display = 'block';
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
