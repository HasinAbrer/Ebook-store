import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const rating = Number(book?.ratingAvg || 0);
  const stars = Array.from({ length: 5 }).map((_, i) =>
    i < Math.round(rating) ? <AiFillStar key={i} className="text-amber-400" /> : <AiOutlineStar key={i} className="text-amber-400" />
  );

  const fallbackImg =
    "data:image/svg+xml;utf8,"
    + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial, Helvetica, sans-serif">No Image</text></svg>'
    );

  const imgCandidate = book?.coverImage || book?.imageUrl || book?.image || book?.thumbnail || book?.photoUrl;
  const src = getImgUrl(imgCandidate) || fallbackImg;

  return (
    <article className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/books/${book?._id}`} className="block relative">
        <img
          src={src}
          alt={book?.title || "Book Cover"}
          className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { if (e.currentTarget.src !== fallbackImg) e.currentTarget.src = fallbackImg; }}
        />
        {book?.category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
            {book.category}
          </span>
        )}
      </Link>
      <div className="p-3">
        <Link to={`/books/${book?._id}`} className="flex items-center gap-1 text-xs">
          {stars}<span className="ml-1 text-gray-500">{rating.toFixed(1)}</span>
        </Link>
        <Link to={`/books/${book?._id}`}>
          <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug group-hover:text-primary min-h-[44px]">
            {book?.title || "Untitled"}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-gray-600 line-clamp-2 min-h-[36px]">
          {book?.description || "No description available"}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">${book?.newPrice ?? "N/A"}</span>
            {book?.oldPrice && (
              <span className="text-sm text-gray-500 line-through">${book.oldPrice}</span>
            )}
          </div>
          <button
            onClick={() => handleAddToCart(book)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-white hover:opacity-90 text-sm"
          >
            <FiShoppingCart />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
