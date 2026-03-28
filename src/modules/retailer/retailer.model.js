import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const retailerSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },
        logoUrl: {
            type: String,
            default: null,
            trim: true,
        },
        refreshToken: {
            type: String,
            default: null,
            select: false,
        },
    },
    { timestamps: true }
);

retailerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

retailerSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Retailer = mongoose.model("Retailer", retailerSchema, "retailers");
export default Retailer;