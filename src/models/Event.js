const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

// Sub-schemas para componentes
const BannerSchema = new mongoose.Schema({
  musicUrl: String,
  videoDesktop: String,
  videoResponsive: String,
  titleFont: String,
  titleSize: String,
  textColor: String,
  subtitleFont: String,
  subtitleSize: String,
  subtextMsg: String,
}, { _id: false });

const CalendarSchema = new mongoose.Schema({
  dateImg: String,
  backgroundStyle: String,
  titleTextColor: String,
  titleTextFont: String,
  titleMsgText: String,
  monthColorText: String,
  monthFontText: String,
  dayweekColorText: String,
  dayweekFontText: String,
  dayColorText1: String,
  dayColorText2: String,
  daySelectedColor: String,
}, { _id: false });

const CarouselSchema = new mongoose.Schema({
  carouselMsg: String,
  images: [String],
  autoPlayInterval: Number,
  backgroundColor: String,
  titleColor: String,
  titleFont: String,
  cardStyle: String,
  durationTransition: Number,
  buttonPrevStyle: String,
  buttonNextStyle: String,
  backgroundImgZoomStyle: String,
  buttonCloseColor: String,
}, { _id: false });

const ChildRestrictionSchema = new mongoose.Schema({
  childrestrictionTitle: String,
  childrestrictionMessage: String,
  titleColor: String,
  titleFont: String,
  cardStyle: String,
  circleStyle: String,
  iconColor: String,
  textColor: String,
  textFont: String,
}, { _id: false });

const CountdownSchema = new mongoose.Schema({
  backgroundColor: String,
  titleTextFont: String,
  titleTextColor: String,
  titleTextMsg: String,
  boxShadowColor: String,
  borderColor: String,
  backgroundColor2: String,
  borderColorCircle: String,
  backgroundColorCircle: String,
  numberColorText1: String,
  numberColorText2: String,
  numberFontText: String,
}, { _id: false });

const DressCodeSchema = new mongoose.Schema({
  titleFont: String,
  titleColor: String,
  titletext: String,
  dressCodeTextWomen: String,
  dressCodeTextMen: String,
  dressCodeIconWomen: String,
  dressCodeIconMen: String,
  iconbackgroundColor: String,
  backgroundColor: String,
  cardStyle: String,
  circleStyle: String,
  titleWomen: String,
  titleMen: String,
  title2Color: String,
  title2Font: String,
  text2Color: String,
  text2Font: String,
}, { _id: false });

const EnvelopeSchema = new mongoose.Schema({
  sealColor: String,
  envelopeColor: String,
  envelopeColorDeg: String,
  innerColor: String,
  cardCouplePhoto: String,
  textureUrl: String,
  envelopeMsg: String,
  envelopeMsgColor: String,
  envelopeFont: String,
  sealImage: String,
  confettiColors: [String],
  overlayColor: String,
  cardBackgroundColor: String,
  accentColor: String,
  textColor: String,
  textDarkColor: String,
  photoBackgroundColor: String,
  titleFont: String,
  initialsCoupleTextColor: String,
  initialsCoupleText: String,
  cardMessageforguestsText: String,
}, { _id: false });

const EventDetailsSchema = new mongoose.Schema({
  detailsTitle: String,
  detailsColor: String,
  detailsFont: String,
  cardStyle: String,
  detailsIcons: String,
  detailIconColor: String,
  detailItemTitleColor: String,
  detailItemTitleFont: String,
  detailItemText1Color: String,
  detailItemText1Font: String,
  detailIcon2Color: String,
  detailsMapsStyle: String,
  detailsMapsTitle: String,
  ceremony: {
    title: String,
    place: String,
    time: String,
  },
  celebration: {
    title: String,
    place: String,
    time: String,
  },
  ceremonyMaps: String,
  celebrationMaps: String,
}, { _id: false });

const MessageSchema = new mongoose.Schema({
  text1: String,
  text2: String,
  groomParents: String,
  brideParents: String,
  font: String,
  colorText1: String,
  colorText2: String,
  colorParents: String,
  textSize: String,
}, { _id: false });

const PresentsSchema = new mongoose.Schema({
  presentTitle: String,
  presentMessage: String,
  titleColor: String,
  titleFont: String,
  cardStyle: String,
  circleStyle: String,
  iconColor: String,
  textColor: String,
  textFont: String,
}, { _id: false });

const ButtonStyleSchema = new mongoose.Schema({
  backgroundColor: String,
  color: String,
  borderColor: String,
  fontFamily: String,
}, { _id: false });

const TextareaStyleSchema = new mongoose.Schema({
  backgroundColor: String,
  colorText: String,
  borderColor: String,
  fontFamily: String,
}, { _id: false });

const RSVPSchema = new mongoose.Schema({
  buttonText: String,
  successMessage: String,
  rejectedMessage: String,
  backgroundColor: String,
  buttonColor: String,
  buttonTextColor: String,
  buttonTextFont: String,
  title2TextColor: String,
  title2TextFont: String,
  title2TextMsg: String,
  title3TextColor: String,
  title3TextFont: String,
  title3TextMsg: String,
  buttonYes1Style: ButtonStyleSchema,
  buttonYes2Style: ButtonStyleSchema,
  buttonNot1Style: ButtonStyleSchema,
  buttonNot2Style: ButtonStyleSchema,
  buttonSendStyle: ButtonStyleSchema,
  buttonYesMsg: String,
  buttonNotMsg: String,
  msgTextColor: String,
  msgTextFont: String,
  msgTextMsg: String,
  textareaStyle: TextareaStyleSchema,
  buttonSendMsg: String,
  confirmationTitleTextColor: String,
  confirmationTitleTextFont: String,
  confirmationTitleTextMsg: String,
  confirmationCircleColor: String,
  confirmationTextFont: String,
  confirmationTextColor: String,
}, { _id: false });

const TimelineSchema = new mongoose.Schema({
  font: String,
  textColor: String,
  backgroundColor: String,
  iconStep1: String,
  iconStep2: String,
  iconStep3: String,
  iconStep4: String,
  iconStep5: String,
  textStep1: String,
  textStep2: String,
  textStep3: String,
  textStep4: String,
  textStep5: String,
  timeStep1: String,
  timeStep2: String,
  timeStep3: String,
  timeStep4: String,
  timeStep5: String,
}, { _id: false });

const GuestSchema = new mongoose.Schema({
  name: String,
  companions: Number,
}, { _id: false });

const GuestManagementSchema = new mongoose.Schema({
  totalGuests: Number,
  guests: [GuestSchema],
}, { _id: false });



// Componentes activados (booleanos)
const ActiveComponentsSchema = new mongoose.Schema({
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

// Schema principal del evento
const EventSchema = new mongoose.Schema({
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
  // Sesión Contacto
  contact: {
    name: String,
    email: String,
    phone: String,
    identification: String,
  },
  // Sesión Detalles Boda
  wedding: {
    coupleNames: String,
    weddingDate: Date,
    weddingTime: String,
  },
  // Componentes activados
  activeComponents: { type: ActiveComponentsSchema, default: {} },
  // Datos de componentes
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

module.exports = mongoose.model('Event', EventSchema);
