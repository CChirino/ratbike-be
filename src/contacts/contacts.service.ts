import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { EmailService } from 'src/email/email.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from './schema/contact.schema';
import { UnexpectedException } from 'src/Unexpected.exception';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    private readonly emailService: EmailService,
  ) {}

  async sendContactEmail(createContactDto: CreateContactDto, user: any) {
    try {
      const { subject, comments } = createContactDto;
      const userEmail = user.email;

      // Guardar los datos de contacto en la base de datos
      const createdContact = new this.contactModel({
        ...createContactDto,
        email: userEmail,
      });
      await createdContact.save();

      // Enviar correo electrónico
      await this.emailService.sendMailContact({
        to: userEmail,
        subject: subject,
        text: comments,
      });
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  findAll() {
    try {
      return `This action returns all contacts`;
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  findOne(id: string) {
    try {
      return `This action returns a #${id} contact`;
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  update(id: string) {
    try {
      return `This action updates a #${id} contact`;
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }

  remove(id: string) {
    try {
      return `This action removes a #${id} contact`;
    } catch (error) {
      throw new UnexpectedException(error);
    }
  }
}
