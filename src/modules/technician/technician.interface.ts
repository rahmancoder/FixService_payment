export type ITechnicianFilters = {
    searchTerm?: string;
    location?: string;
    skill?: string;

    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};