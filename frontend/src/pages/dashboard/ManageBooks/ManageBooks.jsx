import React from 'react';
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link } from 'react-router-dom';

const ManageBooks = () => {
  // Get data from RTK Query
  const { data, refetch } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();

  // Fix: Ensure books is always an array
  const books = data?.data || [];

  // Handle deleting a book
  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id).unwrap();
      alert('Book deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Failed to delete book:', error.message);
      alert('Failed to delete book. Please try again.');
    }
  };

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">All Books</h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <button
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded"
                  type="button"
                >
                  See all
                </button>
              </div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left text-blueGray-500 border border-blueGray-100">#</th>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left text-blueGray-500 border border-blueGray-100">Book Title</th>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left text-blueGray-500 border border-blueGray-100">Category</th>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left text-blueGray-500 border border-blueGray-100">Price</th>
                  <th className="px-6 py-3 text-xs uppercase font-semibold text-left text-blueGray-500 border border-blueGray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-xs text-left border-t">{index + 1}</td>
                    <td className="px-6 py-4 text-xs border-t">{book.title}</td>
                    <td className="px-6 py-4 text-xs border-t">{book.category}</td>
                    <td className="px-6 py-4 text-xs border-t">${book.newPrice}</td>
                    <td className="px-6 py-4 text-xs border-t space-x-2">
                      <Link
                        to={`/dashboard/edit-book/${book._id}`}
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {books.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageBooks;
