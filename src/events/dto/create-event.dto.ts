import {
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsObject,
  IsDate,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  hostName: string;

  @IsObject()
  @IsNotEmpty()
  translation: {
    translationEventType: Record<string, any>;
    translationEventDescription: Record<string, any>;
  };

  @IsArray()
  @ArrayNotEmpty()
  presentations: {
    eventDate: string;
    Country: string;
    openHour: string;
    link: string;
    cityLocation: string;
  }[];

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  createdBy: string;

  @IsOptional()
  @IsString()
  delete_at?: string;

  @IsOptional()
  @IsDate()
  delete_date?: Date;

  @IsOptional()
  @IsDate()
  update_at?: Date;
}
