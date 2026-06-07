import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import multer from 'multer';
import { UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Event from '../models/Event';
import cloudinary from '../config/cloudinary';
import { sendRSVPEmail } from '../services/emailService';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/** Helper: build a MongoDB query that resolves either _id, eventId, or token */
const buildQuery = (id: string) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  if (isObjectId) {
    return { $or: [{ eventId: id }, { _id: id }] };
  }
  if (id.length < 36) {
    return { $or: [{ eventId: id }, { 'components.guestManagement.guests.token': id }] };
  }
  return { eventId: id };
};

// ─── GET /api/events ─────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', status, type } = req.query as Record<string, string | undefined>;
    const filter: Record<string, string> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// ─── GET /api/events/card/:token ───────────────────────────────────────────
router.get('/card/:token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    
    // Find the event that has a guest with this token
    const event = await Event.findOne({
      'components.guestManagement.guests.token': token
    });

    if (!event) {
      res.status(404).json({ success: false, message: 'Invitación no encontrada' });
      return;
    }

    const guest = event.components?.guestManagement?.guests?.find((g: any) => g.token === token);
    
    if (!guest) {
      res.status(404).json({ success: false, message: 'Invitado no encontrado' });
      return;
    }

    res.json({ success: true, data: { event, guest } });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// ─── GET /api/events/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne(buildQuery(req.params.id));
    if (!event) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// ─── POST /api/events ────────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData = { ...req.body, eventId: uuidv4() };
    const event = new Event(eventData);
    await event.save();
    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: event,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// Helper to get VITE_FRONT_URL dynamically from frontend environment files
const getFrontUrl = (): string => {
  try {
    // 1. Check process.env first
    if (process.env.VITE_FRONT_URL) {
      return process.env.VITE_FRONT_URL.replace(/\/$/, '');
    }

    const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
    
    // 2. Check path relative to __dirname (handles src/routes and dist/routes)
    let envPath = path.resolve(__dirname, '../../../frontend', envFile);
    if (fs.existsSync(envPath)) {
      const envConfig = dotenv.parse(fs.readFileSync(envPath));
      if (envConfig.VITE_FRONT_URL) {
        return envConfig.VITE_FRONT_URL.replace(/\/$/, '');
      }
    }

    // 3. Check path relative to process.cwd()
    envPath = path.resolve(process.cwd(), '../frontend', envFile);
    if (fs.existsSync(envPath)) {
      const envConfig = dotenv.parse(fs.readFileSync(envPath));
      if (envConfig.VITE_FRONT_URL) {
        return envConfig.VITE_FRONT_URL.replace(/\/$/, '');
      }
    }

    envPath = path.resolve(process.cwd(), 'frontend', envFile);
    if (fs.existsSync(envPath)) {
      const envConfig = dotenv.parse(fs.readFileSync(envPath));
      if (envConfig.VITE_FRONT_URL) {
        return envConfig.VITE_FRONT_URL.replace(/\/$/, '');
      }
    }
  } catch (err) {
    console.error('Error reading frontend env file:', err);
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://ideacion360.com'
    : 'http://localhost:5173';
};

// ─── PUT /api/events/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const query = buildQuery(req.params.id);
    const currentEvent = await Event.findOne(query);
    if (!currentEvent) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }

    const updateData = { ...req.body };

    // If status is completed/concluded (or is being set to it), ensure review URL is set/updated
    const targetStatus = updateData.status || currentEvent.status;
    if (targetStatus === 'completed' || targetStatus === 'concluded') {
      const reviewUrl = `wedding/reviews/${currentEvent.eventId}`;
      updateData.reviews = {
        ...currentEvent.reviews,
        ...updateData.reviews,
        url: reviewUrl,
      };
    }

    const event = await Event.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Evento actualizado', data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

// ─── POST /api/events/:id/reviews ──────────────────────────────────────────
router.post('/:id/reviews', async (req: Request, res: Response): Promise<void> => {
  try {
    const { comments } = req.body;
    const event = await Event.findOneAndUpdate(
      buildQuery(req.params.id),
      { $set: { 'reviews.comments': comments } },
      { new: true }
    );
    if (!event) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }
    res.json({ success: true, message: 'Comentario guardado exitosamente', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// ─── DELETE /api/events/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedDoc = await Event.findOneAndDelete(buildQuery(req.params.id)).lean();
    if (!deletedDoc) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }
    const event = deletedDoc as unknown as { wedding?: { coupleNames?: string }; eventId: string };

    let coupleNames = event.wedding?.coupleNames || 'event';
    coupleNames = coupleNames.replace(/[^a-zA-Z0-9_]/g, '_');
    const folderName = `ideación360-wedding-invitation/${coupleNames}_${event.eventId}`;

    try {
      await cloudinary.api.delete_resources_by_prefix(folderName + '/');
      await cloudinary.api.delete_folder(folderName);
    } catch (err) {
      console.error('Error deleting Cloudinary folder:', err);
    }

    res.json({ success: true, message: 'Evento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// ─── GET /api/events/:id/components ─────────────────────────────────────────
router.get('/:id/components', async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne(buildQuery(req.params.id))
      .select('eventId activeComponents components');
    if (!event) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// ─── PUT /api/events/:id/components/:type ───────────────────────────────────
router.put('/:id/components/:type', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, type } = req.params;
    const validComponents = [
      'banner', 'calendar', 'carousel', 'childRestriction', 'countdown',
      'dressCode', 'envelope', 'eventDetails', 'message', 'presents',
      'rsvp', 'timeline', 'guestManagement', 'generalParams',
    ];

    if (!validComponents.includes(type)) {
      res.status(400).json({ success: false, message: 'Tipo de componente inválido' });
      return;
    }

    const updateData: Record<string, unknown> = {};
    updateData[`components.${type}`] = req.body;

    const event = await Event.findOneAndUpdate(
      buildQuery(id),
      { $set: updateData },
      { new: true }
    );

    if (!event) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }

    res.json({
      success: true,
      message: `Componente ${type} actualizado`,
      data: (event.components as Record<string, unknown>)[type],
    });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

const extractCloudinaryFolder = (url: string | undefined): string | null => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return null;
  }
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return null;
  
  let pathStr = url.substring(uploadIndex + 8);
  const versionMatch = pathStr.match(/^v\d+\//);
  if (versionMatch) {
    pathStr = pathStr.substring(versionMatch[0].length);
  }
  
  const lastSlashIndex = pathStr.lastIndexOf('/');
  if (lastSlashIndex === -1) return null;
  
  try {
    return decodeURIComponent(pathStr.substring(0, lastSlashIndex));
  } catch (e) {
    return pathStr.substring(0, lastSlashIndex);
  }
};

const findExistingCloudinaryFolder = (event: any): string | null => {
  let folder = extractCloudinaryFolder(event.components?.envelope?.cardCouplePhoto);
  if (folder) return folder;

  folder = extractCloudinaryFolder(event.components?.calendar?.dateImg);
  if (folder) return folder;

  folder = extractCloudinaryFolder(event.components?.banner?.musicUrl);
  if (folder) return folder;

  const carouselImages = event.components?.carousel?.images;
  if (Array.isArray(carouselImages)) {
    for (const img of carouselImages) {
      folder = extractCloudinaryFolder(img);
      if (folder) return folder;
    }
  }

  return null;
};

// ─── POST /api/events/:id/components/upload ──────────────────────────────────
router.post('/:id/components/upload', upload.any(), async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne(buildQuery(req.params.id));
    if (!event) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      res.json({ success: true, data: {} });
      return;
    }

    let folderName = findExistingCloudinaryFolder(event);
    if (!folderName) {
      let coupleNames = event.wedding?.coupleNames || 'event';
      coupleNames = coupleNames.replace(/[^a-zA-Z0-9_]/g, '_');
      folderName = `ideación360-wedding-invitation/${coupleNames}_${event.eventId}`;
    }

    const uploadPromises = files.map((file) => {
      return new Promise<{ fieldname: string; url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: folderName, resource_type: 'auto' },
          (error, result: UploadApiResponse | undefined) => {
            if (error || !result) reject(error ?? new Error('Upload failed'));
            else resolve({ fieldname: file.fieldname, url: result.secure_url });
          }
        );
        stream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    const urlsMap: Record<string, string> = {};
    results.forEach(({ fieldname, url }) => {
      urlsMap[fieldname] = url;
    });

    res.json({ success: true, data: urlsMap });
  } catch (error) {
    try {
      const fs = require('fs');
      const path = require('path');
      fs.appendFileSync(
        path.join(__dirname, '../../backend_errors.log'),
        `[${new Date().toISOString()}] Error uploading files for event ${req.params.id}:\n${(error as Error).stack || error}\n\n`
      );
    } catch (fsErr) {
      console.error('Failed to write log:', fsErr);
    }
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// ─── DELETE /api/events/:id/components/:type ─────────────────────────────────
router.delete('/:id/components/:type', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, type } = req.params;
    const updateData: Record<string, null> = {};
    updateData[`components.${type}`] = null;

    const event = await Event.findOneAndUpdate(
      buildQuery(id),
      { $unset: updateData },
      { new: true }
    );

    if (!event) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }

    res.json({ success: true, message: `Componente ${type} eliminado` });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});

router.post('/:id/rsvp', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { message, attendance, guestName, companions } = req.body;

    const event = await Event.findOne(buildQuery(id));
    if (!event) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }

    if (event.components && event.components.guestManagement && event.components.guestManagement.guests) {
      let guestIndex = -1;
      
      if (id.length < 36) {
        guestIndex = event.components.guestManagement.guests.findIndex((g) => g.token === id);
      }

      if (guestIndex === -1) {
        guestIndex = event.components.guestManagement.guests.findIndex((g) => g.name === guestName);
      }

      const now = new Date();

      if (guestIndex !== -1) {
        event.components.guestManagement.guests[guestIndex].confirmation = attendance;
        event.components.guestManagement.guests[guestIndex].message = message;
        event.components.guestManagement.guests[guestIndex].confirmationDate = now;
      } else {
        event.components.guestManagement.guests.push({
          name: guestName,
          companions: Number(companions) || 0,
          confirmation: attendance,
          message: message,
          confirmationDate: now
        });
      }
      event.markModified('components.guestManagement.guests');
      await event.save();
    }

    const recipientEmail = event.contact?.email;
    if (!recipientEmail) {
      res.status(400).json({ success: false, message: 'El evento no tiene un email de contacto configurado' });
      return;
    }

    const coupleNames = event.wedding?.coupleNames || 'los novios';
    
    const date = new Date().toLocaleString('es-CO', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Bogota'
    }).replace(/de 202/, 'de 202'); // Simple formatting to match requested style like "Abril 06 de 2026 a las 5:30 PM"
    
    // Capitalize month
    const formattedDate = date.charAt(0).toUpperCase() + date.slice(1).replace(', ', ' a las ');

    await sendRSVPEmail({
      guestName,
      coupleNames,
      message,
      companions,
      attendance,
      date: formattedDate,
      recipientEmail
    });

    res.json({ success: true, message: 'Confirmación y correo enviados correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

export default router;
