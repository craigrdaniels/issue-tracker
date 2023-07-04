import { Schema, model, type Document } from 'mongoose'

export interface ITag extends Document {
  tag: string
  color: string
}

const tagSchema = new Schema(
  {
    tag: String,
    color: String
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      }
    }
  }
)

export default model<ITag>('Tag', tagSchema, 'tags')
