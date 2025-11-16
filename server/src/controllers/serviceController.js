const Service = require("../models/Service");

// Create Service
async function createService(req, res) {
  try {
    const service = await Service.create({
      ...req.body,
      providerId: req.user.id,
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Services
async function getServices(req, res) {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get Service by ID
async function getServiceById(req, res) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update Service
async function updateService(req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ message: "Service not found" });

    // Only provider can update
    if (service.providerId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Service
async function deleteService(req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ message: "Service not found" });

    // Only provider can delete
    if (service.providerId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await service.deleteOne();
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
