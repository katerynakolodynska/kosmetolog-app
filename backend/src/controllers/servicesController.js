import mongoose from "mongoose";
import { Service } from "../db/models/service.js";
import { serviceSchema } from "../validation/serviceSchema.js";

export const getAllService = async (req, res) => {
  try {
    const services = await Service.find().populate("specialists");
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, duration, price, specialists, category } =
      req.body;

    const { error } = serviceSchema.validate({
      title,
      description,
      duration,
      price,
      specialists,
      category,
    });

    if (error) return res.status(400).json({ message: error.message });

    const parsedSpecialists = specialists.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const newService = await Service.create({
      title,
      description,
      duration,
      price,
      specialists: parsedSpecialists,
      category,
    });

    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, price, specialists, category } =
      req.body;

    const { error } = serviceSchema.validate({
      title,
      description,
      duration,
      price,
      specialists,
      category,
    });

    if (error) return res.status(400).json({ message: error.message });

    const parsedSpecialists = specialists.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const updated = await Service.findByIdAndUpdate(
      id,
      {
        title,
        description,
        duration,
        price,
        specialists: parsedSpecialists,
        category,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
