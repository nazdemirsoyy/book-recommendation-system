import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Button} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface BookGridProps {
  books: Book[];
  loading: boolean;
  onViewDetails: (bookId: string) => void;
}
const BookGrid: React.FC<BookGridProps> = ({ books, loading }) => {
  const navigate = useNavigate();

  // action button renderer
  const ActionButton = (params: any) => {
    const book: Book = params.data;

    const handleClick = () => {
      console.log('ActionButton clicked for book:', book.id);
      console.log('Navigating to:', `/books/${book.id}`);
      navigate(`/books/${book.id}`);
    };

    return (
      <Button 
        type="primary" 
        size="small"
        icon={<EyeOutlined />}
        onClick={handleClick}
      >
        View
      </Button>
    );
  };

  // column definitions
  const columnDefs: ColDef[] = [
    {
      headerName: 'Title',
      field: 'title',
      flex: 2,
      minWidth: 200,
    },
    {
      headerName: 'Author(s)',
      field: 'authorsText',
      flex: 1.5,
      minWidth: 150,
    },
    {
      headerName: 'Categories',
      field: 'categories',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        if (Array.isArray(params.value)) {
          return params.value.join(', ');
        }
        return params.value || 'N/A';
      },
    },
    {
      headerName: 'Published',
      field: 'publishedDate',
      width: 100,
      valueFormatter: (params) => params.value ? params.value.split('-')[0] : 'N/A',
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: ActionButton,
      width: 100,
      sortable: false,
      filter: false,
    },
  ];

  // Default column properties
  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          rowData={books}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          loading={loading}
          pagination={true}
          paginationPageSize={20}
          domLayout="normal"
        />
      </div>
    </div>
  );
};

export default BookGrid;