import type { ProvinceInfo } from '../types'

interface ExplorePanelProps {
  province: ProvinceInfo | null
}

export function ExplorePanel({ province }: ExplorePanelProps) {
  if (!province) {
    return (
      <div className="panel panel--empty">
        <div className="panel-icon" aria-hidden="true">🗺️</div>
        <h2>探索模式</h2>
        <p>点击地图上的省份，查看名称、简称、省会与所属区域。</p>
        <ul className="panel-tips">
          <li>滚轮或双指缩放地图</li>
          <li>拖拽可平移视图</li>
          <li>悬停可预览省名</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="panel">
      <p className="panel-label">当前选中</p>
      <h2 className="panel-title">{province.name}</h2>
      <dl className="info-list">
        <div className="info-row">
          <dt>简称</dt>
          <dd>{province.shortName}</dd>
        </div>
        <div className="info-row">
          <dt>省会</dt>
          <dd>{province.capital}</dd>
        </div>
        <div className="info-row">
          <dt>区域</dt>
          <dd>{province.region}</dd>
        </div>
      </dl>
    </div>
  )
}
