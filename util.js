function isProduction() {
    return process.env.NODE_ENV == 'production';
}

function isDevelopment() {
    return !isProduction();
}

module.exports = {
    isProduction: isProduction,
    isDevelopment: isDevelopment
};
