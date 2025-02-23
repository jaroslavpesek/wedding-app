// ~/Dev/WDNG.IO/backend/src/routes/registerRoute.ts
import { Request, Response } from 'express';
import AccessCode from './models/AccessCode';
import { IPerson, ACCOMODATION_TYPES } from './models/AccessCode';

const registerGuest = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      code,
      accepted,
      email,
      main_guest,
      accomodation_type,
      phone_number,
      guests_list,
    } = req.body;

    // Check if user is authenticated by code
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing code.' });
    }

    // Find the AccessCode document
    const foundCode = await AccessCode.findOne({ code });
    if (!foundCode) {
      return res.status(401).json({ error: 'Invalid code' });
    }

    // "main_guest" is mandatory
    if (!main_guest || typeof main_guest !== 'object') {
      return res
        .status(400)
        .json({ error: 'Missing or invalid "main_guest" object.' });
    }
    if (typeof main_guest.name !== 'string' || !main_guest.name.trim()) {
      return res
        .status(400)
        .json({ error: 'main_guest "name" must be a non-empty string.' });
    }
    if (typeof main_guest.is_child !== 'boolean') {
      return res
        .status(400)
        .json({ error: 'main_guest "is_child" must be a boolean.' });
    }
    if (typeof main_guest.note !== 'string') {
      return res
        .status(400)
        .json({ error: 'main_guest "note" must be a string.' });
    }

    // Check accomodation_type
    if (
      accomodation_type &&
      !ACCOMODATION_TYPES.includes(accomodation_type)
    ) {
      return res.status(400).json({
        error: `Invalid accomodation_type. Must be one of: ${ACCOMODATION_TYPES.join(
          ', '
        )}`,
      });
    }

    // Validate guests_list if provided
    let finalGuestsList: IPerson[] = [];
    if (guests_list !== undefined) {
      if (!Array.isArray(guests_list)) {
        return res
          .status(400)
          .json({ error: '"guests_list" must be an array if provided.' });
      }

      // Validate each guest in the array
      for (const g of guests_list) {
        if (
          typeof g.name !== 'string' ||
          typeof g.is_child !== 'boolean' ||
          typeof g.note !== 'string'
        ) {
          return res
            .status(400)
            .json({ error: 'Each guest in "guests_list" must have valid fields.' });
        }
      }
      finalGuestsList = guests_list;
    }

    // Check max_guests limit: main_guest + guests_list.length <= max_guests
    const totalGuests = finalGuestsList.length;
    if (totalGuests > foundCode.max_guests) {
      return res.status(400).json({
        error: `Too many guests. max_guests is ${foundCode.max_guests}, but you submitted ${totalGuests} (including main_guest).`,
      });
    }

    // Construct the registration object
    foundCode.registration = {
      accepted: Boolean(accepted), // fallback to false if not provided
      email: typeof email === 'string' ? email : '',
      main_guest: {
        name: main_guest.name,
        is_child: main_guest.is_child,
        note: main_guest.note,
      },
      accomodation_type:
        typeof accomodation_type === 'string' && accomodation_type
          ? accomodation_type
          : 'camping', // default or fallback
      phone_number:
        typeof phone_number === 'string' ? phone_number : '',
      guests_list: finalGuestsList,
    };

    // Mark as used if accepted is true
    if (accepted === true) {
      foundCode.used = true;
    }

    // 9. Save changes
    await foundCode.save();

    return res.json({
      success: true,
      updatedCode: {
        code: foundCode.code,
        max_guests: foundCode.max_guests,
        used: foundCode.used,
        registration: foundCode.registration,
      },
    });
  } catch (error) {
    console.error('Error registering code:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default registerGuest;
