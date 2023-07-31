import { Schema, model, type Document } from 'mongoose'
import { getRandomColor } from '../helpers/tagColors.js'

export interface ITag extends Document {
  tag: string
  color: string
}

const tagSchema = new Schema<ITag>(
  {
    tag: { type: String, required: true, trim: true, unique: true },
    color: { type: String, required: true, trim: true, default: getRandomColor }
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
