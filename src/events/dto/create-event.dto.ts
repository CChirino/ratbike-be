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
  nombrePresentador: string;

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

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  coordinates: string[];

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
