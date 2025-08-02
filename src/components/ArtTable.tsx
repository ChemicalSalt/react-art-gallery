import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import SelectionPanel from './SelectionPanel';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const PAGE_SIZE = 12;

const ArtTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Artwork[]>([]);

  const [visitedRows, setVisitedRows] = useState<Artwork[]>([]); 
  const [showSelectorInput, setShowSelectorInput] = useState(false);
  const [selectCount, setSelectCount] = useState<number | null>(null);

  const fetchPage = async (pageNumber: number): Promise<Artwork[]> => {
    console.log(`[DEBUG] Fetching from API: Page ${pageNumber}`);
    setLoading(true);
    try {
      const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}`);
      const data = await res.json();
      if (pageNumber === 1) {
        setTotalRecords(data.pagination.total ?? 0);
      }
      return data.data;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      const data = await fetchPage(page);
      if (!controller.signal.aborted) {
        setArtworks(data);
        setVisitedRows(prev => {
          const combined = [...prev, ...data];
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return unique;
        });
      }
    };
    load();
    return () => controller.abort();
  }, [page]);

  const onPageChange = (event: { first: number; rows: number }) => {
    const newPage = event.first / event.rows + 1;
    setPage(newPage);
  };

  const onSelectionChange = (selectedRows: Artwork[]) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      selectedRows.forEach(row => newSet.add(row.id));
      artworks.forEach(row => {
        if (!selectedRows.some(sr => sr.id === row.id)) {
          newSet.delete(row.id);
        }
      });
      return newSet;
    });

    setSelectedItems(prev => {
      const others = prev.filter(item => !artworks.some(a => a.id === item.id));
      const combined = [...others, ...selectedRows];
      const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
      return unique;
    });
  };

  const onDeselect = (id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAutoSelect = () => {
    if (!selectCount || selectCount < 1) return;

    if (visitedRows.length < selectCount) {
      alert(`Only ${visitedRows.length} artworks available from visited pages.`);
      return;
    }

    const finalSelection = visitedRows.slice(0, selectCount);

    setSelectedIds(() => {
      const newSet = new Set<number>();
      finalSelection.forEach(item => newSet.add(item.id));
      return newSet;
    });

    setSelectedItems(finalSelection);
    setShowSelectorInput(false);
    setSelectCount(null);
  };

  return (
    <>
      <DataTable
        value={artworks}
        paginator
        rows={PAGE_SIZE}
        totalRecords={totalRecords}
        lazy
        first={(page - 1) * PAGE_SIZE}
        onPage={onPageChange}
        loading={loading}
        selectionMode="checkbox"
        selection={artworks.filter(a => selectedIds.has(a.id))}
        onSelectionChange={e => onSelectionChange(e.value)}
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />

        <Column
          field="title"
          header={() => (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i
                className="pi pi-chevron-down"
                style={{ cursor: 'pointer', fontSize: '1rem' }}
                onClick={() => setShowSelectorInput(prev => !prev)}
              />
              <span>Title</span>

              {showSelectorInput && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1.8rem',
                    left: 0,
                    background: '#fff',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 999,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '180px',
                  }}
                >
                  <InputNumber
                    value={selectCount}
                    onValueChange={e => setSelectCount(e.value ?? null)}
                    min={1}
                    max={visitedRows.length || PAGE_SIZE}
                    placeholder="Enter count"
                    inputStyle={{ height: '2.25rem', width: '100%' }}
                  />
                  <button
                    onClick={handleAutoSelect}
                    style={{
                      marginTop: '0.5rem',
                      background: '#333',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.5rem 0.75rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '100%',
                    }}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}
        />

        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist Display" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>

      <SelectionPanel
        selectedIds={selectedIds}
        selectedItems={selectedItems}
        onDeselect={onDeselect}
      />
    </>
  );
};

export default ArtTable;
