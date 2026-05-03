import type { Stat } from '@/lib/types'

interface Props {
  stat: Stat
}

export default function IframeEmbed({ stat }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {stat.stat_text && (
        <div className="border-b border-gray-100 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">{stat.stat_text}</p>
        </div>
      )}

      {/* 16:9 aspect ratio container */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={stat.iframe_url!}
          title={stat.stat_text}
          className="absolute inset-0 h-full w-full"
          sandbox="allow-scripts allow-same-origin allow-popups"
          loading="lazy"
        />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-5 py-3">
        <span className="text-xs text-gray-400">
          {stat.source_name}
          {stat.source_year ? `, ${stat.source_year}` : ''}
        </span>
        {stat.context && (
          <span className="text-xs italic text-gray-400">{stat.context}</span>
        )}
      </div>
    </div>
  )
}
