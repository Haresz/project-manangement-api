import db from "../config/db.js";

export async function findAllServices({ tableName, queryOptions, selectQuery = "*" }) {
    const { pagination, sorts, filters } = queryOptions;
    const { limit, offset } = pagination;

    const queryValues = [limit, offset];
    let whereClause = "";
    let paramCounter = 3;

    if (filters && filters.length > 0) {
        const whereConditions = filters.map(filter => {
            const { field, operator, value } = filter;

            switch (operator) {
                case 'eq':
                    queryValues.push(value);
                    return `"${field}" = $${paramCounter++}`;
                case 'ne':
                    queryValues.push(value);
                    return `"${field}" != $${paramCounter++}`;
                case 'gt':
                    queryValues.push(value);
                    return `"${field}" > $${paramCounter++}`;
                case 'gte':
                    queryValues.push(value);
                    return `"${field}" >= $${paramCounter++}`;
                case 'lt':
                    queryValues.push(value);
                    return `"${field}" < $${paramCounter++}`;
                case 'lte':
                    queryValues.push(value);
                    return `"${field}" <= $${paramCounter++}`;
                case 'like':
                    queryValues.push(`%${value}%`);
                    return `"${field}" ILIKE $${paramCounter++}`;
                case "in":
                    const inValues = value.split(',');
                    const inPlacholders = inValues.map((val, i) => {
                        queryValues.push(val);
                        return `$${paramCounter++}`;
                    }).join(',');
                    return `"${field}" IN (${inPlacholders})`

                default:
                    return null;
            }
        }).filter(Boolean);

        if (whereConditions.length > 0) {
            whereClause = `WHERE ${whereConditions.join(" AND ")}`
        }
    }

    const orderByClause = sorts.map(srt => `${srt.field} ${srt.direction}`).join(", ")
    const sqlQuery = `SELECT ${selectQuery} FROM ${tableName} ${whereClause} ORDER BY ${orderByClause} LIMIT $1 OFFSET $2`
    const { rows } = await db.query(sqlQuery, queryValues);

    return rows;
}

export async function countServices({ tableName }) {
    const sqlQuery = `SELECT COUNT(*) FROM ${tableName}`;
    const { rows } = await db.query(sqlQuery);
    return rows[0].count;
}