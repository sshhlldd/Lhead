import PerfectScrollbar from 'perfect-scrollbar';
let activeTimer;
let perTimer;
let od=[];

const preloadimages = function (arr) {
  let newimages = [],
    loadedimages = 0
  let postaction = function () {} //此处增加了一个postaction函数
  arr = (typeof arr != "object") ? [arr] : arr

  function imageloadpost() {
    loadedimages++
    if (loadedimages == arr.length) {
      postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
    }
  }
  for (let i = 0; i < arr.length; i++) {
    newimages[i] = new Image()
    newimages[i].src = arr[i]
    newimages[i].onload = function () {
      imageloadpost()
    }
    newimages[i].onerror = function () {
      imageloadpost()
    }
  }
  return { //此处返回一个空白对象的done方法
    done: function (f) {
      postaction = f || postaction
    }
  }
}
const game=function(d){

  od=JSON.parse(JSON.stringify(d.data))
  let cw=parseInt($('.container').width())-30;//父元素的宽度
  let col=parseInt(cw/90);//横向最多放几个
  let row=parseInt(550/90);//纵向最多放几个
  let opts={
    dw:70,//img外面div的宽度和高度
    data:[],//头像信息
    total:d.total,
    prize:d.prize,
    num:d.num,
    per:col*row,//总共能放多少个
    OverFunc:d.OverFunc
  }
  // console.log(col);
  // console.log(row);
   if(d.total>=opts.per){
    opts.data=JSON.parse(JSON.stringify(d.data));
    opts.data=opts.data.slice(0,opts.per); 
    // console.log(opts.data);

   }else{
     opts.data=d.data;
     let di=parseInt(opts.per/3);//将每页最大显示数量划分3分
     if(d.total<di){
      opts.dw=100;
     }else if(d.total>=di&&d.total<=di*2){
      opts.dw=85;
     }else{
      opts.dw=70;
     }
   }
  
   temp(opts);
}
function temp(opts){
  let html='<div id="top-scroll" class="top"><ul>';
  opts.data.forEach((item,index)=>{
    html+='<li><div style="width:'+opts.dw+'px;height:'+opts.dw+'px"><img src="'+item.imgsrc+'" alt="'+item.name+'"></div></li>';
  })
            
  html+='</ul></div><div class="bottom">\
  <div class="left">獎項名稱：'+opts.prize+' 數量：'+opts.num+'人</div>\
  <div class="center"><button id="start" class="btn-main">開始抽獎</button></div>\
  <div class="right">可參與抽獎的人數為 '+opts.total+' 人</div>\
</div>'
$('.gamecon').html(html);
$('.gamecon').off('click','#start');
$('.gamecon').off('click','#end');
$('.gamecon').on('click','#start',function(){
  //$(this).attr('disabled',true);
  $(this).attr('id','end');
  $(this).text('抽獎結束');
  $(this).addClass('btn-rotate');
  activeTimer = setInterval(function(){ aTimer() }, 400);
  if(opts.total>opts.per){
    perTimer = setInterval(function(){ changePer(opts) }, 4000);   
  }

})

$('.gamecon').on('click','#end',function(){
  $(this).attr('disabled',true);
  $('.gamecon li').removeClass('active');
  clearInterval(activeTimer);
  clearInterval(perTimer);
  $(".gamecon .top").addClass('animate__animated animate__flipOutX');
  $(".gamecon .top").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
    $(this).empty().removeClass('animate__animated animate__flipOutX');
    win(opts);
})
  // $(".gamecon li").fadeOut(1000,function(){
  //   win(opts);
  // })
  //
})
}
function win(opts){
  $(".gamecon .top").unbind();//解绑One事件
  let data=JSON.parse(JSON.stringify(od));
  var newArr = [];
  for(let i=0;i<opts.num;i++){
      //随机数
      let n = Math.random()*data.length;
      n = Math.floor(n);
      //把找到数组素放入新数组中
      newArr.push(data[n]);
      //把选到的这个从数组中删除
      data.splice(n,1);
    }
   
    let html='<ul>';
    newArr.forEach((item,index)=>{
      html+='<li><div style="width:100px;height:100px"><img src="'+item.imgsrc+'" alt="'+item.name+'"></div>\
      <p class="name">'+item.name+'</p>\
      </li>';
    })
    html+='</ul>';    
    const ps = new PerfectScrollbar('#top-scroll', {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20
    });
   $('.gamecon .top').html(html);
   $(".gamecon .top").addClass('animate__animated animate__backInDown');
   opts.OverFunc(newArr);
}
function changePer(opts){ 
 let data=JSON.parse(JSON.stringify(od));
 let arr=shuffle(data);
 arr=arr.slice(0,opts.per); 
 let html='';
 arr.forEach((item,index)=>{
   html+='<li><div style="width:'+opts.dw+'px;height:'+opts.dw+'px"><img src="'+item.imgsrc+'" alt="'+item.name+'"></div></li>';
 })
           
$('.gamecon ul').html(html);

}
const mypop=function(html) {
  $('.ec_pop').remove();

  $('.ec_pop').off('click', '.close')
  var modalDiv = '<div class="ec_pop">\
          <div class="pop_box">\
          <div class="pop_body" style="">' + html + '</div>\
          </div></div>';
  $('body').append(modalDiv);
   if($(window).width()>=600){
              $('.pop_box').css({"width":"40%","left":"30%"})
          }
  $(".pop_box").addClass("animation-dialogue-in");
  setTimeout(function() {
    $(".ec_pop").fadeOut(function() {
        $(this).remove();
    });
}, 3000);
}
//随机算法
function shuffle(arr) { 
  var i = arr.length, t, j; 
  while (i) { 
    j = Math.floor(Math.random() * i--); //!!!
    t = arr[i]; 
    arr[i] = arr[j]; 
    arr[j] = t; 
  } 
  return arr;
} 
function aTimer() {
  let l=$('.gamecon li').length;
  let i=Math.floor(Math.random()*l)
  $('.gamecon li').removeClass('active');
  $('.gamecon li').eq(i).addClass('active');
}
export {
  preloadimages,
  game,
  mypop
}