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
          var checkEl = document.getElementById('check');
          var installEl = document.getElementById('install');
          var failEl = document.getElementById('fail');
          var serverOutOfDateEl = document.getElementById('server_out_of_date');
          var dsToken = ds.getToken();
          document.getElementById('authorized').style.display = 'block';
          document.getElementById('check__btn')
            .addEventListener('click', handleCheckClick);
          document.getElementById('logout')
            .addEventListener('click', handleLogoutClick);
          document.getElementById('install__form__btn')
            .addEventListener('click', handleInstallFormBtnClick);
          getStartup(handleGetStartup);
          function handleGetStartup(getStartupErr, startupUrl) {
            if (getStartupErr) {
              throw 500;
            }
            listApps(handleListApps);
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
                    app.version + '</span></p>'
                ].join('\n');
                if (!(app.user === ADMIN_USER && app.repo === ADMIN_REPO)) {
                  if ((app.user + '-' + app.repo + '/') === startupUrl) {
                    html += [
                      '<p>',
                      '<a href="/' + app.user + '-' + app.repo +
                        '/restart/" target="_blank">Restart</a>',
                      '|',
                      '<a href="/' + app.user + '-' + app.repo +
                        '/config/" target="_blank">Configure</a>',
                      '|',
                      '<a href="/' + app.user + '-' + app.repo +
                        '/control/" target="_blank">Control</a>',
                      '</p>'
                    ].join('\n');
                  } else {
                    html += [
                      '<div class="form-group">',
                      '<button id="apps__' +
                        app.user + '-' + app.repo +
                      '__current__activate" class="btn btn-default" ' +
                      'data-user="' + app.user +
                      '" data-repo="' + app.repo + '">' +
                      'Activate</button>',
                      '</div>'
                    ].join('\n');
                  }
                }
                html += [
                  '<div id="apps__' + app.user + '-' +
                    app.repo +
                    '__current__out_of_date" style="display: none;">',
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
                    app.user + '-' + app.repo +
                    '__progress" class="progress" ' +
                    'style="display: none;">',
                  '<div class="progress-bar progress-bar-striped active"',
                  'role="progressbar" style="width: 100%"></div>',
                  '</div>',
                  '</div>'
                ].join('\n');
                appEl.innerHTML = html;
                appsEl.appendChild(appEl);
                document.getElementById('apps__' +
                  app.user + '-' + app.repo +
                  '__current__out_of_date__btn')
                  .addEventListener('click', handleAppCurrentOutOfDateClick);
                if (!(app.user === ADMIN_USER && app.repo === ADMIN_REPO) &&
                  (app.user + '-' + app.repo + '/') !== startupUrl) {
                  document.getElementById('apps__' +
                    app.user + '-' + app.repo +
                    '__current__activate')
                    .addEventListener('click', handleAppCurrentActivateClick);
                }
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
                      (appUpdateListAppsErr, updateApps) {
                      if (appUpdateListAppsErr !== null) {
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
                      if (user === ADMIN_USER && repo === ADMIN_REPO) {
                        window.location.reload();
                      }
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
              function handleAppCurrentActivateClick() {
                var user;
                var repo;
                /* jshint ignore:start */
                user = this.dataset.user;
                repo = this.dataset.repo;
                /* jshint ignore:end */
                setStartup(user + '-' + repo + '/', handleSetStartup);
                function handleSetStartup(setStartupErr) {
                  if (setStartupErr !== null) {
                    throw 500;
                  }
                  window.location.reload();
                }
              }
            }
          }
          function handleCheckClick() {
            var i;
            var appsLength = apps.length;
            var appsChecked = 0;
            var appCheckedErr = null;
            var appsOutOfDate = {};
            var progressEl = document.getElementById(
              'progress');
            checkEl.style.display = 'none';
            progressEl.style.display = 'block';
            checkServerVersion(handleCheckServerVersion);
            function handleCheckServerVersion(checkServerVersionErr,
              serverOutOfDate) {
              if (checkServerVersionErr !== null) {
                displayErr();
                return;
              }
              failEl.style.display = 'none';
              if (serverOutOfDate) {
                // TODO: IMPLEMENT MECH TO UDATE SERVER
                installEl.style.display = 'none';
                progressEl.style.display = 'none';
                serverOutOfDateEl.style.display = 'block';
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
                  var upToDate = true;
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
                        upToDate = false;
                        document.getElementById(
                          'apps__' + appUserRepo +
                          '__current__out_of_date').style.display = 'block';
                      }
                    }
                    if (upToDate) {
                      document.getElementById('up_to_date')
                        .style.display = 'block';
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
          }
          function handleInstallFormBtnClick() {
            var installFormEl = document.getElementById(
              'install__form');
            var installProgressEl = document.getElementById(
              'install__progress');
            var installFormFailEl = document.getElementById(
              'install__form__fail');
            var installFormUserEl = document.getElementById(
              'install__form__user');
            var installFormRepoEl = document.getElementById(
              'install__form__repo');
            var user;
            var repo;
            user = installFormUserEl.value;
            repo = installFormRepoEl.value;
            installFormEl.style.display = 'none';
            installProgressEl.style.display = 'block';
            checkServerVersion(handleCheckServerVersion);
            function handleCheckServerVersion(checkServerVersionErr,
              serverOutOfDate) {
              if (checkServerVersionErr !== null) {
                displayErr();
                return;
              }
              installFormFailEl.style.display = 'none';
              if (serverOutOfDate) {
                installProgressEl.style.display = 'none';
                installEl.style.display = 'none';
                checkEl.style.display = 'none';
                installFormEl.style.display = 'block';
                serverOutOfDateEl.style.display = 'block';
                return;
              }
              install(user, repo, handleInstall);
              function handleInstall(installErr) {
                if (installErr !== null) {
                  displayErr();
                  return;
                }
                var progressCount = 0;
                var installProgressInterval =
                  window.setInterval(installProgress, 1000);
                function installProgress() {
                  progressCount++;
                  if (progressCount === 20) {
                    window.clearInterval(installProgressInterval);
                    displayErr();
                    return;
                  }
                  listApps(handleInstallListApps);
                  function handleInstallListApps
                    (installListAppsErr, installApps) {
                    if (installListAppsErr !== null) {
                      window.clearInterval(installProgressInterval);
                      displayErr();
                      return;
                    }
                    var index = _.findIndex(installApps, isRepo);
                    if (index === -1) {
                      window.clearInterval(installProgressInterval);
                      displayErr();
                      return;
                    }
                    if (installApps[index].version === 'failed') {
                      window.clearInterval(installProgressInterval);
                      displayErr();
                      return;
                    }
                    if (installApps[index].version === 'installing') {
                      return;
                    }
                    window.clearInterval(installProgressInterval);
                    window.location.reload();
                    function isRepo(obj) {
                      return obj.user === user && obj.repo === repo;
                    }
                  }
                }
              }
            }
            function displayErr() {
              installProgressEl.style.display = 'none';
              installFormFailEl.style.display = 'block';
              installFormEl.style.display = 'block';
            }
          }
          function handleLogoutClick() {
            window.localStorage.setItem('logout', true);
            ds.logout();
          }
          function getStartup(callback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', base + ':3010/api/startup', true);
            xmlhttp.setRequestHeader('Authorization',
              'bearer ' + dsToken);
            xmlhttp.onreadystatechange = handleOnreadystatechange;
            xmlhttp.send();
            function handleOnreadystatechange() {
              if (xmlhttp.readyState !== 4) {
                return;
              }
              if (xmlhttp.status !== 200) {
                return callback(xmlhttp.status ? xmlhttp.status : 500);
              }
              var startupUrl;
              try {
                startupUrl = JSON.parse(xmlhttp.responseText).startup;
              } catch (error) {
                return callback(500);
              }
              return callback(null, startupUrl);
            }
          }
          function setStartup(startupUrl, callback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', base + ':3010/api/startup', true);
            xmlhttp.setRequestHeader('Authorization',
              'bearer ' + dsToken);
            xmlhttp.setRequestHeader('Content-type',
              'application/json');
            xmlhttp.onreadystatechange = handleOnreadystatechange;
            xmlhttp.send(JSON.stringify({
              startup: startupUrl}));
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
              apps = _.sortBy(apps, byRepo);
              return callback(null, apps);
              function byRepo(o) {
                return o.repo;
              }
            }
          }
          function checkServerVersion(callback) {
            getServerVersions(handleServerVersions);
            function handleServerVersions(serverVersionsErr,
              serverVersions) {
              if (serverVersionsErr !== null) {
                return callback(500);
              }
              octo.repos(DS_SERVER_USER, DS_SERVER_REPO)
                .releases.latest.fetch(handleDsLatestRelease);
              function handleDsLatestRelease(dsLatestReleaseErr,
                dsLatestRelease) {
                if (dsLatestReleaseErr !== null) {
                  return callback(500);
                }
                octo.repos(THR0W_SERVER_USER, THR0W_SERVER_REPO)
                  .releases.latest.fetch(handleThr0wLatestRelease);
                function handleThr0wLatestRelease(thr0wLatestReleaseErr,
                  thr0wLatestRelease) {
                  if (thr0wLatestReleaseErr !== null) {
                    return callback(500);
                  }
                  callback(null,
                    (serverVersions.dsServerVersion !==
                    dsLatestRelease.tagName ||
                    serverVersions.thr0wServerVersion !==
                    thr0wLatestRelease.tagName));
                }
              }
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
          function install(user, repo, callback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', base + ':3010/api/install', true);
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
      }
    }
  }
})();
