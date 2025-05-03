
import { useState, useRef, RefObject } from 'react';
import { WishlistItem } from '@/types';
import { FaTrash, FaCheck } from 'react-icons/fa';
import { animate, utils } from 'animejs';
import { markOwnItemAsPurchased, markOwnItemAsDeleted } from '@/services/wishlistService';

interface WishlistItemCardProps {
  item: WishlistItem;
  wishlistId: string;
  onDelete: (itemId: string) => void;
  onMarkPurchased: (itemId: string) => void;
}

export default function WishlistItemCard({ item, wishlistId, onDelete, onMarkPurchased }: WishlistItemCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const markPurchasedBgWipeRef = useRef<HTMLSpanElement>(null);
  const deleteBgWipeRef = useRef<HTMLSpanElement>(null);
  const confettiContainerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  function getPriorityColor(priority: number): string {
    if (item.isPurchased) {
      return 'bg-gray-300';
    }

    switch (priority) {
      case 1: return 'bg-gray-300';
      case 2: return 'bg-blue-300';
      case 3: return 'bg-green-300';
      case 4: return 'bg-orange-300';
      case 5: return 'bg-red-300';
      default: return 'bg-gray-300';
    }
  }

  const handleDelete = async () => {
    const success = await markOwnItemAsDeleted(wishlistId, item.id);

    if (success) {
      if (cardContainerRef.current) {
        animate(cardContainerRef.current, {
          opacity: [1, 0],
          duration: 450,
          ease: 'outQuad',
          onComplete: () => {
            onDelete(item.id);
            setShowDeleteConfirm(false);
          }
        })
      }
    }
  };

  const handleMarkPurchased = async () => {
    if (item.isPurchased) return;

    const success = await markOwnItemAsPurchased(wishlistId, item.id);

    if (success) {
      onMarkPurchased(item.id);
      triggerConfetti();
    }
  };

  const handleMouseEnterButton = (bgRef: RefObject<HTMLSpanElement | null>) => {
    utils.remove([bgRef.current]);

    if (bgRef.current) {
      animate(bgRef.current, {
        width: '100%', // Fill width
        ease: 'outQuad',
        duration: 300,
      });
    }
  };

  const handleMouseLeaveButton = (bgRef: RefObject<HTMLSpanElement | null>,) => {
    utils.remove([bgRef.current]);

    if (bgRef.current) {
      animate(bgRef.current, {
        width: '0%', // Shrink width
        ease: 'inQuad',
        duration: 250,
      });
    }
  };

  const triggerConfetti = () => {
    const container = confettiContainerRef.current;
    if (!container) return;

    const confettiCount = 100; // Number of confetti pieces
    // const colors = ['#FFC700', '#FF4B4B', '#87CEFA', '#90EE90', '#FF69B4', '#FFA500']; // Festive colors
    const colors = ['#FACC15', '#FDE047', '#FBBF24', '#FCD34D', '#A855F7', '#C084FC'];

    // Clear any previous confetti
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    for (let i = 0; i < confettiCount; i++) {
      const confettiPiece = document.createElement('div');
      const size = utils.random(5, 10); // Random size

      confettiPiece.style.position = 'absolute';
      confettiPiece.style.width = `${size}px`;
      confettiPiece.style.height = `${size}px`;
      confettiPiece.style.backgroundColor = colors[utils.random(0, colors.length - 1)];
      confettiPiece.style.borderRadius = utils.random(0, 1) > 0.5 ? '50%' : '0'; // Mix circles and squares
      confettiPiece.style.left = '50%';
      confettiPiece.style.top = '50%';
      confettiPiece.style.opacity = '1';
      confettiPiece.classList.add('confetti-piece');
      container.appendChild(confettiPiece);

      animate(confettiPiece, {
        x: utils.random(-10, 10, 2) + 'rem',
        y: utils.random(-10, 10, 2) + 'rem',
        scale: [{ from: 0, to: 1 }, { to: 0 }],
        opacity: [1, 0.5],
        duration: utils.random(1500, 2500),
        ease: 'outCubic',
        delay: utils.random(0, 1000),
        onComplete: () => {
          confettiPiece.remove();
        }
      });
    }
  };

  return (
    <div
      ref={cardContainerRef}
      className={`
        bg-white h-full rounded-xl shadow-md overflow-hidden min-h-[180px]
        flex flex-col transition-all border-2 border-gray-100 relative
        ${item.isPurchased && !isHovering
          ? 'opacity-60 grayscale cursor-default'
          : 'hover:shadow-xl'
        }
      `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowDeleteConfirm(false);
        handleMouseLeaveButton(markPurchasedBgWipeRef);
        handleMouseLeaveButton(deleteBgWipeRef);
      }}
    >
      <div
        ref={confettiContainerRef}
        className="absolute inset-0 z-30 pointer-events-none overflow-hidden" // Positioned above content, ignores clicks
        aria-hidden="true"
      ></div>

      <div className={`p-5 flex flex-col flex-grow transition-opacity duration-200 ${isHovering ? 'opacity-10' : 'opacity-100'}`}>
        <div className="flex justify-between items-start">
          <h3 className="text-lg capitalize font-semibold mb-2 text-gray-800">{item.name}</h3>
        </div>
        <div className="flex-grow">
          <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        </div>
        {item.price && (
          <p className="text-indigo-600 font-medium mt-auto">${item.price.toFixed(2)}</p>
        )}
      </div>

      <div className={`p-2 px-5 border-t border-gray-100 transition-opacity duration-200 ${isHovering ? 'opacity-10' : 'opacity-100'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getPriorityColor(item.priority)}`}></span>
            <span className="text-sm text-gray-500">Priority: {item.priority}</span>
          </div>
          <div className={`text-sm ${item.isPurchased ? 'text-gray-500' : 'text-green-600'}`}>
            {item.isPurchased ? 'Purchased' : 'Available'}
          </div>
        </div>
      </div>

      {isHovering && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3 p-4">
          {!item.isPurchased && (
              <button 
              onClick={handleMarkPurchased}
              onMouseEnter={() => handleMouseEnterButton(markPurchasedBgWipeRef)}
              onMouseLeave={() => handleMouseLeaveButton(markPurchasedBgWipeRef)}
              className="relative cursor-pointer overflow-hidden border-2 border-green-500 text-green-500 hover:text-white px-4 py-2 rounded-md transition-colors duration-100 w-full flex items-center justify-center gap-2"
              aria-label="Mark as purchased"
              disabled={item.isPurchased}
            >
              <span
                ref={markPurchasedBgWipeRef}
                className="absolute inset-0 bg-green-500 w-0 -z-10"
                aria-hidden="true"
              ></span>
              <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
                <FaCheck className="text-sm" />
                <span>{item.isPurchased ? 'Purchased' : 'Mark Purchased'}</span>
              </span>
            </button>
          )}

          <button 
            onClick={() => setShowDeleteConfirm(true)}
            onMouseEnter={() => handleMouseEnterButton(deleteBgWipeRef)}
            onMouseLeave={() => handleMouseLeaveButton(deleteBgWipeRef)}
            className="relative cursor-pointer overflow-hidden border-2 border-red-500 text-red-500 hover:text-white px-4 py-2 rounded-md transition-colors duration-100 w-full flex items-center justify-center gap-2"
            aria-label="Delete item"
          >
            <span
              ref={deleteBgWipeRef}
              className="absolute inset-0 bg-red-500 w-0 -z-10"
              aria-hidden="true"
            ></span>
            <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
              <FaTrash className="text-sm" />
              <span>Delete</span>
            </span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Text */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-20">
          <div className="text-center px-4">
            <p className="text-gray-800 font-medium mb-4">Are you sure?</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-white border border-gray-300 hover:bg-gray-300 cursor-pointer text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete()}
                className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
