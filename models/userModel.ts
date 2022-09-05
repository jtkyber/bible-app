import { Schema, model, models, Types } from "mongoose";

// Interfaces

export interface IPassages {
    content: string,
    book: string,
    chapter: number,
    verseStart: number,
    verseEnd: number
}

export interface ICategories {
    name: string,
    passageIDs: Types.ObjectId[]
}

export interface IUser {
    username: string,
    password: string,
    passages: IPassages[],
    categories: ICategories[],
    language: string,
    bibleVersion: string
}


// Sub Schemas

const passageSchema = new Schema<IPassages>({
    content: String,
    book: String,
    chapter: Number,
    verseStart: Number,
    verseEnd: Number
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

const User = models.User1 || model('User1', userSchema, "users");

export default User;