import express, { Express } from 'express';
import { db } from './db';
import {
  generateToken,
  authenticateToken,
  requireRole,
  requireTempleOwnership,
  requireContributorAccess,
  AuthenticatedRequest,
} from './auth';
import {
  aiTempleSearch,
  aiMatchPriestToVacancy,
  aiDetectDuplicateTemple,
  aiTempleAssistant,
} from './gemini';
import {
  User,
  Temple,
  Vacancy,
  Application,
  PriestProfile,
  ContributorProposal,
  TempleClaimRequest,
  AppNotification,
  AuditLog,
  Message,
} from '../src/types';
import { filterTemplesByLocationQuery, haversineKm } from './locationSearch';

export function createApiApp(): Express {
  const app = express();

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
    const { email, role } = req.body;
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

    const newUser: User = {
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
      }
    }

    // 3. Optional deity filter
    if (deity && typeof deity === 'string' && deity !== 'All Deities') {
      const deityLower = deity.toLowerCase();
      results = results.filter((t) => t.deity.toLowerCase().includes(deityLower));
    }

    // 4. Optional city filter (if not already handled by search query filter)
    if (userCityName && (!search || !locationFilterInfo?.isActive)) {
      results = results.filter((t) => t.city.toLowerCase() === userCityName.toLowerCase());
    }

    // 5. Sorting
    if (sort === 'distance' || (!sort && (userLat !== undefined || locationFilterInfo?.isActive))) {
      results.sort((a, b) => {
        if (a.distanceKm === undefined && b.distanceKm === undefined) return 0;
        if (a.distanceKm === undefined) return 1;
        if (b.distanceKm === undefined) return -1;
        return a.distanceKm - b.distanceKm;
      });
    } else if (sort === 'name') {
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

  // Devotee community submission of missing temples
  app.post('/api/temples', authenticateToken, async (req: AuthenticatedRequest, res) => {
    const { name, deity, city, state, address, lat, lng, description, history, timings, pujas, contact, photos } = req.body;

    if (!name || !city) {
      return res.status(400).json({ error: 'Temple name and city are required.' });
    }

    // AI duplicate detection check
    const duplicateCheck = await aiDetectDuplicateTemple({
      name,
      deity: deity || '',
      city,
      address: address || city,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
    });

    const newTemple: Temple = {
      id: `temple-${Date.now()}`,
      name,
      deity: deity || 'Hindu Deity',
      city,
      state: state || 'India',
      address: address || `${city}, ${state || 'India'}`,
      lat: lat ? parseFloat(lat) : 13.0827,
      lng: lng ? parseFloat(lng) : 80.2707,
      description: description || 'Sacred temple community submission.',
      history: history || '',
      timings: timings || {
        morning: '06:00 AM – 12:00 PM',
        evening: '04:30 PM – 08:30 PM',
      },
      pujas: pujas || [
        { id: `p-${Date.now()}-1`, name: 'Daily Nitya Puja', timing: '07:00 AM', significance: 'Nitya Archana', fee: 'Free' },
      ],
      contact: contact || {
        phone: req.user?.phone || '+91 90000 00000',
        email: req.user?.email || 'temple@vedic.org',
      },
      photos: photos && photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      ],
      status: 'pending_verification',
      contributors: [],
      events: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.temples.push(newTemple);

    // Audit log
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      templeId: newTemple.id,
      performedBy: req.user!.name,
      action: 'TEMPLE_SUBMITTED',
      details: `Devotee submitted new temple: "${name}" (${city}). Verification status: pending.`,
      timestamp: new Date().toISOString(),
    };
    db.auditLogs.push(newLog);

    res.status(201).json({
      temple: newTemple,
      duplicateWarning: duplicateCheck.isDuplicateLikely ? duplicateCheck : null,
      message: 'Temple submitted for community verification.',
    });
  });

  // Temple Claiming workflow for temple management boards
  app.post('/api/temples/:id/claim', authenticateToken, (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.id === req.params.id);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });

    if (temple.claimedBy || temple.claimStatus === 'claimed') {
      return res.status(400).json({ error: 'This temple has already been claimed and verified.' });
    }

    const { officialRole, phone, email, verificationDocs } = req.body;
    if (!officialRole || !phone) {
      return res.status(400).json({ error: 'Official role and phone are required for claim verification.' });
    }

    const claim: TempleClaimRequest = {
      id: `claim-${Date.now()}`,
      templeId: temple.id,
      templeName: temple.name,
      applicantUserId: req.user!.id,
      applicantName: req.user!.name,
      officialRole,
      phone,
      email: email || req.user!.email,
      verificationDocs: verificationDocs || 'Official Trustee Resolution / HR&CE ID Proof',
      status: req.user!.role === 'admin' ? 'verified' : 'pending',
      submittedAt: new Date().toISOString(),
    };

    db.claimRequests.push(claim);

    // For demonstration, if user is already an admin, auto-claim
    if (req.user!.role === 'admin') {
      temple.claimedBy = req.user!.id;
      temple.adminId = req.user!.id;
      temple.claimStatus = 'claimed';
    } else {
      temple.claimStatus = 'claim_pending';
    }

    res.json({
      claim,
      message:
        req.user!.role === 'admin'
          ? 'Temple officially linked to your admin account!'
          : 'Claim request submitted. Admin team will verify legal trustee documentation.',
    });
  });

  // ----------------------------------------------------
  // 3. ADMIN PORTAL (TEMPLE MANAGEMENT & VACANCIES)
  // ----------------------------------------------------

  // Get admin's managed temple
  app.get('/api/admin/my-temple', authenticateToken, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    let temple = db.temples.find((t) => t.adminId === req.user!.id || t.claimedBy === req.user!.id);
    if (!temple && req.user!.templeId) {
      temple = db.temples.find((t) => t.id === req.user!.templeId);
    }

    // Default to first temple for demo admin if not bound
    if (!temple && db.temples.length > 0) {
      temple = db.temples[0];
      temple.adminId = req.user!.id;
    }

    if (!temple) {
      return res.status(404).json({ error: 'No temple managed by this admin yet.' });
    }

    res.json(temple);
  });

  // Update temple details (Only admin with ownership)
  app.put('/api/admin/temples/:templeId', authenticateToken, requireRole(['admin']), requireTempleOwnership, (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });

    const updatable = [
      'name',
      'deity',
      'city',
      'state',
      'address',
      'lat',
      'lng',
      'description',
      'history',
      'timings',
      'pujas',
      'contact',
      'photos',
    ];

    updatable.forEach((key) => {
      if (req.body[key] !== undefined) {
        (temple as any)[key] = req.body[key];
      }
    });

    temple.updatedAt = new Date().toISOString();

    db.auditLogs.push({
      id: `audit-${Date.now()}`,
      templeId: temple.id,
      performedBy: req.user!.name,
      action: 'TEMPLE_UPDATED',
      details: `Admin updated temple details.`,
      timestamp: new Date().toISOString(),
    });

    res.json({ temple, message: 'Temple profile successfully updated.' });
  });

  // Add festival / event
  app.post('/api/admin/temples/:templeId/events', authenticateToken, requireRole(['admin']), requireTempleOwnership, (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });

    const { title, date, time, description } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'Event title and date are required.' });
    }

    const newEvent = {
      id: `ev-${Date.now()}`,
      title,
      date,
      time: time || '08:00 AM',
      description: description || '',
    };

    if (!temple.events) temple.events = [];
    temple.events.push(newEvent);

    res.status(201).json({ event: newEvent, message: 'Festival/Event scheduled.' });
  });

  // Delete event
  app.delete('/api/admin/temples/:templeId/events/:eventId', authenticateToken, requireRole(['admin']), requireTempleOwnership, (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });

    temple.events = (temple.events || []).filter((e) => e.id !== req.params.eventId);
    res.json({ message: 'Event removed.' });
  });

  // Vacancies for this temple
  app.get('/api/admin/temples/:templeId/vacancies', authenticateToken, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const vacancies = db.vacancies.filter((v) => v.templeId === req.params.templeId);
    res.json(vacancies);
  });

  // Post new priest vacancy
  app.post('/api/admin/temples/:templeId/vacancies', authenticateToken, requireRole(['admin']), requireTempleOwnership, (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });

    const {
      title,
      vedaTraditionRequired,
      minExperienceYears,
      ritualSpecialization,
      accommodationProvided,
      foodProvided,
      remuneration,
      description,
    } = req.body;

    if (!title || !vedaTraditionRequired) {
      return res.status(400).json({ error: 'Job title and Veda / Agama tradition are required.' });
    }

    const newVacancy: Vacancy = {
      id: `vac-${Date.now()}`,
      templeId: temple.id,
      templeName: temple.name,
      location: `${temple.city}, ${temple.state}`,
      title,
      vedaTraditionRequired,
      minExperienceYears: parseInt(minExperienceYears, 10) || 3,
      ritualSpecialization: ritualSpecialization || ['Daily Nitya Archana', 'Veda Parayanam'],
      accommodationProvided: accommodationProvided ?? true,
      foodProvided: foodProvided ?? true,
      remuneration: remuneration || '₹35,000 – ₹50,000 / month',
      description: description || 'Seeking experienced Vedic priest for sanctum seva.',
      status: 'open',
      postedDate: new Date().toISOString(),
      applicantsCount: 0,
    };

    db.vacancies.push(newVacancy);

    // Notify registered priests about new opportunity matching tradition
    db.users
      .filter((u) => u.role === 'priest')
      .forEach((p) => {
        db.notifications.push({
          id: `notif-${Date.now()}-${p.id}`,
          userId: p.id,
          type: 'application',
          title: `New Vacancy: ${title}`,
          message: `${temple.name} (${temple.city}) is hiring: ${title}.`,
          link: `/priest`,
          read: false,
          createdAt: new Date().toISOString(),
        });
      });

    res.status(201).json({ vacancy: newVacancy, message: 'Vacancy published successfully.' });
  });

  // Get applications for a temple
  app.get('/api/admin/temples/:templeId/applications', authenticateToken, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const apps = db.applications.filter((a) => a.templeId === req.params.templeId);
    res.json(apps);
  });

  // Update application status (Shortlist, Hire, Reject)
  app.put('/api/admin/applications/:applicationId/status', authenticateToken, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const appRecord = db.applications.find((a) => a.id === req.params.applicationId);
    if (!appRecord) return res.status(404).json({ error: 'Application not found' });

    const { status, adminNotes } = req.body;
    appRecord.status = status;
    if (adminNotes !== undefined) appRecord.adminNotes = adminNotes;
    appRecord.updatedAt = new Date().toISOString();

    // Notify the Priest applicant
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: appRecord.priestId,
      type: 'status_change',
      title: `Application Update: ${appRecord.templeName}`,
      message: `Your application status for ${appRecord.vacancyTitle} is now: ${status.toUpperCase().replace('_', ' ')}.`,
      link: '/priest',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.json({ application: appRecord, message: `Status updated to ${status}.` });
  });

  // Contributors Management (Grant/Revoke access)
  app.get('/api/admin/temples/:templeId/contributors', authenticateToken, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });

    // Return list of authorized contributors with names
    const authorized = (temple.contributors || [])
      .map((userId) => {
        const u = db.users.find((user) => user.id === userId);
        const profile = db.priestProfiles.find((p) => p.userId === userId);
        return {
          id: userId,
          userId,
          name: u?.name || profile?.fullName || 'Contributor',
          email: u?.email || profile?.email || '',
          vedaTradition: profile?.vedaTradition || 'Vedic Scholar',
          role: u?.role || 'priest',
        };
      });

    // Available priests who can be granted access
    const availablePriests = db.users
      .filter((u) => u.role === 'priest' && !(temple.contributors || []).includes(u.id))
      .map((u) => {
        const profile = db.priestProfiles.find((p) => p.userId === u.id);
        return {
          id: u.id,
          userId: u.id,
          name: u.name,
          email: u.email,
          vedaTradition: profile?.vedaTradition || 'Vedic Tradition',
          experienceYears: profile?.experienceYears || 0,
        };
      });

    res.json({
      contributors: authorized,
      availablePriests,
    });
  });

  app.post('/api/admin/temples/:templeId/contributors/grant', authenticateToken, requireRole(['admin']), requireTempleOwnership, (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });

    const { priestUserId } = req.body;
    if (!priestUserId) return res.status(400).json({ error: 'priestUserId is required.' });

    if (!temple.contributors) temple.contributors = [];
    if (!temple.contributors.includes(priestUserId)) {
      temple.contributors.push(priestUserId);
    }

    // Notify priest
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: priestUserId,
      type: 'contributor_update',
      title: 'Contributor Access Granted',
      message: `You are now an authorized contributor for ${temple.name}. You can update timings and rituals.`,
      link: '/priest',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.json({ message: 'Contributor access granted.', contributors: temple.contributors });
  });

  app.post('/api/admin/temples/:templeId/contributors/revoke', authenticateToken, requireRole(['admin']), requireTempleOwnership, (req: AuthenticatedRequest, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });

    const { priestUserId } = req.body;
    temple.contributors = (temple.contributors || []).filter((id) => id !== priestUserId);

    res.json({ message: 'Contributor access revoked.', contributors: temple.contributors });
  });

  // Proposals (Review contributor updates)
  app.get('/api/admin/temples/:templeId/proposals', authenticateToken, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const list = db.contributorProposals.filter((p) => p.templeId === req.params.templeId);
    res.json(list);
  });

  app.post('/api/admin/proposals/:proposalId/review', authenticateToken, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const proposal = db.contributorProposals.find((p) => p.id === req.params.proposalId);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const { action, feedback } = req.body; // 'approve' | 'reject'
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Action must be approve or reject.' });
    }

    const decision = action === 'approve' ? 'approved' : 'rejected';
    proposal.status = decision;
    proposal.adminFeedback = feedback || '';
    proposal.reviewedAt = new Date().toISOString();

    const temple = db.temples.find((t) => t.id === proposal.templeId);
    if (decision === 'approved' && temple) {
      if (proposal.updateType === 'timings' && proposal.proposedData) {
        temple.timings = { ...temple.timings, ...proposal.proposedData };
      } else if (proposal.updateType === 'pujas' && proposal.proposedData) {
        temple.pujas = proposal.proposedData;
      }
      temple.updatedAt = new Date().toISOString();
    }

    // Notify the contributor priest
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: proposal.priestId,
      type: 'contributor_update',
      title: `Update Proposal ${decision.toUpperCase()}`,
      message: `Your proposed updates for ${proposal.templeName} have been ${decision}.`,
      link: '/priest',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.json({ proposal, temple, message: `Proposal ${decision}.` });
  });

  // Audit logs
  app.get('/api/admin/temples/:templeId/audit-logs', authenticateToken, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
    const list = db.auditLogs.filter((l) => l.templeId === req.params.templeId);
    res.json(list);
  });

  // ----------------------------------------------------
  // 4. PRIEST PORTAL & JOB SEEKER WORKFLOWS
  // ----------------------------------------------------

  // Get priest profile
  app.get(['/api/priest/profile', '/api/priests/me/profile'], authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    let profile = db.priestProfiles.find((p) => p.userId === req.user!.id);
    if (!profile) {
      // Create empty profile if not yet created
      profile = {
        id: `priest-profile-${Date.now()}`,
        userId: req.user!.id,
        fullName: req.user!.name,
        experienceYears: 1,
        previousTemples: [],
        purohithamSkills: ['Nitya Puja'],
        vedaTradition: 'Rigveda',
        trainingQualifications: 'Veda Pathashala',
        languages: ['Sanskrit', 'Hindi'],
        achievements: '',
        bio: '',
        location: 'India',
        phone: req.user!.phone || '',
        email: req.user!.email,
        shareContactConsent: true,
        availableForRelocation: true,
        expectedRemuneration: '₹35,000 / month',
      };
      db.priestProfiles.push(profile);
    }
    res.json(profile);
  });

  // Update priest profile
  app.put(['/api/priest/profile', '/api/priests/me/profile'], authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    let profile = db.priestProfiles.find((p) => p.userId === req.user!.id);
    if (!profile) {
      profile = {
        id: `priest-profile-${Date.now()}`,
        userId: req.user!.id,
        fullName: req.user!.name,
        experienceYears: 0,
        previousTemples: [],
        purohithamSkills: [],
        vedaTradition: '',
        trainingQualifications: '',
        languages: [],
        achievements: '',
        bio: '',
        location: '',
        phone: req.user!.phone || '',
        email: req.user!.email,
        shareContactConsent: true,
        availableForRelocation: true,
        expectedRemuneration: '',
      };
      db.priestProfiles.push(profile);
    }

    const fields = [
      'fullName',
      'experienceYears',
      'previousTemples',
      'purohithamSkills',
      'vedaTradition',
      'trainingQualifications',
      'languages',
      'achievements',
      'bio',
      'location',
      'phone',
      'email',
      'shareContactConsent',
      'availableForRelocation',
      'expectedRemuneration',
    ];

    fields.forEach((k) => {
      if (req.body[k] !== undefined) {
        (profile as any)[k] = req.body[k];
      }
    });

    res.json({ profile, message: 'Priest profile updated successfully.' });
  });

  // Browse all vacancies with filters
  app.get(['/api/vacancies', '/api/priests/vacancies'], (req, res) => {
    const { tradition, skill, city, accommodation } = req.query;
    let list = db.vacancies.filter((v) => v.status === 'open');

    if (tradition && typeof tradition === 'string' && tradition !== 'All Traditions') {
      const tradLower = tradition.toLowerCase();
      list = list.filter((v) => v.vedaTraditionRequired.toLowerCase().includes(tradLower));
    }

    if (skill && typeof skill === 'string') {
      const skillLower = skill.toLowerCase();
      list = list.filter((v) =>
        v.ritualSpecialization.some((s) => s.toLowerCase().includes(skillLower))
      );
    }

    if (city && typeof city === 'string' && city !== 'All Cities') {
      list = list.filter((v) => v.location.toLowerCase().includes(city.toLowerCase()));
    }

    if (accommodation === 'true') {
      list = list.filter((v) => v.accommodationProvided);
    }

    res.json(list);
  });

  // Get single vacancy
  app.get('/api/vacancies/:id', (req, res) => {
    const vac = db.vacancies.find((v) => v.id === req.params.id);
    if (!vac) return res.status(404).json({ error: 'Vacancy not found' });
    res.json(vac);
  });

  // Priest submits job application
  app.post(['/api/priest/apply', '/api/priests/vacancies/:vacancyId/apply'], authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    const vacancyId = req.params.vacancyId || req.body.vacancyId;
    const { coverNote, availableFrom } = req.body;
    if (!vacancyId) return res.status(400).json({ error: 'vacancyId is required.' });

    const vacancy = db.vacancies.find((v) => v.id === vacancyId);
    if (!vacancy) return res.status(404).json({ error: 'Vacancy not found or has expired.' });

    // Check if already applied
    const existing = db.applications.find(
      (a) => a.vacancyId === vacancyId && a.priestId === req.user!.id
    );
    if (existing) {
      return res.status(400).json({ error: 'You have already applied for this vacancy.' });
    }

    const profile = db.priestProfiles.find((p) => p.userId === req.user!.id);
    if (!profile) {
      return res.status(400).json({ error: 'Please complete your Priest Profile before applying.' });
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      templeId: vacancy.templeId,
      templeName: vacancy.templeName,
      priestId: req.user!.id,
      priestName: profile.fullName || req.user!.name,
      priestPhone: profile.phone || req.user!.phone,
      priestEmail: profile.email || req.user!.email,
      priestExperience: profile.experienceYears,
      priestSkills: profile.purohithamSkills,
      priestVeda: profile.vedaTradition,
      priestLanguages: profile.languages,
      coverNote: coverNote || 'Pranam. I would be honored to render sanctum services for the temple.',
      availableFrom: availableFrom || 'Immediate / 15 Days',
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.applications.push(newApp);

    // Notify Temple Admin
    const temple = db.temples.find((t) => t.id === vacancy.templeId);
    if (temple && temple.adminId) {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: temple.adminId,
        type: 'application',
        title: `New Applicant for ${vacancy.title}`,
        message: `${profile.fullName} (${profile.vedaTradition}, ${profile.experienceYears} yrs exp) applied.`,
        link: '/admin',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    res.status(201).json({ application: newApp, message: 'Application submitted to Temple Board.' });
  });

  // Get priest's submitted applications
  app.get(['/api/priest/my-applications', '/api/priests/me/applications'], authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    const list = db.applications.filter((a) => a.priestId === req.user!.id);
    res.json(list);
  });

  // Withdraw application
  app.put('/api/priests/me/applications/:applicationId/withdraw', authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    const appRecord = db.applications.find((a) => a.id === req.params.applicationId && a.priestId === req.user!.id);
    if (!appRecord) return res.status(404).json({ error: 'Application not found' });

    appRecord.status = 'withdrawn';
    appRecord.updatedAt = new Date().toISOString();
    res.json({ application: appRecord, message: 'Application withdrawn.' });
  });

  // Get temples where priest is an authorized contributor
  app.get('/api/priests/me/contributor-temples', authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    const temples = db.temples.filter((t) => t.contributors && t.contributors.includes(req.user!.id));
    res.json(temples);
  });

  // Priest contributor proposals
  app.get(['/api/priest/my-proposals', '/api/priests/me/proposals'], authenticateToken, requireRole(['priest']), (req: AuthenticatedRequest, res) => {
    const list = db.contributorProposals.filter((p) => p.priestId === req.user!.id);
    res.json(list);
  });

  // Priest submits proposed update for temple they are authorized contributor for
  app.post(
    ['/api/priest/temples/:templeId/propose-update', '/api/priests/temples/:templeId/propose-update'],
    authenticateToken,
    requireRole(['priest']),
    requireContributorAccess,
    (req: AuthenticatedRequest, res) => {
      const temple = db.temples.find((t) => t.id === req.params.templeId);
      if (!temple) return res.status(404).json({ error: 'Temple not found' });

      const { updateType, proposedData, rationale } = req.body;
      if (!rationale) {
        return res.status(400).json({ error: 'Rationale of proposed changes is required.' });
      }

      const proposal: ContributorProposal = {
        id: `prop-${Date.now()}`,
        templeId: temple.id,
        templeName: temple.name,
        priestId: req.user!.id,
        priestName: req.user!.name,
        updateType: updateType || 'timings',
        proposedData: proposedData || {},
        rationale,
        status: 'pending_admin_review',
        submittedAt: new Date().toISOString(),
      };

      db.contributorProposals.push(proposal);

      // Notify temple admin
      if (temple.adminId) {
        db.notifications.push({
          id: `notif-${Date.now()}`,
          userId: temple.adminId,
          type: 'contributor_update',
          title: `Update Proposed for ${temple.name}`,
          message: `${req.user!.name} submitted updates: "${rationale}".`,
          link: '/admin',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }

      res.status(201).json({ proposal, message: 'Update proposal submitted for Temple Admin approval.' });
    }
  );

  // ----------------------------------------------------
  // 5. MESSAGING / CHAT (PRIEST <-> ADMIN)
  // ----------------------------------------------------

  app.get('/api/messages', authenticateToken, (req: AuthenticatedRequest, res) => {
    const list = db.messages
      .filter((m) => m.senderId === req.user!.id || m.recipientId === req.user!.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    res.json(list);
  });

  app.post('/api/messages', authenticateToken, (req: AuthenticatedRequest, res) => {
    const { recipientId, content, templeId, applicationId } = req.body;
    if (!content || !recipientId) {
      return res.status(400).json({ error: 'Recipient and content are required.' });
    }

    const recipient = db.users.find((u) => u.id === recipientId);
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      applicationId,
      templeId: templeId || '',
      senderId: req.user!.id,
      senderName: req.user!.name,
      senderRole: req.user!.role,
      recipientId,
      recipientName: recipient?.name || 'User',
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    db.messages.push(newMsg);

    // Notify recipient
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: recipientId,
      type: 'message',
      title: `Message from ${req.user!.name}`,
      message: content.length > 60 ? `${content.substring(0, 60)}...` : content,
      link: req.user!.role === 'admin' ? '/priest' : '/admin',
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

  return app;
}
