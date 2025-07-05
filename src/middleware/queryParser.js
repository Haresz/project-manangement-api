export function queryParser(options = {}) {
    const allowedColumns = options.allowedColumns || [];

    return (req, res, next) => {
        try {
            // pagination
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 25;
            const offset = (page - 1) * limit;

            // sorting
            const sortQuery = req.query.sort || "-created_at";

            const sorts = sortQuery.split(',')
                .map(srt => {
                    const direction = srt.startsWith("-") ? "DESC" : "ASC";
                    const field = srt.startsWith("-") ? srt.slice(1) : srt;

                    if (allowedColumns.includes(field)) {
                        return { field, direction }
                    }
                    return null
                })
                .filter(Boolean)

            if (sorts.length === 0) {
                sorts.push({ field: "created_at", direction: "DESC" })
            }

            // filtering
            const filters = [];

            for (const key in req.query) {
                // matching this formats
                const match = key.match(/(\w+)\[(\w+)\]/);
                if (match) {
                    const field = match[1];
                    const operator = match[2];
                    const value = req.query[key];

                    if (allowedColumns.includes(field)) {
                        filters.push({ field, operator, value })
                    }

                }
            }

            req.queryOptions = {
                pagination: { limit, offset, page },
                sorts,
            }

            next()
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}