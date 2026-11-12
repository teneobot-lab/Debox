import Chips from '../../components/ui/Chips';
import Empty from '../../components/ui/Empty';
import Skeleton from '../../components/ui/Skeleton';
import { fmt } from '../../lib/format';
import { usePenjualan, PRESETS } from './usePenjualan';

export default function PenjualanPage() {
  const { preset, range, rows, loading, choosePreset, setDates } = usePenjualan();

  const total = rows.reduce((a, r) => a + Number(r.total_jual), 0);
  const terjual = rows.filter((r) => Number(r.total_jual) > 0).length;
  const max = Math.max(1, ...rows.map((r) => Number(r.total_jual)));

  return (
    <>
      <Chips options={PRESETS} value={preset} onChange={choosePreset} />
      <div className="dates">
        <div>
          <label className="no-top">Dari</label>
          <input type="date" value={range.dari} onChange={(e) => setDates(e.target.value, range.sampai)} />
        </div>
        <div>
          <label className="no-top">Sampai</label>
          <input type="date" value={range.sampai} onChange={(e) => setDates(range.dari, e.target.value)} />
        </div>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className="card big">
            <span>Total item terjual</span>
            <b>{fmt(total)}</b>
            <small>
              {terjual} dari {rows.length} jenis barang terjual
            </small>
          </div>
          <div className="group">Per barang</div>
          <div className="card">
            {rows.map((r) => {
              const v = Number(r.total_jual);
              return (
                <div className="row block" key={r.kode}>
                  <div className="between">
                    <div className="l">
                      <b>{r.nama}</b>
                      <small>{r.kode}</small>
                    </div>
                    <div className={'r' + (v ? '' : ' zero')}>
                      {fmt(v)} <small className="inline">{r.satuan}</small>
                    </div>
                  </div>
                  <div className="bar">
                    <i style={{ width: (v / max) * 100 + '%' }} />
                  </div>
                </div>
              );
            })}
            {!rows.length && <Empty>Belum ada barang</Empty>}
          </div>
        </>
      )}
    </>
  );
}
