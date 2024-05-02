import { IsNotEmpty } from 'class-validator';

export class CreateSkillDto {
  [x: string]: any;
  @IsNotEmpty()
  translationNameSkill: Record<string, any>;
}
