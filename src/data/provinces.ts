import type { ProvinceInfo } from '../types'

export const PROVINCES: ProvinceInfo[] = [
  { adcode: 110000, name: '北京市', shortName: '京', capital: '北京', region: '华北' },
  { adcode: 120000, name: '天津市', shortName: '津', capital: '天津', region: '华北' },
  { adcode: 130000, name: '河北省', shortName: '冀', capital: '石家庄', region: '华北' },
  { adcode: 140000, name: '山西省', shortName: '晋', capital: '太原', region: '华北' },
  { adcode: 150000, name: '内蒙古自治区', shortName: '蒙', capital: '呼和浩特', region: '华北' },
  { adcode: 210000, name: '辽宁省', shortName: '辽', capital: '沈阳', region: '东北' },
  { adcode: 220000, name: '吉林省', shortName: '吉', capital: '长春', region: '东北' },
  { adcode: 230000, name: '黑龙江省', shortName: '黑', capital: '哈尔滨', region: '东北' },
  { adcode: 310000, name: '上海市', shortName: '沪', capital: '上海', region: '华东' },
  { adcode: 320000, name: '江苏省', shortName: '苏', capital: '南京', region: '华东' },
  { adcode: 330000, name: '浙江省', shortName: '浙', capital: '杭州', region: '华东' },
  { adcode: 340000, name: '安徽省', shortName: '皖', capital: '合肥', region: '华东' },
  { adcode: 350000, name: '福建省', shortName: '闽', capital: '福州', region: '华东' },
  { adcode: 360000, name: '江西省', shortName: '赣', capital: '南昌', region: '华东' },
  { adcode: 370000, name: '山东省', shortName: '鲁', capital: '济南', region: '华东' },
  { adcode: 410000, name: '河南省', shortName: '豫', capital: '郑州', region: '华中' },
  { adcode: 420000, name: '湖北省', shortName: '鄂', capital: '武汉', region: '华中' },
  { adcode: 430000, name: '湖南省', shortName: '湘', capital: '长沙', region: '华中' },
  { adcode: 440000, name: '广东省', shortName: '粤', capital: '广州', region: '华南' },
  { adcode: 450000, name: '广西壮族自治区', shortName: '桂', capital: '南宁', region: '华南' },
  { adcode: 460000, name: '海南省', shortName: '琼', capital: '海口', region: '华南' },
  { adcode: 500000, name: '重庆市', shortName: '渝', capital: '重庆', region: '西南' },
  { adcode: 510000, name: '四川省', shortName: '川', capital: '成都', region: '西南' },
  { adcode: 520000, name: '贵州省', shortName: '贵', capital: '贵阳', region: '西南' },
  { adcode: 530000, name: '云南省', shortName: '滇', capital: '昆明', region: '西南' },
  { adcode: 540000, name: '西藏自治区', shortName: '藏', capital: '拉萨', region: '西南' },
  { adcode: 610000, name: '陕西省', shortName: '陕', capital: '西安', region: '西北' },
  { adcode: 620000, name: '甘肃省', shortName: '甘', capital: '兰州', region: '西北' },
  { adcode: 630000, name: '青海省', shortName: '青', capital: '西宁', region: '西北' },
  { adcode: 640000, name: '宁夏回族自治区', shortName: '宁', capital: '银川', region: '西北' },
  { adcode: 650000, name: '新疆维吾尔自治区', shortName: '新', capital: '乌鲁木齐', region: '西北' },
  { adcode: 710000, name: '台湾省', shortName: '台', capital: '台北', region: '东南' },
  { adcode: 810000, name: '香港特别行政区', shortName: '港', capital: '香港', region: '华南' },
  { adcode: 820000, name: '澳门特别行政区', shortName: '澳', capital: '澳门', region: '华南' },
]

export const PROVINCE_BY_NAME = new Map(PROVINCES.map((p) => [p.name, p]))

export const QUIZ_ROUND_SIZE = 10

export function pickRandomProvince(exclude?: string): ProvinceInfo {
  const pool = exclude
    ? PROVINCES.filter((p) => p.name !== exclude)
    : PROVINCES
  return pool[Math.floor(Math.random() * pool.length)]
}
