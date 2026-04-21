const Config = {
    // API_BASE_URL: `http://localhost:5293/api/`,
    API_BASE_URL: `${import.meta.env.VITE_API_URL || 'http://localhost:5293'}/api/`
};

export default Config;
