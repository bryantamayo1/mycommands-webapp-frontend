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
import { SessionStorage } from '../../utils/SessionStorage';
import { Alert } from '../common/Alert';

type typeCreateOrEditCategory = {
  category: string,
  version: string,
  _id: string
}

type typeStateInitial = {
  categories: InterfaceGetFilters,
  openModalCreateOrEdit: boolean,
  selectedCategory: typeCreateOrEditCategory
  createOrEdit: boolean,   // false = create, true = edit
  openModalDelete: boolean
}

const StateInitial:typeStateInitial = {
  categories: {} as InterfaceGetFilters,
  openModalCreateOrEdit: false,
  selectedCategory: {} as typeCreateOrEditCategory,
  createOrEdit: false,
  openModalDelete: false,
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
      // Edit
      if(state.createOrEdit){
        await ServicesCategories.editCategory(state.selectedCategory._id, values);
        getCategories();
        handleCloseModalCreateOrEdit();
      // Create
      }else{
        await ServicesCategories.createCategory(values);
        getCategories();
        handleCloseModalCreateOrEdit();
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

  const handleOpenModalCreateOrEdit = (category?: typeCreateOrEditCategory) => {
    // Edit
    if(category){
      formik.setFieldValue("category", category.category);
      formik.setFieldValue("version", category.version);
      setState(prevState => ({
        ...prevState,
        openModalCreateOrEdit: true,
        selectedCategory: category,
        createOrEdit: true
      }));

    // Close
    }else{
      formik.setFieldValue("category", "");
      formik.setFieldValue("version", "");
      setState(prevState => ({
        ...prevState,
        openModalCreateOrEdit: true,
        selectedCategory: {} as typeCreateOrEditCategory,
        createOrEdit: false
      }));
    }
  }

  const handleCloseModalCreateOrEdit = () => {
    setState(prevState => ({ ...prevState, openModalCreateOrEdit: false }));
    formik.resetForm();
  }

  const handleCloseModalDelete = () => {
    setState(prevState => ({ ...prevState, openModalDelete: false }));
  }

  const handleOpenModalDelete = (category: typeCreateOrEditCategory) => {
    setState(prevState => ({
      ...prevState,
      openModalDelete: true,
      selectedCategory: category,
    }));
  }

  const deleteCategory =  async (id: string) => {
    await ServicesCategories.deleteCategory(id);
    getCategories();
    handleCloseModalDelete();
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
        <Button variant="contained" color="secondary" size="small" onClick={() => handleOpenModalCreateOrEdit()}>
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
          {state.categories.data?.map( ({ category, version, createdAt, updatedAt, results, _id }) => (
            <tr>
              <td>{category}</td>
              <td>{version}</td>
              <td>{moment(createdAt).format("YYYY-MM-DD")}</td>
              <td>{moment(updatedAt).format("YYYY-MM-DD")}</td>
              <td>{results}</td>
              <td>
                <Button variant="contained" color='secondary' size="small" className='mc-btn'
                  disabled={SessionStorage.getItem("user").role === "GUEST"}
                  onClick={() => handleOpenModalCreateOrEdit({category, version, _id: _id })}
                >
                  <EditIcon fontSize="small"/>
                </Button>
              </td>
              <td>
                <Button variant="contained" color='secondary' size="small" className='mc-btn'
                  disabled={SessionStorage.getItem("user").role === "GUEST"}
                  onClick={() => handleOpenModalDelete({category, version, _id: _id })}
                >
                  <DeleteIcon fontSize="small"/>
                </Button>
              </td>
            </tr>
          ))}
        </table>
      </div>

      {/* Modal: create category */}
      <Modal
        open={state.openModalCreateOrEdit}
        onClose={handleCloseModalCreateOrEdit}
        aria-labelledby="modal-modal-title-edit-and-create"
        aria-describedby="modal-modal-description-edit-and-create"
      >
       <Box sx={style}>
          {/* Btn close modal */}
          <div className='mc-modal-create-category-close'>
            <Button color="inherit" style={{ minWidth: 20 }} onClick={handleCloseModalCreateOrEdit}>
              <CloseIcon/>
            </Button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <p className="mc-modal-create-category-title">
              {state.createOrEdit? `Edit category ${state.selectedCategory.category}` : "Create category"}
            </p>

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
                {state.createOrEdit? "Edit": "Create"}
              </Button>
            </div>

          </form>
       </Box>
      </Modal>

      {/* Modal: delete category */}
      <Modal
        open={state.openModalDelete}
        onClose={handleCloseModalDelete}
        aria-labelledby="modal-modal-title-delete"
        aria-describedby="modal-modal-description-delete"
      >
        <Box sx={style}>
          {/* Btn close modal */}
          <div className='mc-modal-create-category-close'>
            <Button color="inherit" style={{ minWidth: 20 }} onClick={handleCloseModalDelete}>
              <CloseIcon/>
            </Button>

            <p className="mc-modal-create-category-title" style={{ textAlign: "start" }}>
              Delete category {state.selectedCategory.category}
            </p>

            <Alert severity="error">
              <div style={{ textAlign: "start" }}>
                It is going to delete all commands with subcategorues associared to this category!
              </div>
            </Alert>

            <div className='mc-modal-create-category-btn-submit'>
              <Button variant="contained" color="secondary"
                onClick={() => deleteCategory(state.selectedCategory._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
