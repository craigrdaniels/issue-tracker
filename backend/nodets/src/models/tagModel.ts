import { Schema, model, type Document } from 'mongoose'
import { getRandomColor } from '../helpers/tagColors.js'

export interface ITag extends Document {
  tag: string
  color: string
}

const tagSchema = new Schema(
  {
    tag: String,
    color: { type: String, default: getRandomColor }
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
