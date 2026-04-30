import { v4 as uuidv4 } from 'uuid';
import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Interface Definitions ────────────────────────────────────────────────────

export interface IButtonStyle {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  fontFamily?: string;
}

export interface ITextareaStyle {
  backgroundColor?: string;
  colorText?: string;
  borderColor?: string;
  fontFamily?: string;
}

export interface IBanner {
  musicUrl?: string;
  videoDesktop?: string;
  videoResponsive?: string;
  titleFont?: string;
  textColor?: string;
  subtitleFont?: string;
  subtextMsg?: string;
}

export interface ICalendar {
  dateImg?: string;
  titleTextColor?: string;
  titleTextFont?: string;
  titleMsgText?: string;
  monthColorText?: string;
  monthFontText?: string;
  dayweekColorText?: string;
  dayweekFontText?: string;
  dayColorText1?: string;
  dayColorText2?: string;
  daySelectedColor?: string;
}

export interface ICarousel {
  carouselMsg?: string;
  images?: string[];
  autoPlayInterval?: number;
  titleColor?: string;
  titleFont?: string;
  buttonCloseColor?: string;
}

export interface IChildRestriction {
  childrestrictionTitle?: string;
  childrestrictionMessage?: string;
  titleColor?: string;
  titleFont?: string;
  iconColor?: string;
  textColor?: string;
  textFont?: string;
  backgroundColorFrom?: string;
  backgroundColorVia?: string;
  backgroundColorTo?: string;
  boderColor?: string;
  backgroundColorIconMoments?: string;
  borderColorIconMoments?: string;
}

export interface ICountdown {
  titleTextFont?: string;
  titleTextColor?: string;
  titleTextMsg?: string;
  boxShadowColor?: string;
  borderColor?: string;
  backgroundColor2?: string;
  borderColorCircle?: string;
  backgroundColorCircle?: string;
  numberColorText1?: string;
  numberColorText2?: string;
  numberFontText?: string;
  backgroundColorFrom?: string;
  backgroundColorVia?: string;
  backgroundColorTo?: string;
  boderColor?: string;
}

export interface IDressCode {
  titleFont?: string;
  titleColor?: string;
  titletext?: string;
  dressCodeTextWomen?: string;
  dressCodeTextMen?: string;
  dressCodeIconWomen?: string;
  dressCodeIconMen?: string;
  iconbackgroundColor?: string;
  titleWomen?: string;
  titleMen?: string;
  title2Color?: string;
  title2Font?: string;
  text2Color?: string;
  text2Font?: string;
  backgroundColorFrom?: string;
  backgroundColorVia?: string;
  backgroundColorTo?: string;
  boderColor?: string;
  backgroundColorIconMoments?: string;
  borderColorIconMoments?: string;
}

export interface IEnvelope {
  sealColor?: string;
  envelopeColor?: string;
  envelopeColorDeg?: string;
  innerColor?: string;
  cardCouplePhoto?: string;
  textureUrl?: string;
  envelopeMsg?: string;
  envelopeMsgColor?: string;
  envelopeFont?: string;
  sealImage?: string;
  confettiColors?: string[];
  overlayColor?: string;
  cardBackgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  textDarkColor?: string;
  photoBackgroundColor?: string;
  titleFont?: string;
  initialsCoupleTextColor?: string;
  initialsCoupleText?: string;
  cardMessageforguestsText?: string;
  backgroundImage?: string;
}

export interface IEventDetails {
  detailsTitle?: string;
  detailsColor?: string;
  detailsFont?: string;
  detailIconColor?: string;
  detailItemTitleColor?: string;
  detailItemTitleFont?: string;
  detailItemText1Color?: string;
  detailItemText1Font?: string;
  detailIcon2Color?: string;
  detailsMapsTitle?: string;
  backgroundColorFrom?: string;
  backgroundColorVia?: string;
  backgroundColorTo?: string;
  boderColor?: string;
  backgroundColorIconMoments?: string;
  borderColorIconMoments?: string;
  ceremony?: { title?: string; place?: string; time?: string };
  celebration?: { title?: string; place?: string; time?: string };
  ceremonyMaps?: string;
  celebrationMaps?: string;
}

export interface IMessage {
  text1?: string;
  text2?: string;
  groomParents?: string;
  brideParents?: string;
  font?: string;
  colorText1?: string;
  colorParents?: string;
  backgroundImage?: string;
  backgroundColor?: string;
}

export interface IPresents {
  presentTitle?: string;
  presentMessage?: string;
  titleColor?: string;
  titleFont?: string;
  iconColor?: string;
  textColor?: string;
  textFont?: string;
  backgroundColorFrom?: string;
  backgroundColorVia?: string;
  backgroundColorTo?: string;
  boderColor?: string;
  backgroundColorIconMoments?: string;
  borderColorIconMoments?: string;
}

export interface IRSVP {
  buttonText?: string;
  successMessage?: string;
  rejectedMessage?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonTextFont?: string;
  title2TextColor?: string;
  title2TextFont?: string;
  title2TextMsg?: string;
  title3TextColor?: string;
  title3TextFont?: string;
  title3TextMsg?: string;
  buttonYes1Style?: IButtonStyle;
  buttonYes2Style?: IButtonStyle;
  buttonNot1Style?: IButtonStyle;
  buttonNot2Style?: IButtonStyle;
  buttonSendStyle?: IButtonStyle;
  buttonYesMsg?: string;
  buttonNotMsg?: string;
  msgTextColor?: string;
  msgTextFont?: string;
  msgTextMsg?: string;
  textareaStyle?: ITextareaStyle;
  buttonSendMsg?: string;
  confirmationTitleTextColor?: string;
  confirmationTitleTextFont?: string;
  confirmationTitleTextMsg?: string;
  confirmationCircleColor?: string;
  confirmationTextFont?: string;
  confirmationTextColor?: string;
}

export interface ITimeline {
  font?: string;
  iconStep1?: string; iconStep2?: string; iconStep3?: string; iconStep4?: string; iconStep5?: string;
  textStep1?: string; textStep2?: string; textStep3?: string; textStep4?: string; textStep5?: string;
  timeStep1?: string; timeStep2?: string; timeStep3?: string; timeStep4?: string; timeStep5?: string;
}

export interface IGuestManagement {
  totalGuests?: number;
  guests?: Array<{ name?: string; companions?: number; urlCard?: string; confirmation?: string; message?: string; confirmationDate?: Date; token?: string }>;
}

export interface IActiveComponents {
  banner: boolean;
  calendar: boolean;
  carousel: boolean;
  childRestriction: boolean;
  countdown: boolean;
  dressCode: boolean;
  envelope: boolean;
  eventDetails: boolean;
  message: boolean;
  presents: boolean;
  rsvp: boolean;
  timeline: boolean;
  guestManagement: boolean;
}

export interface IComponents {
  banner?: IBanner;
  calendar?: ICalendar;
  carousel?: ICarousel;
  childRestriction?: IChildRestriction;
  countdown?: ICountdown;
  dressCode?: IDressCode;
  envelope?: IEnvelope;
  eventDetails?: IEventDetails;
  message?: IMessage;
  presents?: IPresents;
  rsvp?: IRSVP;
  timeline?: ITimeline;
  guestManagement?: IGuestManagement;
}

export interface IEventContact {
  name?: string;
  email?: string;
  phone?: string;
  identification?: string;
  OTPcode?: string;
  OTPexpiration?: Date;
}

export interface IEvent extends Document {
  eventId: string;
  type: 'web' | 'video' | 'card';
  status: 'draft' | 'active' | 'inactive';
  contact?: IEventContact;
  wedding?: {
    coupleNames?: string;
    weddingDate?: Date;
    weddingTime?: string;
  };
  activeComponents: IActiveComponents;
  components: IComponents;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-Schemas ──────────────────────────────────────────────────────────────

const ButtonStyleSchema = new Schema<IButtonStyle>({
  backgroundColor: String,
  color: String,
  borderColor: String,
  fontFamily: String,
}, { _id: false });

const TextareaStyleSchema = new Schema<ITextareaStyle>({
  backgroundColor: String,
  colorText: String,
  borderColor: String,
  fontFamily: String,
}, { _id: false });

const BannerSchema = new Schema<IBanner>({
  musicUrl: String, videoDesktop: String, videoResponsive: String,
  titleFont: String, textColor: String, subtitleFont: String, subtextMsg: String,
}, { _id: false });

const CalendarSchema = new Schema<ICalendar>({
  dateImg: String, titleTextColor: String, titleTextFont: String, titleMsgText: String,
  monthColorText: String, monthFontText: String, dayweekColorText: String, dayweekFontText: String,
  dayColorText1: String, dayColorText2: String, daySelectedColor: String,
}, { _id: false });

const CarouselSchema = new Schema<ICarousel>({
  carouselMsg: String, images: [String], autoPlayInterval: Number,
  titleColor: String, titleFont: String, buttonCloseColor: String,
}, { _id: false });

const ChildRestrictionSchema = new Schema<IChildRestriction>({
  childrestrictionTitle: String, childrestrictionMessage: String, titleColor: String, titleFont: String,
  iconColor: String, textColor: String, textFont: String,
  backgroundColorFrom: String, backgroundColorVia: String, backgroundColorTo: String,
  boderColor: String, backgroundColorIconMoments: String, borderColorIconMoments: String,
}, { _id: false });

const CountdownSchema = new Schema<ICountdown>({
  titleTextFont: String, titleTextColor: String, titleTextMsg: String, boxShadowColor: String,
  borderColor: String, backgroundColor2: String, borderColorCircle: String, backgroundColorCircle: String,
  numberColorText1: String, numberColorText2: String, numberFontText: String,
  backgroundColorFrom: String, backgroundColorVia: String, backgroundColorTo: String, boderColor: String,
}, { _id: false });

const DressCodeSchema = new Schema<IDressCode>({
  titleFont: String, titleColor: String, titletext: String,
  dressCodeTextWomen: String, dressCodeTextMen: String, dressCodeIconWomen: String, dressCodeIconMen: String,
  iconbackgroundColor: String, titleWomen: String, titleMen: String,
  title2Color: String, title2Font: String, text2Color: String, text2Font: String,
  backgroundColorFrom: String, backgroundColorVia: String, backgroundColorTo: String,
  boderColor: String, backgroundColorIconMoments: String, borderColorIconMoments: String,
}, { _id: false });

const EnvelopeSchema = new Schema<IEnvelope>({
  sealColor: String, envelopeColor: String, envelopeColorDeg: String, innerColor: String,
  cardCouplePhoto: String, textureUrl: String, envelopeMsg: String, envelopeMsgColor: String,
  envelopeFont: String, sealImage: String, confettiColors: [String], overlayColor: String,
  cardBackgroundColor: String, accentColor: String, textColor: String, textDarkColor: String,
  photoBackgroundColor: String, titleFont: String, initialsCoupleTextColor: String,
  initialsCoupleText: String, cardMessageforguestsText: String, backgroundImage: String,
}, { _id: false });

const EventDetailsSchema = new Schema<IEventDetails>({
  detailsTitle: String, detailsColor: String, detailsFont: String, detailIconColor: String,
  detailItemTitleColor: String, detailItemTitleFont: String, detailItemText1Color: String,
  detailItemText1Font: String, detailIcon2Color: String, detailsMapsTitle: String,
  backgroundColorFrom: String, backgroundColorVia: String, backgroundColorTo: String,
  boderColor: String, backgroundColorIconMoments: String, borderColorIconMoments: String,
  ceremony: { title: String, place: String, time: String },
  celebration: { title: String, place: String, time: String },
  ceremonyMaps: String, celebrationMaps: String,
}, { _id: false });

const MessageSchema = new Schema<IMessage>({
  text1: String, text2: String, groomParents: String, brideParents: String, font: String,
  colorText1: String, colorParents: String, backgroundImage: String, backgroundColor: String,
}, { _id: false });

const PresentsSchema = new Schema<IPresents>({
  presentTitle: String, presentMessage: String, titleColor: String, titleFont: String,
  iconColor: String, textColor: String, textFont: String,
  backgroundColorFrom: String, backgroundColorVia: String, backgroundColorTo: String,
  boderColor: String, backgroundColorIconMoments: String, borderColorIconMoments: String,
}, { _id: false });

const RSVPSchema = new Schema<IRSVP>({
  buttonText: String, successMessage: String, rejectedMessage: String,
  buttonColor: String, buttonTextColor: String, buttonTextFont: String,
  title2TextColor: String, title2TextFont: String, title2TextMsg: String,
  title3TextColor: String, title3TextFont: String, title3TextMsg: String,
  buttonYes1Style: ButtonStyleSchema, buttonYes2Style: ButtonStyleSchema,
  buttonNot1Style: ButtonStyleSchema, buttonNot2Style: ButtonStyleSchema,
  buttonSendStyle: ButtonStyleSchema,
  buttonYesMsg: String, buttonNotMsg: String,
  msgTextColor: String, msgTextFont: String, msgTextMsg: String,
  textareaStyle: TextareaStyleSchema,
  buttonSendMsg: String,
  confirmationTitleTextColor: String, confirmationTitleTextFont: String, confirmationTitleTextMsg: String,
  confirmationCircleColor: String, confirmationTextFont: String, confirmationTextColor: String,
}, { _id: false });

const TimelineSchema = new Schema<ITimeline>({
  font: String,
  iconStep1: String, iconStep2: String, iconStep3: String, iconStep4: String, iconStep5: String,
  textStep1: String, textStep2: String, textStep3: String, textStep4: String, textStep5: String,
  timeStep1: String, timeStep2: String, timeStep3: String, timeStep4: String, timeStep5: String,
}, { _id: false });

const GuestManagementSchema = new Schema<IGuestManagement>({
  totalGuests: Number,
  guests: [{ name: String, companions: Number, urlCard: String, confirmation: String, message: String, confirmationDate: Date, token: String }],
}, { _id: false });

const ActiveComponentsSchema = new Schema<IActiveComponents>({
  banner: { type: Boolean, default: false },
  calendar: { type: Boolean, default: false },
  carousel: { type: Boolean, default: false },
  childRestriction: { type: Boolean, default: false },
  countdown: { type: Boolean, default: false },
  dressCode: { type: Boolean, default: false },
  envelope: { type: Boolean, default: false },
  eventDetails: { type: Boolean, default: false },
  message: { type: Boolean, default: false },
  presents: { type: Boolean, default: false },
  rsvp: { type: Boolean, default: false },
  timeline: { type: Boolean, default: false },
  guestManagement: { type: Boolean, default: false },
}, { _id: false });

// ─── Main Event Schema ────────────────────────────────────────────────────────

const EventSchema = new Schema<IEvent>({
  eventId: {
    type: String,
    unique: true,
    default: () => uuidv4(),
  },
  type: {
    type: String,
    enum: ['web', 'video', 'card'],
    default: 'web',
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'draft',
  },
  contact: {
    name: String,
    email: String,
    phone: String,
    identification: String,
    OTPcode: String,
    OTPexpiration: Date,
  },
  wedding: {
    coupleNames: String,
    weddingDate: Date,
    weddingTime: String,
  },
  activeComponents: { type: ActiveComponentsSchema, default: {} },
  components: {
    banner: BannerSchema,
    calendar: CalendarSchema,
    carousel: CarouselSchema,
    childRestriction: ChildRestrictionSchema,
    countdown: CountdownSchema,
    dressCode: DressCodeSchema,
    envelope: EnvelopeSchema,
    eventDetails: EventDetailsSchema,
    message: MessageSchema,
    presents: PresentsSchema,
    rsvp: RSVPSchema,
    timeline: TimelineSchema,
    guestManagement: GuestManagementSchema,
  },
}, {
  timestamps: true,
});

const Event: Model<IEvent> = mongoose.model<IEvent>('Event', EventSchema);

export default Event;
