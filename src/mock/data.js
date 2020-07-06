import Mock from 'mockjs'
if (process.env.NODE_ENV === 'development') {
  let num=Mock.Random.integer(3, 50)
  Mock.mock(/getPortrait/, {
    "code|1": [0,1],//状态码0 成功 其他失败
    msg: "服务器问题，请稍后再试",//返回的信息
    "prize|1":["一等奖","二等奖","三等奖","四等奖"],
    num:Mock.Random.integer(3, 50),//抽取几人
    total:200,//总共几人
    "data|200": [{
      "imgsrc|1": [Mock.Random.image('100x100','#d4a742'),Mock.Random.image('150x150','#8a71e6'),Mock.Random.image('120x120','#52b20b')],//头像地址
      name: "@name",//头像名称
    }]
  });
}
