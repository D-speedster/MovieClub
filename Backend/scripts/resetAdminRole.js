/*
 * Quick script to reset the role of a user back to Owner/Admin.
 * Usage: node Backend/scripts/resetAdminRole.js <username> [role]
 *   <username> : the username of the account to update
 *   [role]    : optional, defaults to 'Owner'. Use 'Admin' if preferred.
 *
 * The script connects to the MongoDB using the same connection logic as the app
 * (see utils/db.js) and updates the `role` field of the matching user document.
 */

const mongoose = require('mongoose');
const User = require('../models/user');
const connectDB = require('../utils/db');

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Usage: node Backend/scripts/resetAdminRole.js <username> [role]');
    process.exit(1);
}

const username = args[0];
const newRole = args[1] || 'Owner'; // default to Owner

async function resetRole() {
    try {
        await connectDB();
        const result = await User.findOneAndUpdate({ username }, { role: newRole }, { new: true });
        if (!result) {
            console.error(`User with username "${username}" not found.`);
        } else {
            console.log(`Successfully updated role for "${username}" to "${newRole}".`);
        }
    } catch (err) {
        console.error('Error updating user role:', err);
    } finally {
        mongoose.connection.close();
    }
}

resetRole();

