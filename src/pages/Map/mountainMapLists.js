const mountainMapLists = [
  {
    tag: '基隆市',
    category: {
      highMountain: [],
      trail: [
        { name: '忘憂谷步道', checked: false },
        { name: '姜子寮山步道', checked: false },
        { name: '大武崙山', checked: false },
      ],
    },
  },
  {
    tag: '新北市',
    category: {
      highMountain: [],
      trail: [
        { name: '硬漢嶺步道(觀音山)', checked: false },
        { name: '無耳茶壺山步道', checked: false },
        { name: '桃源谷步道', checked: false },
        { name: '孝子山步道', checked: false },
        { name: '南子吝登山步道', checked: false },
      ],
    },
  },
  {
    tag: '台北市',
    category: {
      highMountain: [],
      trail: [
        { name: '七星山步道', checked: false },
        { name: '劍潭山親山步道', checked: false },
        { name: '金面山步道', checked: false },
        { name: '四獸山步道', checked: false },
        { name: '軍艦岩步道', checked: false },
      ],
    },
  },
  {
    tag: '宜蘭縣',
    category: {
      highMountain: [{ name: '喀拉業山', checked: false }],
      trail: [
        { name: '抹茶山', checked: false },
        { name: '五峰旗步道', checked: false },
      ],
    },
  },
  {
    tag: '花蓮縣',
    category: {
      highMountain: [
        { name: '奇萊北峰', checked: false },
        { name: '馬博拉斯山', checked: false },
        { name: '中央尖山', checked: false },
      ],
      trail: [
        { name: '瓦拉米步道', checked: false },
        { name: '錐麓古道', checked: false },
      ],
    },
  },
  {
    tag: '台東縣',
    category: {
      highMountain: [
        { name: '關山', checked: false },
        { name: '向陽山', checked: false },
        { name: '塔關山', checked: false },
      ],
      trail: [
        { name: '鯉魚山步道', checked: false },
        { name: '都蘭山步道', checked: false },
      ],
    },
  },
  {
    tag: '屏東縣',
    category: {
      highMountain: [{ name: '北大武山', checked: false }],
      trail: [
        { name: '浸水營古道', checked: false },
        { name: '尾寮山步道', checked: false },
        { name: '阿塱壹古道', checked: false },
      ],
    },
  },
  {
    tag: '高雄市',
    category: {
      highMountain: [
        { name: '鹿山', checked: false },
        { name: '轆轆山', checked: false },
      ],
      trail: [
        { name: '柴山登山步道', checked: false },
        { name: '壽山國家自然公園', checked: false },
        { name: '崗山之眼', checked: false },
      ],
    },
  },
  {
    tag: '台南市',
    category: {
      highMountain: [],
      trail: [
        { name: '虎山林場', checked: false },
        { name: '台南大凍山', checked: false },
      ],
    },
  },
  {
    tag: '嘉義市',
    category: {
      highMountain: [],
      trail: [
        { name: '眠月線', checked: false },
        { name: '阿里山鄉迷糊步道', checked: false },
        { name: '特富野古道', checked: false },
        { name: '二尖山步道', checked: false },
        { name: '隙頂二延平步道觀雲平台', checked: false },
      ],
    },
  },
  {
    tag: '嘉義縣',
    category: {
      highMountain: [],
      trail: [
        { name: '眠月線', checked: false },
        { name: '阿里山鄉迷糊步道', checked: false },
        { name: '特富野古道', checked: false },
        { name: '二尖山步道', checked: false },
        { name: '隙頂二延平步道觀雲平台', checked: false },
      ],
    },
  },
  {
    tag: '雲林縣',
    category: {
      highMountain: [],
      trail: [
        { name: '龍過脈森林步道', checked: false },
        { name: '華山10-5號步道', checked: false },
      ],
    },
  },
  {
    tag: '南投縣',
    category: {
      highMountain: [
        { name: '玉山北峰', checked: false },
        { name: '郡大山', checked: false },
        { name: '奇萊主山', checked: false },
        { name: '合歡山北峰', checked: false },
      ],
      trail: [
        { name: '九九峰森林步道', checked: false },
        { name: '清境高空觀景步道', checked: false },
      ],
    },
  },
  {
    tag: '苗栗市',
    category: {
      highMountain: [
        { name: '大雪山', checked: false },
        { name: '頭鷹山', checked: false },
      ],
      trail: [
        { name: '墨硯山北峰', checked: false },
        { name: '挑炭古道｜三通嶺古道', checked: false },
      ],
    },
  },
  {
    tag: '苗栗縣',
    category: {
      highMountain: [
        { name: '大雪山', checked: false },
        { name: '頭鷹山', checked: false },
        { name: '伊澤山', checked: false },
      ],
      trail: [
        { name: '墨硯山北峰', checked: false },
        { name: '挑炭古道｜三通嶺古道', checked: false },
      ],
    },
  },
  {
    tag: '台中市',
    category: {
      highMountain: [
        { name: '雪山', checked: false },
        { name: '南湖大山', checked: false },
        { name: '無明山', checked: false },
      ],
      trail: [
        { name: '大坑十號登山步道', checked: false },
        { name: '谷關七雄｜八仙山', checked: false },
      ],
    },
  },
  {
    tag: '彰化縣',
    category: {
      highMountain: [],
      trail: [
        { name: '松柏嶺登廟步道', checked: false },
        { name: '挑水古道', checked: false },
      ],
    },
  },
  {
    tag: '新竹市',
    category: {
      highMountain: [
        { name: '大霸尖山', checked: false },
        { name: '品田山', checked: false },
        { name: '桃山', checked: false },
        { name: '池有山', checked: false },
      ],
      trail: [
        { name: '司馬庫斯巨木群步道', checked: false },
        { name: '鎮西堡神木步道', checked: false },
      ],
    },
  },
  {
    tag: '新竹縣',
    category: {
      highMountain: [
        { name: '大霸尖山', checked: false },
        { name: '品田山', checked: false },
        { name: '桃山', checked: false },
        { name: '池有山', checked: false },
      ],
      trail: [
        { name: '司馬庫斯巨木群步道', checked: false },
        { name: '鎮西堡神木步道', checked: false },
      ],
    },
  },
  {
    tag: '桃園市',
    category: {
      highMountain: [],
      trail: [
        { name: '北插天山登山步道', checked: false },
        { name: '塔曼山登山步道', checked: false },
      ],
    },
  },
]

export default mountainMapLists
