const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: `${process.env.CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    maxlength: 30,
    unique: [true, "Username no disponible"],
    index: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 30
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  profile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    select: false
  },
  about: {
    type: String,
    default: ""
  },
  role: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: "/images/default-profile.jpg"
  },
  avatarPublicId: {
    type: String,
    default: "noimage"
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  resetPasswordLink: {
    data: String,
    default: ""
  }
}, {timestamps: true});

//Encriptar la contraseña del usuario
userSchema.pre("save", async function(next) {
  // En caso de ejecutar otra operación de guardado, no volver a encriptar la contraseña si ésta ya fue encriptada
  if (!this.isModified("password")) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = null;
  next();
});

//Verificar si la contraseña ingresada es correcta
userSchema.methods.checkPassword = async function(providedPassword, realPassword) {
  return await bcrypt.compare(providedPassword, realPassword);
}

// Eliminar los blogs asociados a un usuario cuando éste elimina su cuenta
userSchema.post("remove", async function(doc) {
  try {
    // Buscar los public_ids de las imágenes de los blogs a ser eliminados
    let userPostsIds = [];
    const userPosts = await mongoose.model("Blog").find({postedBy: doc._id}).select("mainPhotoPublicId -_id");
    for(let key in userPosts) {
      userPostsIds.push(userPosts[key].mainPhotoPublicId)
    }

    // Eliminar de cloudinary todas las imágenes asociadas a los blogs que van a ser eliminados
    await cloudinary.v2.api.delete_resources(userPostsIds, {invalidate: true});

    // Eliminar los blogs del usuario
    await mongoose.model("Blog").deleteMany({postedBy: doc._id});
    console.log(`Blogs de ${doc.name} usuario eliminados correctamente`);

  } catch (error) {
    console.log(error)
  }
})

module.exports = mongoose.model("User", userSchema);