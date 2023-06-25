import './CategoriesPage.css';
import { useEffect, useState } from 'react';
import { ServicesCategories } from '../../services/ServicesCategories';
import { InterfaceGetFilters } from '../../interfaces/Categories';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import moment from 'moment';


type typeStateInitial = {
  categories: InterfaceGetFilters,
  openModal: boolean
}

const StateInitial:typeStateInitial = {
  categories: {} as InterfaceGetFilters,
  openModal: false
}

export const CategoriesPage = () => {
  ////////
  // Hooks
  ////////
  const [state, setState] = useState(StateInitial);

  useEffect(() => {
    getCategories();
  }, []);
  
  const getCategories = async () => {
    const resp = await ServicesCategories.getCategories();
    setState(prevState => ({ ...prevState, categories: resp }));
  }

  const handleOpenModal = () => {
    setState(prevState => ({ ...prevState, openModal: true }));
  }

  const handleCloseModal = () => {
    setState(prevState => ({ ...prevState, openModal: false }));
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className='mc-container-page'>
      <div className='mc-container-box'>
        <Button variant="contained" color="secondary" size="small" onClick={handleOpenModal}>
          <AddIcon fontSize="small"/>
        </Button>

        <table className='mc-table'>
          {/* Header */}
          <tr className='mc-table--header'>
            <th>Category</th>
            <th>Version</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Commands</th>
          </tr>

          {/* Body */}
          {state.categories.data?.map( ({ category, version, createdAt, updatedAt, results }) => (
            <tr>
              <td>{category}</td>
              <td>{version}</td>
              <td>{moment(createdAt).format("YYY-MM-DD")}</td>
              <td>{moment(updatedAt).format("YYY-MM-DD")}</td>
              <td>{results}</td>
              <td>
                <Button variant="contained" color='secondary' size="small" className='mc-btn'>
                  <EditIcon fontSize="small"/>
                </Button>
              </td>
              <td>
                <Button variant="contained" color='secondary' size="small" className='mc-btn'>
                  <DeleteIcon fontSize="small"/>
                </Button>
              </td>
            </tr>
          ))}
        </table>
      </div>

      {/* Modal */}
      <Modal
        open={state.openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
       <Box sx={style}>
          12
       </Box>
      </Modal>
    </div>
  )
}
