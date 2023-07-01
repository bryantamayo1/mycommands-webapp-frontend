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
import { useFormik } from 'formik';
import * as Yup         from 'yup';
import { TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';

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

  // Define form with formik
  const formik = useFormik({
    initialValues: {
      category: '',
      version: ''
    },
    validationSchema: Yup.object({
      category: Yup.string().required('Category is required').max(100, "100 characters is maximum"),
      version: Yup.string().required('Version is required').max(100, "100 characters is maximum")
    }),
    onSubmit: async values => {
      try{
        await ServicesCategories.createCategory(values);
        getCategories();
        handleCloseModal();
      }catch(error){
      }
    }
  });

  useEffect(() => {
    getCategories();
  }, []);
  
  ////////////
  // Functions
  ////////////
  const getCategories = async () => {
    const resp = await ServicesCategories.getCategories();
    resp.data.shift();
    setState(prevState => ({ ...prevState, categories: resp }));
  }

  const handleOpenModal = () => {
    setState(prevState => ({ ...prevState, openModal: true }));
  }

  const handleCloseModal = () => {
    setState(prevState => ({ ...prevState, openModal: false }));
    formik.resetForm();
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
              <td>{moment(createdAt).format("YYYY-MM-DD")}</td>
              <td>{moment(updatedAt).format("YYYY-MM-DD")}</td>
              <td>{results}</td>
              <td>
                <Tooltip title="Action not authorizated">
                  <Button variant="contained" color='secondary' size="small" className='mc-btn'>
                    <EditIcon fontSize="small"/>
                  </Button>
                </Tooltip>
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

      {/* Modal: create category */}
      <Modal
        open={state.openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
       <Box sx={style}>
          {/* Btn close modal */}
          <div className='mc-modal-create-category-close'>
            <Button color="inherit" style={{ minWidth: 20 }} onClick={handleCloseModal}>
              <CloseIcon/>
            </Button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <p className="mc-modal-create-category-title">Create category</p>

            <div className='mc-modal-create-category-divider'>
              <TextField id="category" fullWidth label="Category" variant="standard"
                name="category" type="text" 
                onChange={formik.handleChange} value={formik.values.category}
                helperText={formik.errors.category}
                // @ts-ignore
                error={formik.touched.category && formik.errors.category }
              />
            </div>

            <div className='mc-modal-create-category-divider'>
              <TextField id="version" fullWidth label="Version" variant="standard"
                name="version" type="text" 
                onChange={formik.handleChange} value={formik.values.version}
                helperText={formik.errors.version}
                // @ts-ignore
                error={formik.touched.category && formik.errors.category }
              />
            </div>

            <div className='mc-modal-create-category-btn-submit'>
              <Button variant="contained" color="secondary"
                type="submit">
                Create
              </Button>
            </div>

          </form>
       </Box>
      </Modal>
    </div>
  )
}
