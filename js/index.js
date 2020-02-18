// 常量
const LEVEL_CHINA = 'china';
const LEVEL_PROVINCE = 'province';
const LEVEL_CITY = 'city';
const LEVEL_DISTRICT = 'district';

const $map = document.getElementById('map');
const $btn = document.getElementById('backBtn');

const eCharts = echarts.init($map);

let map = null;
let recordList = [];

// 加载json数据
function require(src) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('get', src, true);

        request.send(null);
        request.onload = function () {
            // if (request.status == 200) {
            resolve(JSON.parse(request.responseText));
            // } else {
            //     resolve();
            // }
        };
    });
}

// 初始化
function initMap() {
    eCharts.clear();
    eCharts.off('click');
    eCharts.resize();
}

// 现在加载loading tip
function showLoading(msg = '绘制中...') {
    eCharts.showLoading({
        text: msg,
        color: '#1E9FFF',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.8)'
    });
}

// 根据level获取地图
async function getMap(level, id) {
    switch (level) {
        case LEVEL_CHINA:
            map = await require('./map/china.json');
            break;
        case LEVEL_PROVINCE:
            map = await require(`./map/province/${id}_full.json`);
            break;
        case LEVEL_CITY:
            map = await require(`./map/city/${id}_full.json`);
            break;
        case LEVEL_DISTRICT:
            map = {
                type: 'FeatureCollection',
                features: map.features.filter(i => i.properties.adcode == id)
            };
            break;
    }
    const mapName = id ? `${level}-${id}` : level;
    const list = [];

    for (let i of map.features) {
        const name = i.properties.name;
        const id = i.properties.adcode;
        const level = i.properties.level;
        list.push({id, name, level});
    }
    // 注册地图
    echarts.registerMap(mapName, map);
    return {mapName, list};
}

// 获取 base config
function getMapSeriesConfig(options = {}) {
    return Object.assign({
        type: 'map',
        roam: true,
        zoom: 6,
        scaleLimit: {
            min: 1,
            max: 20
        },
        label: {
            show: true
        },
        itemStyle: {
            areaColor: '#EFF7FF',
            borderType: 'dotted',
            borderColor: '#96C2F1'
        }
    }, options);
}

// 根据 level 跳转至相应部分
function toLink(data) {
    switch (data.level) {
        case LEVEL_CHINA:
            createMap();
            $btn.setAttribute('style', 'display:none');
            break;
        case LEVEL_PROVINCE:
            createProvinceMap(data);
            $btn.setAttribute('style', 'display:block');
            break;
        case LEVEL_CITY:
            createCityMap(data);
            $btn.setAttribute('style', 'display:block');
            break;
        case LEVEL_DISTRICT:
            createAreaMap(data);
            $btn.setAttribute('style', 'display:block');
            break;
    }

}

// 返回上级
function back() {
    recordList.pop();
    const item = recordList.pop();
    toLink(Object.assign(item, {back: true}));
}

// 生成中国地图
async function createMap() {
    showLoading();
    initMap();
    // 获取地图
    const {list, mapName} = await getMap(LEVEL_CHINA);
    // 配置
    eCharts.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        series: [
            getMapSeriesConfig({
                center: [113.4668, 22.8076],
                map: mapName,
                data: list
            })
        ]
    });
    // 记录
    recordList.push({
        id: null,
        name: '',
        level: LEVEL_CHINA
    });
    eCharts.on('click', ({data}) => {
        toLink(data);
    });
    eCharts.hideLoading();
}

// 生成省级地图
async function createProvinceMap({id, name, level, back}) {
    showLoading(back ? '返回上一级，请稍等...' : '正在下钻，请稍等...');
    initMap();
    // 获取省地图
    const {list, mapName} = await getMap(LEVEL_PROVINCE, id);
    // 配置
    eCharts.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        title: {
            text: name,
            left: 'center',
            padding: 20
        },
        series: [
            getMapSeriesConfig({
                map: mapName,
                data: list,
                zoom: 1
            })
        ]
    });
    // 记录
    recordList.push({
        id,
        name,
        level
    });
    eCharts.on('click', ({data}) => {
        toLink(data);
    });
    eCharts.hideLoading();
}

// 生成市级地图
async function createCityMap({id, name, level, back}) {
    showLoading(back ? '返回上一级，请稍等...' : '正在下钻，请稍等...');
    initMap();
    // 获取地图
    const {list, mapName} = await getMap(LEVEL_CITY, id);
    eCharts.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        title: {
            text: name,
            left: 'center',
            padding: 20
        },
        series: [
            getMapSeriesConfig({
                map: mapName,
                data: list,
                zoom: 1
            })
        ]
    });
    recordList.push({
        id,
        name,
        level
    });
    eCharts.on('click', ({data}) => {
        toLink(data);
    });
    eCharts.hideLoading();
}

// 生成区级地图
async function createAreaMap({id, name, level}) {
    showLoading('正在下钻，请稍等...');
    initMap();
    const {list, mapName} = await getMap(LEVEL_DISTRICT, id);
    eCharts.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        title: {
            text: name,
            left: 'center',
            padding: 20
        },
        series: [
            getMapSeriesConfig({
                map: mapName,
                data: list,
                zoom: 1
            })
        ]
    });
    recordList.push({
        id,
        name,
        level
    });
    eCharts.hideLoading();
}

