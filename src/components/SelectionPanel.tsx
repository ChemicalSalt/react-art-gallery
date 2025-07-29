import React from 'react';

interface Artwork {
  id: number;
  title: string;
  artist_display: string;
}

interface SelectionPanelProps {
  selectedIds: Set<number>;
  selectedItems: Artwork[];
  onDeselect: (id: number) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({ selectedIds, selectedItems, onDeselect }) => {
  if (selectedIds.size === 0) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      right: 20, 
      top: 80, 
      width: 300, 
      maxHeight: '70vh', 
      overflowY: 'auto', 
      backgroundColor: '#f0f0f0', 
      border: '1px solid #ccc', 
      padding: '1rem', 
      borderRadius: 8,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h3>Selected Artworks ({selectedIds.size})</h3>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {selectedItems.map(item => (
          <li key={item.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{item.title}</strong><br />
            <small>{item.artist_display}</small> <br />
            <button 
              style={{ marginTop: 4, fontSize: 12 }}
              onClick={() => onDeselect(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectionPanel;
