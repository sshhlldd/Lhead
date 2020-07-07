import 'animate.css';
import "../scss/common.scss";
import * as BASE from './base.js';
(function (designWidth, maxWidth) {
  var doc = document,
    win = window,
    docEl = doc.documentElement,
    remStyle = document.createElement("style"),
    tid;

  function refreshRem() {
    var width = docEl.getBoundingClientRect().width;
    maxWidth = maxWidth || 540;
    width > maxWidth && (width = maxWidth);
    var rem = width * 100 / designWidth;
    remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
  }

  if (docEl.firstElementChild) {
    docEl.firstElementChild.appendChild(remStyle);
  } else {
    var wrap = doc.createElement("div");
    wrap.appendChild(remStyle);
    doc.write(wrap.innerHTML);
    wrap = null;
  }
  //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
  refreshRem();

  win.addEventListener("resize", function () {
    clearTimeout(tid); //防止执行两次
    tid = setTimeout(refreshRem, 300);
  }, false);

  win.addEventListener("pageshow", function (e) {
    if (e.persisted) { // 浏览器后退的时候重新计算
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    }
  }, false);

  if (doc.readyState === "complete") {
    doc.body.style.fontSize = "16px";
  } else {
    doc.addEventListener("DOMContentLoaded", function (e) {
      doc.body.style.fontSize = "16px";
    }, false);
  }
})(1000, 900);
$(function () {
  //數組從後台獲取

  //图片预加载
  let preimgs = [require("../img/bg.jpg")];
  const ajaxURL = {
    getPortrait: "/Ent/index.php?a=EntLiveLottery&m=lotteryTestList",
    sendRes: "/Ent/index.php?a=EntLiveLottery&m=lotteryTestResult"
  }
  BASE.preloadimages(preimgs).done(function (images) {
    getData();
  });

  function mockData() {
    let imgArr = [require("../img/pic_01.png"), require("../img/pic_02.png"), require("../img/pic_03.png"), require("../img/pic_04.png")]
    let numArr = [5, 10, 50, 100];
    let totArr = [10, 70, 100, 200];
    let cArr = [0, 0, 0, 1];
    let pArr = ["一等奖", "二等奖", "三等奖", "四等奖"];
    let rn = Math.floor(Math.random() * 4);
    let opt = {
      code: cArr[rn], //状态码0 成功 其他失败
      msg: "服务器问题，请稍后再试", //返回的信息
      prize: pArr[rn],
      num: numArr[rn], //抽取几人
      total: totArr[rn], //总共几人
      data: [],
    }
    for (let i = 0; i < totArr[rn]; i++) {
      let n = Math.floor(Math.random() * 4);
      var obj = {
        name: `图片${i}`,
        imgsrc: imgArr[n]
      }
      opt.data.push(obj);
    }
    $('#loading').hide();
    if (opt.code == 0) {
      BASE.game(opt);

    } else {
      BASE.mypop(opt.msg);
    }

  }

  function getData() {
    $.ajax({
      url: ajaxURL.getPortrait,
      type: 'get',
      data: {
        group_id: $('#group_id').val(),
        live_id: $('#live_id').val(),
        match_con: $('#match_con').val(),
        is_more_award: $('#is_more_award').val()
      },
      async: false,
      success: function (res) {
        $('#loading').hide();
        res = JSON.parse(res);
        if (res.code == 0) {
          BASE.game({
            data: res.data,
            num: res.num,
            prize: res.prize,
            total: res.total,
            OverFunc: function (winArr) {
              let _params = {
                prize: res.prize,
                data: winArr,
                group_id: $('#group_id').val(),
                live_id: $('#live_id').val(),
                match_con: $('#match_con').val(),
                is_more_award: $('#is_more_award').val()
              }
              $.ajax({
                url: ajaxURL.sendRes,
                type: 'post',
                data: _params,
                async: false,
                success: function (res1) {
                  console.log(res1);
                }
              })
            },
          });

        } else {
          BASE.mypop(res.msg);
        }

      }
    })
  }
})