import { Schema, model, models, Types } from "mongoose";

// Interfaces

export interface IPassages {
    content: string
    id: string
    reference: string
    notes: string
}

export interface ICategories {
    name: string
    passageIDs?: Types.ObjectId[]
}

export interface IUser {
    username: string
    password: string
    passages: IPassages[]
    categories: ICategories[]
    language: string
    bibleVersion: string
}


// Sub Schemas

const passageSchema = new Schema<IPassages>({
    content: String,
    id: String,
    reference: String,
    notes: String
})

const categorySchema = new Schema<ICategories>({
    name: String,
    passageIDs: [Schema.Types.ObjectId]
})

// Main Schema

const userSchema = new Schema<IUser>({
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

const User = models.User8 || model('User8', userSchema, "users");

export default User;