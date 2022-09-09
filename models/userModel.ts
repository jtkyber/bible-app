import { Schema, model, models, Types } from "mongoose";

// Interfaces

export interface IPassages {
    id: string
    notes: string
}

export interface ICategories {
    name: string
    passageIDs: Types.ObjectId[]
}

export interface IUser {
    _id: string;
    username: string
    password: string
    passages: IPassages[]
    categories: ICategories[]
    language: string
    bibleVersion: string
}


// Sub Schemas

const passageSchema = new Schema<IPassages>({
    id: String,
    notes: String
})

const categorySchema = new Schema<ICategories>({
    name: String,
    passageIDs: [Schema.Types.ObjectId]
})

// Main Schema

const userSchema = new Schema<IUser>({
    _id: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    passages: [passageSchema],
    categories: [categorySchema],
    language: String,
    bibleVersion: String
})

const User = models.User6 || model('User6', userSchema, "users");

export default User;