import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ required: true })
  id: string; // your custom id (not Mongo _id)

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  thumbnail: string;

  @Prop({ type: Array, default: [] })
  blocks: any[];

  @Prop({ type: Array, default: [] })
  team: any[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
