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
  [x: string]: any;
  
  @IsNotEmpty()
  @IsString()
  hostName: string;

  @IsObject()
  @IsNotEmpty()
  translationEventType: Record<string, any>;
  @IsObject()
  @IsNotEmpty()
  translationEventDescription: Record<string, any>;

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
