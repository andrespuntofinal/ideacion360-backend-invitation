const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /api/events - Listar todos los eventos
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const events = await Event.find(filter)
      .select('-components')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/events/:id - Obtener evento por ID
router.get('/:id', async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { $or: [{ eventId: req.params.id }, { _id: req.params.id }] } : { eventId: req.params.id };
    const event = await Event.findOne(query);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/events - Crear evento
router.post('/', async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      eventId: uuidv4(),
    };
    const event = new Event(eventData);
    await event.save();
    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: event,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/events/:id - Actualizar evento
router.put('/:id', async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { $or: [{ eventId: req.params.id }, { _id: req.params.id }] } : { eventId: req.params.id };
    const event = await Event.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.json({ success: true, message: 'Evento actualizado', data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/events/:id - Eliminar evento
router.delete('/:id', async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { $or: [{ eventId: req.params.id }, { _id: req.params.id }] } : { eventId: req.params.id };
    const event = await Event.findOneAndDelete(query);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }

    let coupleNames = event.wedding?.coupleNames || 'event';
    coupleNames = coupleNames.replace(/[^a-zA-Z0-9_]/g, '_');
    const folderName = `ideación360-wedding-invitation/${coupleNames}_${event.eventId}`;

    try {
      await cloudinary.api.delete_resources_by_prefix(folderName + '/');
      await cloudinary.api.delete_folder(folderName);
    } catch (err) {
      console.error('Error deleting cloudinary folder:', err);
    }

    res.json({ success: true, message: 'Evento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/events/:id/components - Obtener componentes de un evento
router.get('/:id/components', async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { $or: [{ eventId: req.params.id }, { _id: req.params.id }] } : { eventId: req.params.id };
    const event = await Event.findOne(query).select('eventId activeComponents components');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/events/:id/components/:type - Actualizar componente específico
router.put('/:id/components/:type', async (req, res) => {
  try {
    const { id, type } = req.params;
    const validComponents = [
      'banner', 'calendar', 'carousel', 'childRestriction', 'countdown',
      'dressCode', 'envelope', 'eventDetails', 'message', 'presents',
      'rsvp', 'timeline', 'guestManagement', 'generalParams'
    ];

    if (!validComponents.includes(type)) {
      return res.status(400).json({ success: false, message: 'Tipo de componente inválido' });
    }

    const updateData = {};
    updateData[`components.${type}`] = req.body;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ eventId: id }, { _id: id }] } : { eventId: id };

    const event = await Event.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }

    res.json({
      success: true,
      message: `Componente ${type} actualizado`,
      data: event.components[type],
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/events/:id/components/upload - Subir archivos para un componente
router.post('/:id/components/upload', upload.any(), async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { $or: [{ eventId: req.params.id }, { _id: req.params.id }] } : { eventId: req.params.id };
    const event = await Event.findOne(query);
    if (!event) return res.status(404).json({ success: false, message: 'Evento no encontrado' });

    if (!req.files || req.files.length === 0) {
      return res.json({ success: true, data: {} });
    }

    let coupleNames = event.wedding?.coupleNames || 'event';
    coupleNames = coupleNames.replace(/[^a-zA-Z0-9_]/g, '_');
    const folderName = `ideación360-wedding-invitation/${coupleNames}_${event.eventId}`;

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: folderName, resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve({ fieldname: file.fieldname, url: result.secure_url });
          }
        );
        stream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    const urlsMap = {};
    results.forEach(val => {
      urlsMap[val.fieldname] = val.url;
    });

    res.json({ success: true, data: urlsMap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/events/:id/components/:type - Eliminar datos de componente
router.delete('/:id/components/:type', async (req, res) => {
  try {
    const { id, type } = req.params;
    const updateData = {};
    updateData[`components.${type}`] = null;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ eventId: id }, { _id: id }] } : { eventId: id };

    const event = await Event.findOneAndUpdate(
      query,
      { $unset: updateData },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }

    res.json({ success: true, message: `Componente ${type} eliminado` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
