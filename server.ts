import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import {
  generateToken,
  authenticateToken,
  requireRole,
  requireTempleOwnership,
  requireContributorAccess,
  AuthenticatedRequest,
} from './server/auth';
import {
  aiTempleSearch,
  aiMatchPriestToVacancy,
  aiDetectDuplicateTemple,
  aiTempleAssistant,
} from './server/gemini';
import { Application, ContributorProposal, Temple, Vacancy, TempleClaimRequest, AppNotification, AuditLog } from './src/types';
import { filterTemplesByLocationQuery, haversineKm } from './server/locationSearch';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'TempleConnect API' });
  });

  // ----------------------------------------------------
  // 1. AUTHENTICATION & DEMO CREDENTIALS
  // ----------------------------------------------------

  // Provide list of pre-configured demo users for testing all roles
  app.get('/api/auth/demo-users', (_req, res) => {
    const demoAccounts = [
      {
        role: 'user',
        label: 'Devotee / General User',
        name: 'Ramesh Kumar',
        email: 'devotee@templeconnect.org',
        password: 'password123',
        description: 'Explore temples, search by radius/GPS, ask temple AI assistant, add missing temples.',
      },
      {
        role: 'admin',
        label: 'Temple Admin (Meenakshi Amman)',
        name: 'Sundaram Gurukkal (Trustee)',
        email: 'admin@meenakshi.org',
        password: 'password123',
        templeName: 'Arulmigu Meenakshi Sundareswarar Temple',
        description: 'Manage temple data, post vacancies, oversee applicants, grant/revoke contributor access, approve updates.',
      },
      {
        role: 'admin',
        label: 'Temple Admin (Somnath Jyotirlinga)',
        name: 'Dharmendra Shastri (Board)',
        email: 'admin@somnath.org',
        password: 'password123',
        templeName: 'Shree Somnath Jyotirlinga Temple',
        description: 'Manage Somnath vacancy, review Priest applications, shortlist candidates with AI matching.',
      },
      {
        role: 'priest',
        label: 'Priest / Job Seeker (Sharma)',
        name: 'Pandit Rajesh Sharma',
        email: 'priest.sharma@vedic.org',
        password: 'password123',
        description: '12 yrs experience (Rigveda). Shortlisted for Somnath. Verified contributor for Meenakshi Temple.',
      },
      {
        role: 'priest',
        label: 'Priest / Job Seeker (Venkatachari)',
        name: 'Shri Venkatachari Swami',
        email: 'priest.venkat@vedic.org',
        password: 'password123',
        description: '16 yrs experience (Pancharatra Agama). Search temple vacancies, apply, track status.',
      },
    ];
    res.json(demoAccounts);
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, role, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find existing user or check demo credentials
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role)
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found for this role.' });
    }

    const token = generateToken(user);
    res.json({
      user,
      token,
      message: `Signed in as ${user.name} (${user.role.toUpperCase()})`,
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, role, phone, templeName, city } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required.' });
    }

    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const userId = `user-${Date.now()}`;
    let newTempleId: string | undefined = undefined;

    // If new admin registers with a new temple
    if (role === 'admin' && templeName) {
      newTempleId = `temple-${Date.now()}`;
      const newTemple: Temple = {
        id: newTempleId,
        name: templeName,
        deity: req.body.deity || 'Presiding Deity',
        city: city || 'Unknown City',
        state: req.body.state || 'India',
        address: req.body.address || `${city || 'City Center'}`,
        lat: req.body.lat ? parseFloat(req.body.lat) : 12.9716,
        lng: req.body.lng ? parseFloat(req.body.lng) : 77.5946,
        description: req.body.description || 'Sacred temple managed through TempleConnect.',
        history: req.body.history || 'Ancient shrine with rich cultural heritage.',
        timings: {
          morning: '06:00 AM – 12:00 PM',
          evening: '04:30 PM – 08:30 PM',
          notes: 'Special archana during morning and evening hours.',
        },
        pujas: [
          { id: `p-${Date.now()}-1`, name: 'Daily Nitya Puja', timing: '07:00 AM', significance: 'Morning archana', fee: 'Free' },
          { id: `p-${Date.now()}-2`, name: 'Sandhya Arati', timing: '06:30 PM', significance: 'Evening deepam', fee: 'Free' },
        ],
        contact: {
          phone: phone || '+91 90000 00000',
          email: email,
        },
        photos: [
          'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
        ],
        status: 'pending_verification',
        adminId: userId,
        claimedBy: userId,
        claimStatus: 'claimed',
        contributors: [],
        events: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.temples.push(newTemple);
    }

    let priestProfileId: string | undefined = undefined;
    if (role === 'priest') {
      priestProfileId = `priest-profile-${Date.now()}`;
      db.priestProfiles.push({
        id: priestProfileId,
        userId: userId,
        fullName: name,
        experienceYears: req.body.experienceYears ? parseInt(req.body.experienceYears, 10) : 1,
        previousTemples: [],
        purohithamSkills: req.body.skills || ['Veda Parayanam', 'Nitya Puja'],
        vedaTradition: req.body.vedaTradition || 'Rigveda / Yajurveda',
        trainingQualifications: req.body.qualifications || 'Veda Pathashala Trained',
        languages: req.body.languages || ['Sanskrit', 'Hindi'],
        achievements: req.body.achievements || '',
        bio: req.body.bio || 'Devout Purohit dedicated to traditional worship and rituals.',
        location: city || 'India',
        phone: phone || '',
        email: email,
        shareContactConsent: true,
        availableForRelocation: true,
        expectedRemuneration: '₹30,000 – ₹45,000 / month',
      });
    }

    const newUser = {
      id: userId,
      email,
      role: role as any,
      name,
      phone,
      templeId: newTempleId,
      priestProfileId,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    const token = generateToken(newUser);

    res.json({
      user: newUser,
      token,
      message: 'Account successfully registered.',
    });
  });

  app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  // ----------------------------------------------------
  // 2. USER PORTAL & TEMPLE DIRECTORY (PUBLIC / READ)
  // ----------------------------------------------------

  app.get('/api/temples', (req, res) => {
    const { city, lat, lng, radiusKm, search, deity, sort } = req.query;

    const userLat = lat ? parseFloat(lat as string) : undefined;
    const userLng = lng ? parseFloat(lng as string) : undefined;
    const maxRadius = radiusKm ? parseFloat(radiusKm as string) : undefined;
    const userCityName = typeof city === 'string' && city.trim() !== '' && city !== 'All Cities' ? city : undefined;

    let results = [...db.temples];
    let locationFilterInfo: any = null;

    // 1. Natural Language or Keyword Search with Location & Proximity intelligence
    if (search && typeof search === 'string' && search.trim() !== '') {
      const locResult = filterTemplesByLocationQuery(
        results,
        search,
        userLat,
        userLng,
        userCityName
      );
      results = locResult.temples;
      if (locResult.isLocationFilterActive) {
        locationFilterInfo = {
          isActive: true,
          explanation: locResult.parsed.explanation,
          radiusKm: locResult.parsed.radiusKm,
          center: locResult.parsed.centerLocation,
        };
      }
    } else {
      // 2. No search string, but user location provided: tag real distances and sort
      if (userLat !== undefined && userLng !== undefined && !isNaN(userLat) && !isNaN(userLng)) {
        results = results.map((t) => {
          const dist = haversineKm(userLat, userLng, t.lat, t.lng);
          return { ...t, distanceKm: dist };
        });

        // Filter by radius if explicitly selected in filter dropdown
        if (maxRadius && !isNaN(maxRadius) && maxRadius > 0) {
          results = results.filter((t) => (t.distanceKm !== undefined ? t.distanceKm <= maxRadius : true));
        }

        // Sort by distance by default or if requested
        if (sort === 'distance' || !sort) {
          results.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
        }
      }
    }

    // 3. City filter (only if not already specifically overridden by a named location in search)
    if (userCityName && !locationFilterInfo?.center) {
      results = results.filter((t) => t.city.toLowerCase().includes(userCityName.toLowerCase()));
    }

    // 4. Explicit Deity filter
    if (deity && typeof deity === 'string' && deity.trim() !== '') {
      results = results.filter((t) => t.deity.toLowerCase().includes(deity.toLowerCase()));
    }

    // 5. Name sort if requested
    if (sort === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({
      temples: results,
      total: results.length,
      userLocation: userLat && userLng ? { lat: userLat, lng: userLng } : null,
      locationFilter: locationFilterInfo,
    });
  });

  app.get('/api/temples/:id', (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.id);
    if (!temple) {
      return res.status(404).json({ error: 'Temple not found' });
    }
    res.json(temple);
  });

  // Add missing temple (Community contribution)
  app.post('/api/temples', async (req, res) => {
    const { name, deity, city, state, address, lat, lng, description, timings, pujas, contact, photos } = req.body;

    if (!name || !city || !deity) {
      return res.status(400).json({ error: 'Name, deity, and city are mandatory.' });
    }

    // Run duplicate detection
    const dupCheck = await aiDetectDuplicateTemple({
      name,
      deity,
      city,
      address: address || city,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
    });

    const newTemple: Temple = {
      id: `temple-comm-${Date.now()}`,
      name,
      deity,
      city,
      state: state || 'India',
      address: address || `${city}, ${state || 'India'}`,
      lat: lat ? parseFloat(lat) : 13.0827,
      lng: lng ? parseFloat(lng) : 80.2707,
      description: description || 'Community contributed heritage temple listing.',
      history: req.body.history || 'Information contributed by devotees.',
      timings: timings || {
        morning: '06:00 AM – 12:00 PM',
        evening: '04:00 PM – 08:30 PM',
      },
      pujas: Array.isArray(pujas) ? pujas : [
        { id: `p-${Date.now()}`, name: 'Daily Archana', timing: 'Morning & Evening', significance: 'General darshan seva', fee: 'Free' }
      ],
      contact: contact || { phone: '', email: '' },
      photos: Array.isArray(photos) && photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
      ],
      status: 'community_added', // Initial status
      claimStatus: 'unclaimed',
      contributors: [],
      events: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.temples.push(newTemple);

    // Notify any admins about new temple addition
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: 'user-admin-meenakshi', // Demo broadcast
      type: 'nearby_event',
      title: 'New Temple Contributed to Directory',
      message: `"${name}" in ${city} has been added by the community for verification.`,
      link: `/temples/${newTemple.id}`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      temple: newTemple,
      duplicateWarning: dupCheck.isDuplicateLikely ? dupCheck : null,
      message: 'Temple successfully contributed! Status set to Community Added.',
    });
  });

  // Submit Claim Request for a temple
  app.post('/api/temples/:id/claim', authenticateToken, (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.id === req.params.id);
    if (!temple) {
      return res.status(404).json({ error: 'Temple not found' });
    }

    const { officialRole, phone, email, verificationDocs } = req.body;
    if (!officialRole || !verificationDocs) {
      return res.status(400).json({ error: 'Official role and verification documents are required.' });
    }

    const claim: TempleClaimRequest = {
      id: `claim-${Date.now()}`,
      templeId: temple.id,
      templeName: temple.name,
      applicantUserId: req.user!.id,
      applicantName: req.user!.name,
      officialRole,
      phone: phone || req.user!.phone || '',
      email: email || req.user!.email,
      verificationDocs,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    temple.claimStatus = 'claim_pending';
    db.claimRequests.push(claim);

    // Audit log
    db.auditLogs.push({
      id: `audit-${Date.now()}`,
      templeId: temple.id,
      performedBy: req.user!.name,
      action: 'Submit Claim Request',
      details: `Claim request submitted by ${req.user!.name} (${officialRole}).`,
      timestamp: new Date().toISOString(),
    });

    res.json({
      claim,
      message: 'Claim request submitted for administrative review. Thank you for helping verify our heritage.',
    });
  });

  // ----------------------------------------------------
  // 3. ADMIN PORTAL (STRICTLY AUTHORIZED TO MANAGED TEMPLE)
  // ----------------------------------------------------

  app.get('/api/admin/my-temple', authenticateToken, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.adminId === req.user!.id || t.id === req.user!.templeId);
    if (!temple) {
      return res.status(404).json({ error: 'No authorized temple assigned to this administrator.' });
    }
    res.json(temple);
  });

  app.put(
    '/api/admin/temples/:templeId',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req: AuthenticatedRequest, res) => {
      const templeIndex = db.temples.findIndex((t) => t.id === req.params.templeId);
      if (templeIndex === -1) {
        return res.status(404).json({ error: 'Temple not found' });
      }

      const existing = db.temples[templeIndex];
      const { name, deity, description, history, timings, pujas, contact, photos, dressCode, status } = req.body;

      const updated: Temple = {
        ...existing,
        name: name || existing.name,
        deity: deity || existing.deity,
        description: description ?? existing.description,
        history: history ?? existing.history,
        timings: timings || existing.timings,
        pujas: pujas || existing.pujas,
        contact: contact || existing.contact,
        photos: photos || existing.photos,
        dressCode: dressCode ?? existing.dressCode,
        status: status || existing.status,
        updatedAt: new Date().toISOString(),
      };

      db.temples[templeIndex] = updated;

      db.auditLogs.push({
        id: `audit-${Date.now()}`,
        templeId: updated.id,
        performedBy: req.user!.name,
        action: 'Update Temple Information',
        details: `Updated timings, pujas, and sanctum details. Status: ${updated.status}.`,
        timestamp: new Date().toISOString(),
      });

      res.json({ temple: updated, message: 'Temple information updated successfully.' });
    }
  );

  // Admin Temple Events
  app.post(
    '/api/admin/temples/:templeId/events',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req: AuthenticatedRequest, res) => {
      const temple = db.temples.find((t) => t.id === req.params.templeId);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });

      const { title, date, time, description, image } = req.body;
      if (!title || !date) {
        return res.status(400).json({ error: 'Event title and date are required.' });
      }

      const newEvent = {
        id: `ev-${Date.now()}`,
        title,
        date,
        time: time || 'All Day',
        description: description || '',
        image,
      };

      temple.events.push(newEvent);

      db.auditLogs.push({
        id: `audit-${Date.now()}`,
        templeId: temple.id,
        performedBy: req.user!.name,
        action: 'Add Temple Festival Event',
        details: `Created upcoming festival "${title}" on ${date}.`,
        timestamp: new Date().toISOString(),
      });

      res.json({ event: newEvent, message: 'Event added successfully.' });
    }
  );

  app.delete(
    '/api/admin/temples/:templeId/events/:eventId',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req: AuthenticatedRequest, res) => {
      const temple = db.temples.find((t) => t.id === req.params.templeId);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });

      temple.events = temple.events.filter((e) => e.id !== req.params.eventId);
      res.json({ message: 'Event deleted successfully.' });
    }
  );

  // Admin Vacancy Management
  app.get(
    '/api/admin/temples/:templeId/vacancies',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req, res) => {
      const vacancies = db.vacancies.filter((v) => v.templeId === req.params.templeId);
      const enhanced = vacancies.map((v) => {
        const count = db.applications.filter((a) => a.vacancyId === v.id).length;
        return { ...v, applicantsCount: count };
      });
      res.json(enhanced);
    }
  );

  app.post(
    '/api/admin/temples/:templeId/vacancies',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req: AuthenticatedRequest, res) => {
      const temple = db.temples.find((t) => t.id === req.params.templeId);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });

      const {
        title,
        ritualSpecialization,
        vedaTraditionRequired,
        minExperienceYears,
        remuneration,
        accommodationProvided,
        foodProvided,
        description,
      } = req.body;

      if (!title || !vedaTraditionRequired) {
        return res.status(400).json({ error: 'Title and Veda tradition required.' });
      }

      const newVacancy: Vacancy = {
        id: `vac-${Date.now()}`,
        templeId: temple.id,
        templeName: temple.name,
        location: `${temple.city}, ${temple.state}`,
        title,
        ritualSpecialization: Array.isArray(ritualSpecialization) ? ritualSpecialization : [ritualSpecialization],
        vedaTraditionRequired,
        minExperienceYears: minExperienceYears ? parseInt(minExperienceYears, 10) : 3,
        remuneration: remuneration || 'Competitive + Accommodation',
        accommodationProvided: accommodationProvided ?? true,
        foodProvided: foodProvided ?? true,
        description: description || 'Seeking qualified Vedic Purohit for sanctum worship.',
        status: 'open',
        postedDate: new Date().toISOString().split('T')[0],
        applicantsCount: 0,
      };

      db.vacancies.push(newVacancy);

      db.auditLogs.push({
        id: `audit-${Date.now()}`,
        templeId: temple.id,
        performedBy: req.user!.name,
        action: 'Post Priest Vacancy',
        details: `Posted job opening "${title}".`,
        timestamp: new Date().toISOString(),
      });

      res.status(201).json({ vacancy: newVacancy, message: 'Vacancy successfully posted!' });
    }
  );

  // Admin Applications Review
  app.get(
    '/api/admin/temples/:templeId/applications',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req, res) => {
      const applications = db.applications.filter((a) => a.templeId === req.params.templeId);
      res.json(applications);
    }
  );

  app.put(
    '/api/admin/applications/:applicationId/status',
    authenticateToken,
    requireRole(['admin']),
    (req: AuthenticatedRequest, res) => {
      const application = db.applications.find((a) => a.id === req.params.applicationId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Check admin owns this temple
      const temple = db.temples.find((t) => t.id === application.templeId);
      if (!temple || (temple.adminId !== req.user!.id && req.user!.templeId !== temple.id)) {
        return res.status(403).json({ error: 'Forbidden. You do not manage this temple.' });
      }

      const { status, adminNotes } = req.body;
      if (status) application.status = status;
      if (adminNotes !== undefined) application.adminNotes = adminNotes;
      application.updatedAt = new Date().toISOString();

      // Notify the applicant priest of status update
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: application.priestId,
        type: 'status_change',
        title: `Application ${status.toUpperCase().replace('_', ' ')}`,
        message: `Your application for "${application.vacancyTitle}" at ${application.templeName} has been updated to "${status.replace('_', ' ')}".`,
        link: '/priest/applications',
        read: false,
        createdAt: new Date().toISOString(),
      });

      db.auditLogs.push({
        id: `audit-${Date.now()}`,
        templeId: temple.id,
        performedBy: req.user!.name,
        action: 'Update Application Status',
        details: `Updated application for ${application.priestName} to "${status}". Notes: ${adminNotes || 'None'}.`,
        timestamp: new Date().toISOString(),
      });

      res.json({ application, message: `Application status updated to ${status}.` });
    }
  );

  // Admin Contributor Management
  app.get(
    '/api/admin/temples/:templeId/contributors',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req, res) => {
      const temple = db.temples.find((t) => t.id === req.params.templeId);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });

      // Return list of priests who have contributor status
      const contributorPriests = db.users
        .filter((u) => u.role === 'priest' && temple.contributors.includes(u.id))
        .map((u) => {
          const profile = db.priestProfiles.find((p) => p.userId === u.id);
          return {
            id: u.id,
            userId: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            vedaTradition: profile?.vedaTradition,
            experience: profile?.experienceYears,
          };
        });

      // Also return other registered priests so admin can explicitly grant them
      const otherPriests = db.users
        .filter((u) => u.role === 'priest' && !temple.contributors.includes(u.id))
        .map((u) => {
          const profile = db.priestProfiles.find((p) => p.userId === u.id);
          return {
            id: u.id,
            userId: u.id,
            name: u.name,
            email: u.email,
            vedaTradition: profile?.vedaTradition,
          };
        });

      res.json({ contributors: contributorPriests, availablePriests: otherPriests });
    }
  );

  app.post(
    '/api/admin/temples/:templeId/contributors/grant',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req: AuthenticatedRequest, res) => {
      const temple = db.temples.find((t) => t.id === req.params.templeId);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });

      const { priestUserId } = req.body;
      if (!priestUserId) return res.status(400).json({ error: 'Priest user ID required' });

      const priest = db.users.find((u) => u.id === priestUserId && u.role === 'priest');
      if (!priest) return res.status(404).json({ error: 'Priest user not found' });

      if (!temple.contributors.includes(priestUserId)) {
        temple.contributors.push(priestUserId);
      }

      // Notify the priest
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: priestUserId,
        type: 'contributor_update',
        title: 'Contributor Access Granted!',
        message: `The administrator of ${temple.name} has granted you verified contributor access to propose temple updates.`,
        link: '/priest/contributor',
        read: false,
        createdAt: new Date().toISOString(),
      });

      db.auditLogs.push({
        id: `audit-${Date.now()}`,
        templeId: temple.id,
        performedBy: req.user!.name,
        action: 'Grant Contributor Permission',
        details: `Explicitly granted contributor status to ${priest.name}.`,
        timestamp: new Date().toISOString(),
      });

      res.json({ message: `Contributor access granted to ${priest.name}.`, contributors: temple.contributors });
    }
  );

  app.post(
    '/api/admin/temples/:templeId/contributors/revoke',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req: AuthenticatedRequest, res) => {
      const temple = db.temples.find((t) => t.id === req.params.templeId);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });

      const { priestUserId } = req.body;
      temple.contributors = temple.contributors.filter((id) => id !== priestUserId);

      db.auditLogs.push({
        id: `audit-${Date.now()}`,
        templeId: temple.id,
        performedBy: req.user!.name,
        action: 'Revoke Contributor Permission',
        details: `Revoked contributor status for priest user ID ${priestUserId}.`,
        timestamp: new Date().toISOString(),
      });

      res.json({ message: 'Contributor access revoked.', contributors: temple.contributors });
    }
  );

  // Admin Contributor Proposals Review
  app.get(
    '/api/admin/temples/:templeId/proposals',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req, res) => {
      const proposals = db.contributorProposals.filter((p) => p.templeId === req.params.templeId);
      res.json(proposals);
    }
  );

  app.post(
    '/api/admin/proposals/:proposalId/review',
    authenticateToken,
    requireRole(['admin']),
    (req: AuthenticatedRequest, res) => {
      const proposal = db.contributorProposals.find((p) => p.id === req.params.proposalId);
      if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

      const temple = db.temples.find((t) => t.id === proposal.templeId);
      if (!temple || (temple.adminId !== req.user!.id && req.user!.templeId !== temple.id)) {
        return res.status(403).json({ error: 'Forbidden. You do not manage this temple.' });
      }

      const { action, feedback } = req.body; // 'approve' | 'reject'
      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Action must be "approve" or "reject".' });
      }

      proposal.status = action === 'approve' ? 'approved' : 'rejected';
      proposal.adminFeedback = feedback;
      proposal.reviewedAt = new Date().toISOString();

      // If approved, apply the changes directly to the public temple record!
      if (action === 'approve') {
        if (proposal.updateType === 'timings') {
          temple.timings = { ...temple.timings, ...proposal.proposedData };
        } else if (proposal.updateType === 'pujas') {
          temple.pujas = proposal.proposedData;
        } else if (proposal.updateType === 'information') {
          if (proposal.proposedData.description) temple.description = proposal.proposedData.description;
          if (proposal.proposedData.history) temple.history = proposal.proposedData.history;
        }
        temple.updatedAt = new Date().toISOString();
      }

      // Notify contributor priest
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: proposal.priestId,
        type: 'contributor_update',
        title: `Proposal ${action.toUpperCase()}D`,
        message: `Your proposed update for ${temple.name} was ${action}d by the administrator.${feedback ? ` Feedback: "${feedback}"` : ''}`,
        link: '/priest/contributor',
        read: false,
        createdAt: new Date().toISOString(),
      });

      db.auditLogs.push({
        id: `audit-${Date.now()}`,
        templeId: temple.id,
        performedBy: req.user!.name,
        action: `${action.toUpperCase()} Contributor Proposal`,
        details: `Proposal #${proposal.id} by ${proposal.priestName} for ${proposal.updateType} was ${action}d.`,
        timestamp: new Date().toISOString(),
      });

      res.json({ proposal, temple, message: `Proposal ${action}d successfully!` });
    }
  );

  // Admin Audit Logs
  app.get(
    '/api/admin/temples/:templeId/audit-logs',
    authenticateToken,
    requireRole(['admin']),
    requireTempleOwnership,
    (req, res) => {
      const logs = db.auditLogs.filter((l) => l.templeId === req.params.templeId);
      res.json(logs);
    }
  );

  // ----------------------------------------------------
  // 4. PRIEST PORTAL (STRICTLY AUTHORIZED TO PRIEST ROLE)
  // ----------------------------------------------------

  app.get('/api/priests/me/profile', authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    let profile = db.priestProfiles.find((p) => p.userId === req.user!.id);
    if (!profile) {
      // Auto-create default profile for newly registered priest
      profile = {
        id: `priest-${Date.now()}`,
        userId: req.user!.id,
        fullName: req.user!.name,
        experienceYears: 5,
        previousTemples: [],
        purohithamSkills: ['Rudrabhishekam', 'Ganapathi Homam', 'Veda Parayanam'],
        vedaTradition: 'Rigveda',
        trainingQualifications: 'Veda Pathashala Certified',
        languages: ['Sanskrit', 'Hindi'],
        achievements: '',
        bio: 'Devout Vedic Purohit looking for temple seva.',
        location: 'India',
        phone: req.user!.phone || '',
        email: req.user!.email,
        shareContactConsent: true,
        availableForRelocation: true,
        expectedRemuneration: '₹35,000 – ₹50,000 / month',
      };
      db.priestProfiles.push(profile);
    }
    res.json(profile);
  });

  app.put('/api/priests/me/profile', authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    const profileIndex = db.priestProfiles.findIndex((p) => p.userId === req.user!.id);
    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Priest profile not found' });
    }

    const current = db.priestProfiles[profileIndex];
    const updated = {
      ...current,
      ...req.body,
      id: current.id,
      userId: current.userId, // Prevent spoofing
    };

    db.priestProfiles[profileIndex] = updated;
    res.json({ profile: updated, message: 'Priest profile updated successfully.' });
  });

  // Vacancies search for priests
  app.get('/api/priests/vacancies', authenticateToken, requireRole(['priest']), (req, res) => {
    const { skill, tradition, accommodation } = req.query;
    let list = db.vacancies.filter((v) => v.status === 'open');

    if (skill && typeof skill === 'string') {
      list = list.filter((v) =>
        v.ritualSpecialization.some((s) => s.toLowerCase().includes((skill as string).toLowerCase()))
      );
    }

    if (tradition && typeof tradition === 'string') {
      list = list.filter((v) =>
        v.vedaTraditionRequired.toLowerCase().includes((tradition as string).toLowerCase())
      );
    }

    if (accommodation === 'true') {
      list = list.filter((v) => v.accommodationProvided === true);
    }

    res.json(list);
  });

  // Apply for vacancy
  app.post(
    '/api/priests/vacancies/:vacancyId/apply',
    authenticateToken,
    requireRole(['priest']),
    async (req: AuthenticatedRequest, res) => {
      const vacancy = db.vacancies.find((v) => v.id === req.params.vacancyId);
      if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });

      // Check if already applied
      const existing = db.applications.find(
        (a) => a.vacancyId === vacancy.id && a.priestId === req.user!.id
      );
      if (existing) {
        return res.status(400).json({ error: 'You have already applied for this vacancy.' });
      }

      const profile = db.priestProfiles.find((p) => p.userId === req.user!.id);
      if (!profile) {
        return res.status(400).json({ error: 'Please complete your priest profile before applying.' });
      }

      const { coverNote, availableFrom } = req.body;

      // Compute AI candidate match
      let aiMatchResult = { matchScore: 85, summary: 'Vedic skills aligned with requirements.' };
      try {
        const matchEval = await aiMatchPriestToVacancy(vacancy, profile);
        aiMatchResult = {
          matchScore: matchEval.matchScore,
          summary: matchEval.summary,
        };
      } catch (err) {
        console.warn('AI matching eval error:', err);
      }

      const newApplication: Application = {
        id: `app-${Date.now()}`,
        vacancyId: vacancy.id,
        vacancyTitle: vacancy.title,
        templeId: vacancy.templeId,
        templeName: vacancy.templeName,
        priestId: req.user!.id,
        priestName: profile.fullName || req.user!.name,
        // Only share contact if priest gave consent
        priestPhone: profile.shareContactConsent ? profile.phone : undefined,
        priestEmail: profile.shareContactConsent ? profile.email : undefined,
        priestExperience: profile.experienceYears,
        priestSkills: profile.purohithamSkills,
        priestVeda: profile.vedaTradition,
        priestLanguages: profile.languages,
        coverNote: coverNote || 'Humbly applying for this sacred seva opportunity.',
        availableFrom: availableFrom || 'Immediately',
        status: 'submitted',
        aiMatchScore: aiMatchResult.matchScore,
        aiMatchSummary: aiMatchResult.summary,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.applications.push(newApplication);

      // Notify the temple admin
      const temple = db.temples.find((t) => t.id === vacancy.templeId);
      if (temple && temple.adminId) {
        db.notifications.push({
          id: `notif-${Date.now()}`,
          userId: temple.adminId,
          type: 'application',
          title: 'New Priest Application Received',
          message: `${profile.fullName} applied for "${vacancy.title}" (AI Match: ${aiMatchResult.matchScore}%).`,
          link: '/admin/applications',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }

      res.status(201).json({
        application: newApplication,
        message: 'Application submitted successfully! You can track progress in your priest dashboard.',
      });
    }
  );

  app.get('/api/priests/me/applications', authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    const list = db.applications.filter((a) => a.priestId === req.user!.id);
    res.json(list);
  });

  app.put('/api/priests/me/applications/:applicationId/withdraw', authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    const appItem = db.applications.find((a) => a.id === req.params.applicationId && a.priestId === req.user!.id);
    if (!appItem) return res.status(404).json({ error: 'Application not found or unauthorized' });

    appItem.status = 'withdrawn';
    appItem.updatedAt = new Date().toISOString();
    res.json({ application: appItem, message: 'Application withdrawn.' });
  });

  // Priest Contributor Workspace
  app.get('/api/priests/me/contributor-temples', authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    // Only return temples where admin explicitly added this priest to `contributors`
    const authorizedTemples = db.temples.filter(
      (t) => t.contributors && t.contributors.includes(req.user!.id)
    );
    res.json(authorizedTemples);
  });

  app.post(
    '/api/priests/temples/:templeId/propose-update',
    authenticateToken,
    requireRole(['priest']),
    requireContributorAccess,
    (req: AuthenticatedRequest, res) => {
      const temple = db.temples.find((t) => t.id === req.params.templeId);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });

      const { updateType, proposedData, rationale } = req.body;
      if (!updateType || !proposedData || !rationale) {
        return res.status(400).json({ error: 'Update type, proposed data, and rationale are required.' });
      }

      const proposal: ContributorProposal = {
        id: `prop-${Date.now()}`,
        templeId: temple.id,
        templeName: temple.name,
        priestId: req.user!.id,
        priestName: req.user!.name,
        updateType,
        proposedData,
        rationale,
        status: 'pending_admin_review',
        submittedAt: new Date().toISOString(),
      };

      db.contributorProposals.push(proposal);

      // Notify the temple admin
      if (temple.adminId) {
        db.notifications.push({
          id: `notif-${Date.now()}`,
          userId: temple.adminId,
          type: 'contributor_update',
          title: 'New Contributor Proposal Submitted',
          message: `${req.user!.name} proposed updates to ${updateType} for ${temple.name}.`,
          link: '/admin/contributors',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }

      res.status(201).json({
        proposal,
        message: 'Proposed update submitted for Admin Review. Changes will become public upon approval.',
      });
    }
  );

  app.get('/api/priests/me/proposals', authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    const list = db.contributorProposals.filter((p) => p.priestId === req.user!.id);
    res.json(list);
  });

  // ----------------------------------------------------
  // 5. MESSAGING (PRIVATE CHAT BETWEEN ADMIN & PRIEST)
  // ----------------------------------------------------

  app.get('/api/messages', authenticateToken, (req: AuthenticatedRequest, res) => {
    // Only return messages sent by or received by this user
    const userMessages = db.messages.filter(
      (m) => m.senderId === req.user!.id || m.recipientId === req.user!.id
    );
    res.json(userMessages);
  });

  app.post('/api/messages', authenticateToken, (req: AuthenticatedRequest, res) => {
    const { recipientId, templeId, applicationId, content } = req.body;
    if (!recipientId || !content || !content.trim()) {
      return res.status(400).json({ error: 'Recipient and content are required.' });
    }

    const recipient = db.users.find((u) => u.id === recipientId);
    if (!recipient) return res.status(404).json({ error: 'Recipient not found' });

    const newMsg: any = {
      id: `msg-${Date.now()}`,
      applicationId,
      templeId: templeId || '',
      senderId: req.user!.id,
      senderName: req.user!.name,
      senderRole: req.user!.role,
      recipientId: recipient.id,
      recipientName: recipient.name,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    db.messages.push(newMsg);

    // Notify recipient
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: recipient.id,
      type: 'message',
      title: `Message from ${req.user!.name}`,
      message: content.length > 60 ? `${content.substring(0, 60)}...` : content,
      link: req.user!.role === 'admin' ? '/priest/applications' : '/admin/applications',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(newMsg);
  });

  // ----------------------------------------------------
  // 6. NOTIFICATIONS
  // ----------------------------------------------------

  app.get('/api/notifications', authenticateToken, (req: AuthenticatedRequest, res) => {
    const list = db.notifications
      .filter((n) => n.userId === req.user!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
  });

  app.put('/api/notifications/:id/read', authenticateToken, (req: AuthenticatedRequest, res) => {
    const notif = db.notifications.find((n) => n.id === req.params.id && n.userId === req.user!.id);
    if (notif) notif.read = true;
    res.json({ success: true });
  });

  app.put('/api/notifications/read-all', authenticateToken, (req: AuthenticatedRequest, res) => {
    db.notifications
      .filter((n) => n.userId === req.user!.id)
      .forEach((n) => (n.read = true));
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // 7. AI FEATURES ENDPOINTS
  // ----------------------------------------------------

  app.post('/api/ai/temple-search', async (req, res) => {
    const { query, lat, lng } = req.body;
    if (!query) return res.status(400).json({ error: 'Search query is required.' });

    const searchResult = await aiTempleSearch(query, lat, lng);
    
    // Preserve the exact ranking order returned by aiTempleSearch
    let matchedTemples = searchResult.matchedTempleIds
      .map((id) => db.temples.find((t) => t.id === id))
      .filter((t): t is Temple => Boolean(t));

    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      matchedTemples = matchedTemples.map((t) => ({
        ...t,
        distanceKm: haversineKm(lat, lng, t.lat, t.lng),
      }));
    }

    res.json({
      ...searchResult,
      temples: matchedTemples,
    });
  });

  app.post('/api/ai/match-priest', authenticateToken, async (req, res) => {
    const { vacancyId, priestId } = req.body;
    const vacancy = db.vacancies.find((v) => v.id === vacancyId);
    const priest = db.priestProfiles.find((p) => p.userId === priestId || p.id === priestId);

    if (!vacancy || !priest) {
      return res.status(404).json({ error: 'Vacancy or Priest profile not found.' });
    }

    const matchAnalysis = await aiMatchPriestToVacancy(vacancy, priest);
    res.json(matchAnalysis);
  });

  app.post('/api/ai/detect-duplicate', async (req, res) => {
    const { name, deity, city, address, lat, lng } = req.body;
    if (!name || !city) {
      return res.status(400).json({ error: 'Temple name and city are required.' });
    }

    const detection = await aiDetectDuplicateTemple({
      name,
      deity: deity || '',
      city,
      address: address || city,
      lat,
      lng,
    });

    res.json(detection);
  });

  app.post('/api/ai/temple-assistant', async (req, res) => {
    const { templeId, question } = req.body;
    if (!templeId || !question) {
      return res.status(400).json({ error: 'Temple ID and question are required.' });
    }

    const answer = await aiTempleAssistant(templeId, question);
    res.json({ answer });
  });

  // Static assets from /public/images
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

  // ----------------------------------------------------
  // 8. VITE MIDDLEWARE / SPA STATIC FALLBACK
  // ----------------------------------------------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TempleConnect full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
