import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from '../../redux/api/categoryApiSlice';
import CategoryForm from '../../components/CategoryForm';
import Modal from '../../components/Modal';

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();


  //  SECTION: Handle Create Category
  const handleCreateCategory = async (e) => {

    e.preventDefault();

    if (!name) {
      toast.error('Category name is required');
      return;
    }

    try {
      const newCategory = await createCategory({ name }).unwrap();

      if (newCategory.error) {
        toast.error(newCategory.error);
      } else {
        toast.success(`Category called ${newCategory.name} is Created`);
      }

    } catch (error) {
      console.log(error);
      toast.error('Creating Category Failed');
    }
  };


  // SECTION: Handle Delete Category
  const handleDeleteCategory = async (e) => {
    e.preventDefault();

    try{
      const deletedCategory = await deleteCategory(selectedCategory._id).unwrap();
      if (deletedCategory.error) {
        toast.error(deletedCategory.error);
      }else {
        toast.success(`Category called ${deletedCategory.name} is Deleted`);
        setModalVisible(false);
        setUpdatingName('');
        setSelectedCategory(null);
      }
    }catch(error) {
      console.log(error);
      toast.error('Deleting Category Failed');
    }
  };


  // SECTION: Handle Update Category
  const handleUpdateCategory = async (e) => {

    e.preventDefault();

    if (!updatingName) {
      toast.error('Category name is required');
      return;
    }

    try {
      const updatedCategory = await updateCategory({ categoryId: selectedCategory._id, updateCategory: { name: updatingName } }).unwrap();

      if (updatedCategory.error) {
        toast.error(updatedCategory.error);
      } else {
        toast.success(`Category called ${updatedCategory.name} is Updated`);
        setModalVisible(false);
        setUpdatingName('');
        setSelectedCategory(null);  
      }

    }catch(error) {
      console.log(error);
      toast.error('Updating Category Failed');
    }

  };

  return (

    <div className="ml-[10rem] flex">
      <div className="w-1/2">
        <h1 className="text-2xl font-bold">Manage Categories</h1>

        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
          handleDelete={handleDeleteCategory}
        />

        <br />
        <hr />


        {/* // SECTION: Display Categories */}
        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>
        {/* // ENDSECTION: Display Categories */}



        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;