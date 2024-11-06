import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from '../../components/UI/Modal';
import { createItem, updateItem, getItems, deleteItem } from '../../services/item.api';

const ListPage = () => {
  const optionsRef = useRef(null);
  const navigate = useNavigate();
  
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    itemsPerPage: 10,
  });

  const [items, setItems] = useState([]);

  // Fetch items with pagination and search term
  const fetchItems = async (page) => {
    setLoading(true);
    try {
      const data = await getItems(page, pagination.itemsPerPage, searchTerm); // Pass the search term here
      setItems(data.data.docs);
      setPagination({
        currentPage: data.data.page,
        totalItems: data.data.totalDocs,
        totalPages: data.data.totalPages,
        itemsPerPage: data.data.limit,
      });
    } catch (error) {
      console.error('Failed to fetch items', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch items whenever pagination or searchTerm changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
    fetchItems(pagination.currentPage, searchTerm);
  }, [pagination.currentPage,navigate]); // Trigger on page or search term change

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((prevState) => ({
        ...prevState,
        currentPage: prevState.currentPage + 1,
      }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((prevState) => ({
        ...prevState,
        currentPage: prevState.currentPage - 1,
      }));
    }
  };

  // Handle opening the modal
  const openModal = () => {
    setIsModalOpen(true);
    setModalTitle('Create Item');
    setSelectedItem(null); // Reset selected item for creating a new item
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewItem({
      name: '',
      description: '',
      price: '',
      quantity: '',
    });
    fetchItems();
    setErrors([]);
    setSuccessMessage('');
  };

  // Handle item creation or update
  const createOrUpdateItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccessMessage();
    try {
      let createdItem;
      if (selectedItem) {
        // If there's a selected item, update it
        createdItem = await updateItem(selectedItem._id, newItem); // Pass _id and new data to the update function
        if (createdItem.ok) {
          setSuccessMessage(createdItem.msg)
        } else {
          setErrors(createdItem.errors)
        }

      } else {
        // If no selected item, create a new one
        createdItem = await createItem(newItem);
        if (createdItem.ok) {
          setNewItem({
            name: '',
            description: '',
            price: '',
            quantity: '',
          })
          setSuccessMessage(createdItem.msg)
          // fetchItems(pagination.currentPage, searchTerm);
        } else {
          setErrors(createdItem.errors)
        }
      }
    } catch (error) {
      console.error('Failed to save item', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle showing/hiding options for each item
  const handleOptionsClick = (item) => {
    if (selectedItem?._id === item._id) {
      setIsOptionsVisible((prev) => !prev);
    } else {
      setSelectedItem(item);
      setIsOptionsVisible(true);
    }
  };

  // Handle inside click to prevent closing options when clicking inside
  const handleInsideClick = (event) => {
    event.stopPropagation();
  };

  // Handle editing an item
  const handleEdit = () => {
    setModalTitle('Update Item');
    setNewItem({
      name: selectedItem.name,
      description: selectedItem.description,
      price: selectedItem.price,
      quantity: selectedItem.quantity,
    });
    setIsModalOpen(true);
    setIsOptionsVisible(false);
  };

  // Handle deleting an item
  const handleDelete = async () => {
    try {
      // Call delete API or handle deletion in local state
      await deleteItem(selectedItem._id);
      const updatedItems = items.filter(item => item._id !== selectedItem._id);
      setItems(updatedItems);
      setIsOptionsVisible(false);
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-10 m-8 border rounded w-full max-w-3xl bg-white">
        <div className="flex items-center py-8 mb-4 border-b border-gray-300">
          <div className="mr-auto space-x-1 flex items-center">
            <input
              type="text"
              name="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="p-2 border border-gray-300 rounded-l"
            />
            <button onClick={fetchItems} className="px-4 py-2 bg-blue-500 text-white rounded">
              <i className="fa fa-search"></i>
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => setSearchTerm('')}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
          <div className="ml-auto space-x-1">
            <button onClick={openModal} className="px-4 py-2 bg-green-500 text-white rounded">
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
          {successMessage && (
            <div className="bg-green-200 text-xs p-2">{successMessage}</div>
          )}
          {errors?.length > 0 && (
            <div className="p-2 bg-red-200">
              <ul>
                {errors.map((error, index) => (
                  <li className="text-xs" key={index}>
                    {error.msg}.
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <form className="mb-4" onSubmit={createOrUpdateItem}>
              <label className="block text-sm text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item Name"
                className="border p-2 mb-2 w-full"
              />
              <label className="block text-sm text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Item Description"
                className="border p-2 mb-2 w-full"
              />
              <label className="block text-sm text-gray-700">Price</label>
              <input
                type="text"
                name="price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="Price"
                className="border p-2 mb-2 w-full"
              />
              <label className="block text-sm text-gray-700">Quantity</label>
              <input
                type="text"
                name="quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="Quantity"
                className="border p-2 mb-2 w-full"
              />
              <div className="pt-5 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white text-sm px-4 py-2 rounded mr-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white text-sm px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>

        <div className="rounded overflow-hidden border border-gray-300">
          <table className="w-full text-sm text-left rtl:text-right text-black-500">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id} className="bg-white border-b">
                    <td className="px-6 py-2 text-md text-gray-700">{item.name}</td>
                    <td className="px-6 py-2 text-md text-gray-700">{item.description}</td>
                    <td className="px-6 py-2 text-md text-gray-700">{item.price}</td>
                    <td className="px-6 py-2 text-md text-gray-700">{item.quantity}</td>
                    <td className="px-6 py-2 text-md text-gray-700">
                      <button onClick={(e) => { handleOptionsClick(item); handleInsideClick(e); }}>
                        <i className="fa fa-sliders text-xl"></i>
                      </button>
                      {isOptionsVisible && selectedItem?._id === item._id && (
                        <div ref={optionsRef} className="absolute bg-white border shadow-lg rounded-md p-1 mt-1 w-24 z-10">
                          <button
                            className="block px-2 py-2 text-xs text-gray-700 hover:bg-gray-200 rounded"
                            onClick={handleEdit}
                          >
                            Edit
                          </button>
                          <button
                            className="block px-2 py-1 text-xs text-red-500 hover:bg-gray-200 rounded"
                            onClick={handleDelete}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    No items found 😭
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={pagination.currentPage === 1}
            className={`px-4 py-2 text-white font-semibold rounded text-sm
              ${pagination.currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 '}`}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`px-4 py-2 text-white font-semibold rounded text-sm
              ${pagination.currentPage === pagination.totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600'}
            `}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListPage;
