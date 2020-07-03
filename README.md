# Galaxy-Jeep 前端代码库

## Team members
* 作者：耶子

## Build Setup
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build


```

## Tech Stack
* jquery

## Notes
* 本项目开发分支是master分支

## 参数说明
1. 获取头像接口get

 ```
    {code: 0,//int状态码0 成功 其他失败
    msg: "服务器问题，请稍后再试",//返回的信息
    prize:"一等奖",//string奖项
    num:5,//int抽取几人
    total:200,//int总共几人
    data: [{
      "imgsrc|1": "https://***",//Array头像地址
      name: "@name"//头像名称
    }]
    }   
 ```

 2. 发送中奖结果post

 ```
    {
    prize:"一等奖", //看后端需要哪些可补充
    data: [{
     "imgsrc|1": "https://***",//头像地址
      name: "@name"//头像名称
    }]
    }   
 ```





