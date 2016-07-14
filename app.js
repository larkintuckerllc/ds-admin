(function() {
  'use strict';
  var ADMIN_USER = 'larkintuckerllc';
  var ADMIN_REPO = 'ds-admin';
  var thr0w = window.thr0w;
  var ds = window.ds;
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
          var dsToken = ds.getToken();
          list(handleList);
          document.getElementById('authorized').style.display = 'block';
          document.getElementById('authorized__logout')
            .addEventListener('click', handleAuthorizedLogout);
          function handleList(listErr, apps) {
            if (listErr !== null) {
              throw 500;
            }
            var i;
            var app;
            var appEl;
            var appsEl = document.getElementById('authorized__apps');
            var html = '';
            for (i = 0; i < apps.length; i++) {
              app = apps[i];
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
