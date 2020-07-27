# echarts-map

#### 介绍
echarts-map，中国地图预览，支持下钻至 省-市-区

[在线预览](https://lecoler.gitee.io/echarts-map)

#### 运行环境

下列只需满足 1 或 2  即可运行访问

1. 需在本地搭建http服务，访问 index.html 
（可用 阿帕奇配置转发代理）
例如：http://localhost:8080/map/index.html

或

2. 简单快速方法 

   2.1.使用谷歌浏览器

   2.2.在谷歌浏览器的快捷方式 目标处添加参数启动

   2.3  -disable-web-security -user-data-dir="d:\Temp"

例如:
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -disable-web-security -user-data-dir="d:\Temp"

​	2.4.打开修改后的谷歌浏览器，再打开 index.html 
（即用带参数启动的谷歌浏览器访问index.html）


#### 方法api
##### 默认生成地图
```js
    // 生成中国地图
    createMap()
```
##### 生成省级地图
```js
    // 生成广东省地图
    createProvinceMap({
        id: '440000',
        name: '广东省',
        level: LEVEL_PROVINCE,
        back: false
    })
```

##### 生成市级地图
```js
    // 生成广州市地图
    createCityMap({
        id: '440100',
        name: '广州市',
        level: LEVEL_CITY,
        back: false
    })
```
##### 修改地图配置项
[配置项文档](https://echarts.apache.org/zh/option.html)  
**注意：需要在地图渲染完后方可修改**
```js
 setConfig({
            series: [
                {
                    itemStyle: {
                        areaColor: '#91a9fc',
                    }
                }
            ]
        })
```
地图渲染完成后修改地图区块颜色
```js
    createMap().then(() => {
        setConfig({
            series: [
                {
                    itemStyle: {
                        areaColor: '#91a9fc',
                    }
                }
            ]
        })
    })
```