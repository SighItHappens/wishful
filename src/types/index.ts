export interface AddWishlistItemForm {
    name: string;
    description: string | number | readonly string[] | undefined;
    price: string | number | readonly string[] | undefined;
    priority: 1 | 2 | 3 | 4 | 5;
    url: string;
    notes: string | number | readonly string[] | undefined;
}

export interface AddWishlistForm {
    name: string;
    description: string | number | readonly string[] | undefined;
    isPublic: boolean;
}

export interface Wishlist {
    id: string;
    userId: string;
    name: string;
    description: string | undefined;
    isPublic: boolean;
    itemCount: number;
    items: WishlistItem[];
}

export interface AppUser {
    id: string;
    auth0Id: string;
    email: string;
    name: string;
    picture: string;
    createdAt: Date;
    lastLogin: Date;
    bio: string;
    preferences?: {
        notifyOnShare: boolean;
        publicProfile: boolean;
        hideReservedItems: boolean;
    }
}

export interface WishlistItem {
    id: string;
    name: string;
    description: string | undefined;
    price: number;
    priority: 1 | 2 | 3 | 4 | 5;
    url: string;
    notes: string | undefined;
    isPurchased: boolean;
    purchasedBy?: string | undefined;
    purchasedAt?: Date | undefined;
}
