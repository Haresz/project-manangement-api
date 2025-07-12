import db from "../config/db.js";
import OrganizationModels from "../models/organizations.js";
import OrganizationMembersModels from "../models/organizationMembers.js";

/**
 * Membuat organisasi baru dan secara otomatis mendaftarkan pembuatnya sebagai owner.
 * Semua operasi dibungkus dalam satu transaksi database.
 * @param {object} orgData - Data untuk organisasi baru (misal: { name, description })
 * @param {number} ownerId - ID dari user yang membuat organisasi
 * @returns {Promise<object>} Objek organisasi yang baru dibuat.
 */
export async function createOrganizationAndAddOwner({ data, ownerId }) {
    const client = await db.pool.connect();
    try {
        await client.query("BEGIN");

        const newOrganization = await OrganizationModels.create({ data, db: client });

        const memberData = {
            user_id: ownerId,
            organization_id: newOrganization.id,
            role: "owner"
        };

        await OrganizationMembersModels.createMember({ data: memberData, db: client });

        await client.query("COMMIT");

        return newOrganization;
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Transaction Error - Rollback", error);
        throw new Error("Failed to create organization");
    } finally {
        client.release();
    }
}
