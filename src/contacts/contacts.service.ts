import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { EmailService } from 'src/email/email.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from './schema/contact.schema';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    private readonly emailService: EmailService,
  ) {}

  async sendContactEmail(createContactDto: CreateContactDto, user: any) {
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
  }

  findAll() {
    return `This action returns all contacts`;
  }

  findOne(id: string) {
    return `This action returns a #${id} contact`;
  }

  update(id: string) {
    return `This action updates a #${id} contact`;
  }

  remove(id: string) {
    return `This action removes a #${id} contact`;
  }
}
