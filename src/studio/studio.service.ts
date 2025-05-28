import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient, Prisma, Studio } from '@prisma/client';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';

@Injectable()
export class StudioService {
  private readonly prisma = new PrismaClient();

  // Fetch all studios
  async findAll(): Promise<any[]> {
    try {
      const studios = await this.prisma.studio.findMany();
      
      // Provide default values for missing fields
      const sanitizedStudios = studios.map((studio) => ({
        ...studio,
        openHours: studio.openHours || 'N/A', // Default value for missing openHours
      }));
  
      console.log('Fetched Studios:', sanitizedStudios);
      return sanitizedStudios;
    } catch (error: any) {
      console.error('Error in findAll:', error.message);
      console.error('Stack Trace:', error.stack);
      throw new InternalServerErrorException('Failed to fetch studios');
    }
  }
  
  // Fetch a single studio by ID
  async findOne(id: string): Promise<any> {
    try {
      const studio = await this.prisma.studio.findUnique({
        where: { id },
      });
      if (!studio) {
        throw new NotFoundException('Studio not found');
      }
      return studio;
    } catch (error: any) {
      console.error('Error in findOne:', error);
      throw new InternalServerErrorException('Failed to fetch studio');
    }
  }
  
  // Create a new studio
  async create(createStudioDto: CreateStudioDto): Promise<any> {
    try {
      return this.prisma.studio.create({
        data: {
          name: createStudioDto.name,
          description: createStudioDto.description,
          thumbnail: createStudioDto.thumbnail,
          logo: createStudioDto.logo,
          author: createStudioDto.author,
          imageDescription: createStudioDto.imageDescription,
          imageTitle: createStudioDto.imageTitle, // Include imageTitle
          openDays: createStudioDto.openDays || [], // Default to an empty array if not provided
          openHours: createStudioDto.openHours, // Include openHours
          // Cast navigation data to JSON value if provided
          navigation: createStudioDto.navigation && createStudioDto.navigation.length > 0
            ? (createStudioDto.navigation as unknown as Prisma.JsonValue)
            : undefined,
        },
      });
    } catch (error: any) {
      console.error('Error in create:', error.message);
      throw new InternalServerErrorException('Failed to create studio');
    }
  }
  
  // Update an existing studio
  async update(id: string, updateStudioDto: UpdateStudioDto): Promise<Studio> {
    try {
      const studio = await this.prisma.studio.update({
        where: { id },
        data: {
          name: updateStudioDto.name,
          description: updateStudioDto.description,
          thumbnail: updateStudioDto.thumbnail,
          logo: updateStudioDto.logo,
          author: updateStudioDto.author,
          imageTitle: updateStudioDto.imageTitle,
          imageDescription: updateStudioDto.imageDescription,
          openDays: updateStudioDto.openDays,
          openHours: updateStudioDto.openHours,
          slogan: updateStudioDto.slogan,
          navigation: this.parseJsonField(updateStudioDto.navigation),
          portfolio: this.parseJsonField(updateStudioDto.portfolio),
          fonts: this.parseJsonField(updateStudioDto.fonts),
          artworks: this.parseJsonField(updateStudioDto.artworks),
        },
      });
      return studio;
    } catch (error) {
      console.error('Error in update:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException('Studio not found');
      }
      throw new InternalServerErrorException('Failed to update studio');
    }
  }

  private parseJsonField(field: Prisma.JsonValue | string | undefined): Prisma.JsonValue | undefined {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field.trim());
      } catch (error) {
        console.error('Error parsing JSON field:', error);
        return undefined;
      }
    }
    return field;
  }

  // Delete a studio
  async delete(id: string): Promise<any> {
    try {
      const studio = await this.prisma.studio.delete({
        where: { id },
      });
      return studio;
    } catch (error: any) {
      console.error('Error in delete:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException('Studio not found');
      }
      throw new InternalServerErrorException('Failed to delete studio');
    }
  }
}