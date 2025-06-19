import { Schema, model } from "mongoose";

// Embedded schema for macros
const MacrosSchema = new Schema({
  calories: { type: Number, required: true, min: 0 },
  protein: { type: Number, required: true, min: 0 },
  carbs: { type: Number, required: true, min: 0 },
  fat: { type: Number, required: true, min: 0 },
}, { _id: false });

// Embedded schema for serving sizes
const ServingLabelSchema = new Schema({
  quantity: { type: Number, required: true, min: 0 },
  calories: { type: Number, required: true, min: 0 },
  protein: { type: Number, required: true, min: 0 },
  carbs: { type: Number, required: true, min: 0 },
  fat: { type: Number, required: true, min: 0 },
}, { _id: false });

// Main food item schema
const FoodItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  macros: {
    type: MacrosSchema,
    default: null,
    validate: {
      validator: function (this: any, value: any) {
        if (this.quantityType === "serving") {
          return value === null;
        }
        return value !== null;
      },
      message: "Macros must be null for serving type and defined for ml/gram",
    },
  },

  quantityType: {
    type: String,
    enum: ["ml", "gram", "serving"],
    default: "gram",
    required: true,
  },

  quantity: {
    type: Number,
    validate: {
      validator: function (this: any, value: number | null) {
        if (this.quantityType === "serving") {
          return value === null;
        }
        return typeof value === "number" && value >= 1;
      },
      message: "Quantity must be null for serving or a positive number for ml/gram",
    },
  },

  servingLabel: {
    type: Schema.Types.Mixed, // <--- Changed from Map to Mixed/Object
    default: null,
    validate: {
      validator: function (this: any, value: any) {
        if (this.quantityType === "serving") {
          return value != null && Object.keys(value).length > 0;
        }
        return value === null;
      },
      message: "servingLabel must be null for ml/gram or a valid object for serving quantityType",
    },
  },

}, { timestamps: true });

// Pre-save hook to handle default quantity
FoodItemSchema.pre("save", function (next) {
  if (this.quantityType === "serving") {
    this.quantity = null;
  } else if (this.quantity == null) {
    this.quantity = 100;
  }
  next();
});

const FoodItem = model("FoodItem", FoodItemSchema);

export default FoodItem;
