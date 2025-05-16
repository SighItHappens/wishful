'use server';

import { auth0 } from "@/lib/auth0";
import { WishlistModel, WishlistItemModel } from "@/types/models";
import { AddWishlistForm, AddWishlistItemForm, AppUser, SharedAppUser, Wishlist, WishlistItem } from "@/types"
import clientPromise from "@/lib/mongodb";
import { findOrCreateUser } from "./userService";
import { ObjectId, WithId } from "mongodb";
import { redirect } from 'next/navigation';

export async function fetchOwnWishlists(): Promise<Wishlist[]> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }

  const client = await clientPromise;
  const db = client.db("wishful");

  const user: AppUser = await findOrCreateUser();

  const wishlists = await db.collection<WishlistModel>("wishlists")
    .find({ userId: user.id }, { projection: { items: false }})
    .sort({ createdAt: -1 })
    .toArray();

  return wishlists.map((wishlist: WithId<WishlistModel>): Wishlist => {
    return {
      id: wishlist._id.toString(),
      userId: wishlist.userId,
      name: wishlist.name,
      description: wishlist.description,
      isPublic: wishlist.isPublic,
      itemCount: wishlist.itemCount,
      items: []
    };
  });
}

export async function fetchOwnWishlistWithItems(wishlistId: string): Promise<Wishlist | null> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }

  const client = await clientPromise;
  const db = client.db("wishful");

  const user: AppUser = await findOrCreateUser();

  const wishlist = await db.collection<WishlistModel>("wishlists")
    .findOne({ userId: user.id, _id: new ObjectId(wishlistId) });

  if (!wishlist) {
    return null;
  }

  return {
    id: wishlist._id.toString(),
    userId: wishlist.userId,
    name: wishlist.name,
    description: wishlist.description,
    isPublic: wishlist.isPublic,
    itemCount: wishlist.itemCount,
    items: wishlist.items?.map((item: WithId<WishlistItemModel>): WishlistItem => {
      return {
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        url: item.url,
        notes: item.notes,
        priority: item.priority,
        isPurchased: item.isPurchased,
        purchasedBy: item.purchasedBy ?? undefined,
        purchasedAt: item.purchasedAt ?? undefined,
      }
    }) ?? []
  };
}

export async function fetchWishlistWithItems(wishlistId: string): Promise<[Wishlist, SharedAppUser]> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }

  const client = await clientPromise;
  const db = client.db("wishful");

  const wishlist = await db.collection<WishlistModel>("wishlists")
    .findOne({ _id: new ObjectId(wishlistId) });

  if (!wishlist || !wishlist.isPublic) {
    return [{} as Wishlist, {} as SharedAppUser];
  }

  const user = await db.collection<AppUser>("users").findOne({ _id: new ObjectId(wishlist.userId) });
  if (!user) {
    return [{} as Wishlist, {} as SharedAppUser];
  }

  return [{
    id: wishlist._id.toString(),
    userId: wishlist.userId,
    name: wishlist.name,
    description: wishlist.description,
    isPublic: wishlist.isPublic,
    itemCount: wishlist.itemCount,
    items: wishlist.items?.map((item: WithId<WishlistItemModel>): WishlistItem => {
      return {
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        url: item.url,
        notes: item.notes,
        priority: item.priority,
        isPurchased: item.isPurchased,
        purchasedBy: item.purchasedBy ?? undefined,
        purchasedAt: item.purchasedAt ?? undefined,
      }
    }) ?? []
  }, { 
    id: user._id.toString(),
    name: user.name
  }];
}

export async function createWishlist(wishlistData: AddWishlistForm): Promise<Wishlist> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }

  const client = await clientPromise;
  const db = client.db("wishful");

  const user: AppUser = await findOrCreateUser()

  const newWishlist = {
    userId: user.id,
    name: wishlistData.name,
    description: wishlistData.description?.toString(),
    isPublic: wishlistData.isPublic,
    itemCount: 0,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const result = await db.collection<WishlistModel>("wishlists").insertOne(newWishlist);

  return {
    id: result.insertedId.toString(),
    userId: newWishlist.userId,
    description: newWishlist.description?.toString(),
    isPublic: newWishlist.isPublic,
    name: newWishlist.name,
    itemCount: newWishlist.itemCount,
    items: []
  }
}

export async function deleteWishlist(wishlistId: string): Promise<boolean> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }

  const client = await clientPromise;
  const db = client.db("wishful");

  const user: AppUser = await findOrCreateUser()

  const { acknowledged, deletedCount } = await db.collection<WishlistModel>("wishlists").deleteOne({
    userId: user.id,
    _id: new ObjectId(wishlistId)
  });
  
  return acknowledged && deletedCount > 0;
}

export async function addItemToOwnWishlist(wishlistId: string, itemData: AddWishlistItemForm): Promise<WishlistItem> {
  const formattedItemData = {
    _id: new ObjectId(),
    ...itemData,
    description: itemData.description === undefined ? '' : itemData.description.toString(),
    notes: itemData.notes === undefined ? '' : itemData.notes.toString(),
    price: itemData.price === '' ? 0 : Number(itemData.price),
    priority: Number(itemData.priority) as 1 | 2 | 3 | 4 | 5,
    isPurchased: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }
  const user: AppUser = await findOrCreateUser()

  const client = await clientPromise;
  const db = client.db("wishful");

  const { acknowledged, modifiedCount } = await db.collection<WishlistModel>("wishlists").updateOne({
    userId: user.id,
    _id: new ObjectId(wishlistId)
  }, {
    $push: { items: formattedItemData },
    $inc: { itemCount: 1 }
  });

  const wishlistItemToReturn: WishlistItem = {
    id: formattedItemData._id.toString(),
    name: formattedItemData.name,
    description: formattedItemData.description,
    price: formattedItemData.price,
    priority: formattedItemData.priority,
    url: formattedItemData.url,
    notes: formattedItemData.notes,
    isPurchased: formattedItemData.isPurchased
  }

  return acknowledged && modifiedCount > 0 ? wishlistItemToReturn : {} as WishlistItem;
}

export async function markOwnItemAsPurchased(wishlistId: string, itemId: string): Promise<boolean> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }
  const user: AppUser = await findOrCreateUser()

  const client = await clientPromise;
  const db = client.db("wishful");

  const { acknowledged, modifiedCount } = await db.collection<WishlistModel>("wishlists").updateOne({
    userId: user.id,
    _id: new ObjectId(wishlistId),
    "items._id": new ObjectId(itemId)
  }, {
    $set: { 
      "items.$.isPurchased": true,
      "items.$.purchasedBy": user.id,
      "items.$.purchasedAt": new Date()
    }
  });

  return acknowledged && modifiedCount > 0;
}

export async function markSharedItemAsPurchased(wishlistId: string, itemId: string): Promise<boolean> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }
  const user: AppUser = await findOrCreateUser()

  const client = await clientPromise;
  const db = client.db("wishful");

  const { acknowledged, modifiedCount } = await db.collection<WishlistModel>("wishlists").updateOne({
    _id: new ObjectId(wishlistId),
    "items._id": new ObjectId(itemId)
  }, {
    $set: { 
      "items.$.isPurchased": true,
      "items.$.purchasedBy": user.id,
      "items.$.purchasedAt": new Date()
    }
  });

  return acknowledged && modifiedCount > 0;
}

export async function shareWishlist(wishlistId: string, isPublic: boolean) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }
  const user: AppUser = await findOrCreateUser()

  const client = await clientPromise;
  const db = client.db("wishful");

  const { acknowledged, modifiedCount } = await db.collection<WishlistModel>("wishlists").updateOne({
    userId: user.id,
    _id: new ObjectId(wishlistId)
  }, {
    $set: { 
      "isPublic": isPublic,
      "updatedAt": new Date()
    }
  });

  return acknowledged && modifiedCount > 0;
}

export async function markOwnItemAsDeleted(wishlistId: string, itemId: string): Promise<boolean> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/login');
  }
  const user: AppUser = await findOrCreateUser()

  const client = await clientPromise;
  const db = client.db("wishful");

  const { acknowledged, modifiedCount } = await db.collection<WishlistModel>("wishlists").updateOne({
    userId: user.id,
    _id: new ObjectId(wishlistId),
    "items._id": new ObjectId(itemId)
  }, {
    $pull: { 
      items: {
        _id: new ObjectId(itemId)
      },
    },
    $inc: { itemCount: -1 }
  });

  return acknowledged && modifiedCount > 0;
}
