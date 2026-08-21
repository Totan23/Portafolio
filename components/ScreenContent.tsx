/**
 * Placeholder de contenido para la pantalla del laptop.
 * Reemplazá o pasá `children` al <LaptopReveal /> cuando tengas tu UI final.
 */
export default function ScreenContent() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0A0E14] text-[#EDE8DC]">
      {/* Title bar tipo macOS */}
      <header className="flex items-center px-3 py-1.5 border-b border-white/5 bg-black/40 flex-shrink-0">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-auto mr-auto px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono tracking-wide opacity-70">
          dashboard.app
        </div>
        <div className="w-12" />
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-[18%] border-r border-white/5 p-2 space-y-0.5 bg-black/20">
          <div className="text-[7px] font-mono uppercase tracking-wider opacity-30 mb-1 px-1.5">
            Workspace
          </div>
          {[
            { label: 'Overview', active: true },
            { label: 'Analytics', active: false },
            { label: 'Projects', active: false },
            { label: 'Team', active: false },
            { label: 'Reports', active: false },
            { label: 'Settings', active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`text-[9px] px-1.5 py-1 rounded transition-colors flex items-center gap-1 ${
                item.active
                  ? 'bg-[#AF4C32]/25 text-[#F6A757]'
                  : 'text-white/40'
              }`}
            >
              <span className={`w-1 h-1 rounded-full ${item.active ? 'bg-[#F6A757]' : 'bg-white/20'}`} />
              {item.label}
            </div>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 p-3 overflow-hidden">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-mono text-[7px] uppercase tracking-[0.18em] opacity-40">
              // overview
            </span>
          </div>
          <h2 className="text-[13px] font-semibold mb-2 leading-tight">
            Welcome back, Jonathan
          </h2>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'MRR', value: '$24.5K', delta: '+12%' },
              { label: 'Users', value: '1,832', delta: '+8%' },
              { label: 'Churn', value: '2.1%', delta: '-0.3%' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/[0.03] border border-white/5 rounded p-1.5"
              >
                <div className="text-[7px] font-mono uppercase tracking-wider opacity-40">
                  {stat.label}
                </div>
                <div className="text-[11px] font-semibold mt-0.5 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[7px] mt-0.5 text-[#F6A757]">{stat.delta}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white/[0.03] border border-white/5 rounded p-1.5 mt-1.5">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[7px] font-mono uppercase tracking-wider opacity-40">
                Revenue trend
              </div>
              <div className="text-[7px] font-mono opacity-60">12 months</div>
            </div>
            <div className="flex items-end gap-px h-8">
              {[40, 55, 48, 68, 58, 76, 64, 84, 73, 90, 80, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[#AF4C32]/55 to-[#F6A757]/80 rounded-[1px]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white/[0.03] border border-white/5 rounded p-1.5 mt-1.5">
            <div className="text-[7px] font-mono uppercase tracking-wider opacity-40 mb-1">
              Recent activity
            </div>
            <div className="space-y-0.5">
              {[
                { text: 'Deploy to production', time: '2m', color: '#F6A757' },
                { text: 'New user signup', time: '12m', color: '#28c840' },
                { text: 'Webhook failed (retried)', time: '34m', color: '#febc2e' },
              ].map((row) => (
                <div key={row.text} className="flex items-center gap-1.5 text-[8px]">
                  <span style={{ color: row.color }}>●</span>
                  <span className="opacity-80 flex-1 truncate">{row.text}</span>
                  <span className="opacity-40 font-mono">{row.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
