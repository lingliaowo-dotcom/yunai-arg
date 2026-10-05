/**
 * 《热搜第三》全局状态引擎
 * 读取 localStorage.YA_state，在所有页面挂载时调用 applyEnding()
 * 结局：none | A | B | C
 */
(function() {
  var STATE_KEY = 'YA_state';
  var CHOICE_KEY = 'YA_choice';
  var TIMESTAMP_KEY = 'YA_choice_time';

  window.YA = window.YA || {};

  // 全局重置：任意页面 URL 带 ?reset=1 时清除结局状态
  try {
    if (location.search.indexOf('reset=1') > -1) {
      localStorage.removeItem(STATE_KEY);
      localStorage.removeItem(CHOICE_KEY);
      localStorage.removeItem(TIMESTAMP_KEY);
    }
  } catch(e) {}

  YA.getState = function() {
    try { return localStorage.getItem(STATE_KEY) || 'none'; } catch(e) { return 'none'; }
  };
  YA.getChoice = function() {
    try { return localStorage.getItem(CHOICE_KEY) || null; } catch(e) { return null; }
  };
  YA.getChoiceTime = function() {
    try { return localStorage.getItem(TIMESTAMP_KEY) || null; } catch(e) { return null; }
  };
  YA.setEnding = function(choice) {
    try {
      localStorage.setItem(STATE_KEY, 'ended');
      localStorage.setItem(CHOICE_KEY, choice);
      localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
    } catch(e) {}
  };
  YA.clearEnding = function() {
    try {
      localStorage.removeItem(STATE_KEY);
      localStorage.removeItem(CHOICE_KEY);
      localStorage.removeItem(TIMESTAMP_KEY);
    } catch(e) {}
  };

  YA.getEndingText = function() {
    var c = YA.getChoice();
    if (c === 'A') return { title: '全量公开', color: '#990000' };
    if (c === 'B') return { title: '剪辑公开', color: '#006600' };
    if (c === 'C') return { title: '放弃公开', color: '#666666' };
    return null;
  };

  // 供各页面调用的钩子函数
  YA.applyEnding = function(page) {
    var state = YA.getState();
    var choice = YA.getChoice();
    if (state !== 'ended' || !choice) return;

    // 全局：在导航栏插入「结局」徽章
    var nav = document.querySelector('table.nav');
    if (nav) {
      var badge = document.createElement('td');
      badge.style.background = '#FFF3E0';
      badge.innerHTML = '<a href="archive.html" style="color:#E65100;font-size:12px;">■ 结局已定</a>';
      nav.rows[0].appendChild(badge);
    }

    // 页面级处理
    if (page === 'index') applyIndex(choice);
    else if (page === 'yearbook') applyYearbook(choice);
    else if (page === 'alumni') applyAlumni(choice);
    else if (page === 'contact') applyContact(choice);
    else if (page === 'news') applyNews(choice);
    else if (page === 'locker') applyLocker(choice);
  };

  function replaceMarquee(text) {
    var m = document.querySelector('marquee');
    if (m) m.textContent = text;
  }

  function applyIndex(choice) {
    if (choice === 'A') {
      replaceMarquee('【通报】我校原教师陈某已被依法采取刑事强制措施，详情请见新闻中心　＊　我校将全力配合调查，切实保障学生权益　＊　校友录系统无限期关闭');
      addNewsBox('A', '我校原教师陈某被采取刑事强制措施', '学校已成立专项工作组配合调查，即日起对全体教职工开展师德师风整顿。校友录系统因数据安全原因无限期关闭。');
    } else if (choice === 'B') {
      replaceMarquee('【通报】我校原教师陈某已被依法采取刑事强制措施，详情请见新闻中心　＊　学校将全面整顿师德师风，守护每一个孩子　＊　校友录系统维护中，敬请期待');
      addNewsBox('B', '我校原教师陈某被采取刑事强制措施', '学校将全力配合司法机关，并立即启动全校师德师风专项整顿。对历史遗留问题，学校承诺一查到底，绝不姑息。');
    } else if (choice === 'C') {
      replaceMarquee('谢谢你们来过。');
      addNewsBox('C', null, null); // 不插入新闻，只留字幕
    }
  }

  function applyNews(choice) {
    if (choice === 'A' || choice === 'B') {
      var wrap = document.querySelector('.content');
      if (!wrap) return;
      var box = document.createElement('div');
      box.style.cssText = 'background:#FFF1F0;border:1px solid #CF1322;padding:14px;margin-bottom:20px;';
      box.innerHTML = '<h3 style="color:#CF1322;margin-top:0;">【最新通报】我校原教师陈某被依法采取刑事强制措施</h3>' +
        '<p style="text-indent:2em;">2026年10月15日，雾港警方通报：云爱小学原教师陈某因涉嫌虐待被监护、看护人罪，已被依法采取刑事强制措施。案件正在进一步侦办中。</p>' +
        '<p style="text-indent:2em;">我校对此高度重视，已成立专项工作组，全力配合调查，并即日起对全体教职工开展师德师风专项整顿。对历史遗留问题，学校承诺一查到底，绝不姑息。</p>';
      wrap.insertBefore(box, wrap.children[1] || null);
    }
  }

  function applyYearbook(choice) {
    // 34 号行变成林满
    var rows = document.querySelectorAll('.list-table tr');
    if (rows.length >= 35) {
      var row = rows[34]; // 0=表头, 1-35=数据, 34=index34 -> 第34号
      var cells = row.querySelectorAll('td');
      if (cells.length >= 3) {
        cells[1].className = '';
        cells[1].innerHTML = '林满';
        cells[2].className = '';
        cells[2].innerHTML = '男';
      }
    }
    // 合影：刮花位置变成高亮框
    var svg = document.querySelector('.photo-box svg');
    if (svg) {
      var rects = svg.querySelectorAll('rect[fill="#999999"]');
      if (rects.length > 0) {
        var r = rects[0];
        r.setAttribute('fill', '#FFD700');
        r.setAttribute('stroke', '#E65100');
        r.setAttribute('stroke-width', '3');
      }
    }
    // 底部提示
    var note = document.querySelector('.note');
    if (note) {
      var div = document.createElement('div');
      div.style.cssText = 'margin-top:12px;padding:10px;background:#FFF8DC;border:1px solid #CC6600;font-size:13px;';
      if (choice === 'A') {
        div.innerHTML = '<b style="color:#990000;">档案已解封：</b>根据司法机关要求，本页信息已更正。2004年10月14日，该校一名三年级学生因故失踪，相关情况已移交公安机关。';
      } else if (choice === 'B') {
        div.innerHTML = '<b style="color:#006600;">档案已补全：</b>第34号学生林满，男，2004年10月14日失踪。2026年，本人主动联系学校要求恢复档案。';
      } else {
        div.innerHTML = '<b style="color:#666;">档案保持原样：</b>第34号学生信息待补录。';
      }
      note.parentNode.insertBefore(div, note.nextSibling);
    }
  }

  function applyAlumni(choice) {
    var code = document.querySelector('.code');
    var msg = document.querySelector('.msg');
    var login = document.querySelector('.login-box');
    if (choice === 'A') {
      if (code) code.textContent = 'CLOSED';
      if (msg) msg.innerHTML = '校友录系统已永久关闭。<br>感谢您的访问。';
      if (login) login.style.display = 'none';
    } else if (choice === 'B') {
      if (code) code.textContent = 'RESTORED';
      if (msg) msg.innerHTML = '校友录系统数据恢复完成。<br>2004届三年二班档案已补录。';
      if (login) login.style.display = 'none';
      // 把 数据缺失 改成 已补录
      var rows = document.querySelectorAll('table.classlist tr');
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].textContent.indexOf('2004届') > -1 && rows[i].textContent.indexOf('三年二班') > -1) {
          var tds = rows[i].querySelectorAll('td');
          if (tds.length >= 5) {
            tds[4].className = '';
            tds[4].style.color = '#006600';
            tds[4].style.fontWeight = 'bold';
            tds[4].textContent = '已补录';
          }
        }
      }
    } else {
      if (code) code.textContent = '404';
      if (msg) msg.innerHTML = '校友录系统维护中，暂时无法访问。<br>给您带来不便，敬请谅解。';
    }
  }

  function applyContact(choice) {
    var btn = document.getElementById('dialBtn');
    var st = document.getElementById('status');
    if (!btn) return;
    if (choice === 'A' || choice === 'B') {
      btn.textContent = '📞 器材室已停用';
      btn.disabled = true;
      btn.style.background = '#666';
      btn.style.border = '2px outset #999';
      if (st) st.textContent = '该分机已于 2026 年 10 月 15 日注销。';
    } else {
      btn.textContent = '📞 拨通器材室';
      btn.disabled = false;
      if (st) st.textContent = '';
    }
  }

  function applyLocker(choice) {
    var r = document.getElementById('result');
    var link = document.getElementById('link');
    if (!r) return;
    if (choice === 'A') {
      r.className = 'result fail';
      r.textContent = '该房间已被司法机关查封，密码锁已拆除。';
      if (link) link.style.display = 'none';
      var input = document.getElementById('pwd');
      if (input) input.disabled = true;
    } else if (choice === 'B') {
      r.className = 'result ok';
      r.textContent = '房间已清空。储物柜里只剩一个空塑料袋。';
      if (link) link.style.display = 'none';
    } else {
      r.className = 'result fail';
      r.textContent = '锁纹丝不动。';
    }
  }

  // 首页新闻插入
  function addNewsBox(choice, title, body) {
    var ul = document.querySelector('.content ul');
    if (!ul || !title) return;
    var li = document.createElement('li');
    li.innerHTML = '<a href="news.html" style="color:#CF1322;font-weight:bold;">【' + (choice==='A'?'通报':'通报') + '】' + title + '</a>';
    ul.insertBefore(li, ul.firstChild);
  }

  // 夜间模式：20:00-22:00 之间，页面右下角浮现 YA-0347 的低语
  YA.nightMode = function() {
    try {
      var h = new Date().getHours();
      if (h < 20 || h >= 22) return;
      var texts = [
        '夜。灯还亮着。——YA-0347',
        '器材室的锁，晚上会自己响。',
        '第三块砖下面，有东西。',
        '你们找到我了吗？'
      ];
      setTimeout(function() {
        var box = document.createElement('div');
        box.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9999;' +
          'background:rgba(0,0,0,0.75);color:#4ECCA3;font-size:12px;' +
          'font-family:"宋体",serif;padding:8px 12px;border:1px solid #4ECCA3;' +
          'opacity:0;transition:opacity 2s;';
        box.textContent = texts[Math.floor(Math.random() * texts.length)];
        document.body.appendChild(box);
        setTimeout(function() { box.style.opacity = '0.85'; }, 50);
      }, 5000);
    } catch(e) {}
  };

  // 自动执行（页面需在 body 末尾调用 YA.applyEnding('页面名')）
  YA.nightMode();
})();
