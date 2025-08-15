import React from 'react'
import { FiShoppingCart } from "react-icons/fi"
import { useParams } from "react-router-dom"

import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { useAuth } from '../../context/AuthContext';
import ReviewList from '../../components/reviews/ReviewList';
import AddReview from '../../components/reviews/AddReview';

const SingleBook = () => {
    const {id} = useParams();
    const {data: book, isLoading, isError} = useFetchBookByIdQuery(id);

    const dispatch =  useDispatch();
    const { currentUser: user } = useAuth();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error happening to load book info</div>
  return (
    <div className="mt-28 px-4 lg:px-24">
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                    <img src={`${getImgUrl(book.coverImage)}`} alt={book.title} className="w-full shadow-lg rounded-lg" />
                </div>
                <div className="md:w-2/3">
                    <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                    <p className="text-lg text-gray-600 mb-4">by {book.author || 'admin'}</p>
                    <p className="text-gray-700 mb-4 capitalize">
                        <strong>Category:</strong> {book?.category}
                    </p>
                    <p className="text-gray-700 mb-4">
                        <strong>Published:</strong> {new Date(book?.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                    <button onClick={() => handleAddToCart(book)} className="btn-primary mt-6 px-6 space-x-1 flex items-center gap-1 ">
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>

            <div className="mt-12">
                <ReviewList bookId={book._id} />
                {user && (
                    <div className="mt-8">
                        <AddReview bookId={book._id} />
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default SingleBook