import { WithId } from 'mongodb';
import { AppUserPreferences } from '.';

export interface AppUserModel {
    auth0Id: string;
    email: string;
    name: string;
    picture: string;
    createdAt: Date;
    lastLogin: Date;
    bio: string;
    preferences: AppUserPreferences
}

export interface WishlistModel {
    userId: string;
    name: string;
    description: string | undefined;
    isPublic: boolean;
    itemCount: number;
    items: WithId<WishlistItemModel>[];
    createdAt: Date;
    updatedAt: Date;
}

export interface WishlistItemModel {
    name: string;
    description: string | undefined;
    price: number;
    priority: 1 | 2 | 3 | 4 | 5;
    url: string;
    notes: string | undefined;
    isPurchased: boolean;
    purchasedBy?: string | undefined;
    purchasedAt?: Date | undefined;
    createdAt: Date;
    updatedAt: Date;
}
